"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"
import type { Booking } from "@/lib/types"
import { Calendar, Clock, Users, DollarSign, Check, X } from "lucide-react"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<"PENDING" | "CONFIRMED" | "REJECTED" | "ALL">("PENDING")

  useEffect(() => {
    loadBookings()
  }, [user?.id])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getPendingBookings()
      setBookings(Array.isArray(data) ? data : data.bookings || [])
    } catch (error) {
      console.error("[v0] Failed to load bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (bookingId: string) => {
    try {
      setActionLoading(bookingId)
      await apiClient.approveBooking(bookingId)
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "CONFIRMED" } : b)))
    } catch (error) {
      console.error("Failed to approve:", error)
      alert("Failed to approve booking")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (bookingId: string) => {
    try {
      setActionLoading(bookingId)
      await apiClient.rejectBooking(bookingId)
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "REJECTED" } : b)))
    } catch (error) {
      console.error("Failed to reject:", error)
      alert("Failed to reject booking")
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const filteredBookings = statusFilter === "ALL" ? bookings : bookings.filter((b) => b.status === statusFilter)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications & Requests</h1>
        <p className="text-gray-600 mt-1">Manage booking requests and approvals</p>
      </div>

      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-900">
          <strong>Developer Note:</strong> This list is structured to easily map to a backend API response. The
          'bookings' array in DashboardContext can be replaced with a useQuery hook fetching from your endpoint (e.g.,
          GET /api/bookings).
        </AlertDescription>
      </Alert>

      <div className="mb-6 flex gap-2">
        {(["PENDING", "CONFIRMED", "REJECTED", "ALL"] as const).map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className={statusFilter === status ? "bg-teal-600 hover:bg-teal-700" : ""}
          >
            {status}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="border-l-4 border-l-teal-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{booking.guestName || booking.userEmail}</CardTitle>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                    <CardDescription className="mt-2">
                      {booking.roomName || "Room"} • {booking.branchName || "Branch"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-semibold text-sm">{booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="font-semibold text-sm">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Guests</p>
                      <p className="font-semibold text-sm">{booking.numberOfGuests || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-semibold text-sm text-teal-600">{booking.totalPrice} EGP</p>
                    </div>
                  </div>
                </div>

                {booking.depositScreenshotUrl && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-2">PAYMENT PROOF</p>
                    <img
                      src={booking.depositScreenshotUrl || "/placeholder.svg"}
                      alt="Payment proof"
                      className="max-h-40 rounded border border-gray-200"
                    />
                  </div>
                )}

                {booking.status === "PENDING" && (
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      className="flex-1 bg-teal-500 hover:bg-teal-600"
                      onClick={() => handleApprove(booking.id)}
                      disabled={actionLoading === booking.id}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {actionLoading === booking.id ? "Processing..." : "Accept"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleReject(booking.id)}
                      disabled={actionLoading === booking.id}
                    >
                      <X className="w-4 h-4 mr-2" />
                      {actionLoading === booking.id ? "Processing..." : "Decline"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-gray-500">No {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""} bookings</p>
        </Card>
      )}
    </div>
  )
}
