"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, X } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import type { Room, Roof } from "@/lib/types"

interface RoomDetails {
  id: string
  name: string
  capacity: number
  status: string
  type: string
}

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [roofs, setRoofs] = useState<Roof[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("room")
  const [selectedSpace, setSelectedSpace] = useState<RoomDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [roomsData, roofsData] = await Promise.all([
        apiClient.getRooms().catch(() => []),
        apiClient.getRoofs().catch(() => []),
      ])

      // في ملف page.tsx، داخل loadData
      const transformedRooms = (roomsData || []).map((room: any, index: number) => ({
        id: room.id || room.name || `room-${index}`,

        name: room['name-en'] || room.name || `Room ${index + 1}`,
        capacity: room.capacity || 0,
        status: room.status || "Available",
        branchId: room.branchId || "",
        pricePerHour: room.pricePerHour || 0,
        isActive: room.isActive !== false,
      }))

      const transformedRoofs = (roofsData || []).map((roof: any, index: number) => ({
        id: roof.id || roof.name || `roof-${index}`,
        name: roof.name || `Roof ${index + 1}`,
        capacity: roof.capacity || 0,
        status: roof.status || "Available",
        branchId: roof.branchId || "",
        pricePerHour: roof.pricePerHour || 0,
        isActive: roof.isActive !== false,
      }))

      setRooms(transformedRooms)
      setRoofs(transformedRoofs)
    } catch (error) {
      console.log("[v0] Load data error:", error)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleSpaceSelect = (space: Room | Roof) => {
    console.log("Selected Space Name:", space.name); // <--- أضيفي هذا السطر
    let spaceType = activeTab === "room" ? "Room" : "Roof";

    // <--- الكود الجديد لإضافة نوع "Gaming Room"
    if (activeTab === "room" && space.name) {
      // التحقق مما إذا كان الاسم يحتوي على كلمة "gaming" (بصرف النظر عن حالة الأحرف)
      if (space.name.toLowerCase().includes("gaming")) {
        spaceType = "Gaming Room";
      }
    }
    // <--- نهاية الكود الجديد

    setSelectedSpace({
      id: space.id,
      name: space.name,
      capacity: space.capacity || 0,
      status: space.status || "Available",
      type: spaceType, // هنا نستخدم النوع المخصص
    })
  }

  return (
    <div className="flex h-full gap-6 p-6 bg-gray-50">
      {/* LEFT SIDE */}
      <div className="flex-1 overflow-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-600 text-sm">{error}</div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-50 border border-gray-300 rounded-xl p-1 flex gap-1 shadow-sm w-fit">
            <TabsTrigger
              value="room"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-lg text-gray-600"
            >
              Room
            </TabsTrigger>

            <TabsTrigger
              value="roof"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-lg text-gray-600"
            >
              Roof
            </TabsTrigger>
          </TabsList>

          {/* ROOMS */}
          <TabsContent value="room" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <p className="text-gray-500">Loading rooms...</p>
              ) : rooms.length ? (
                rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleSpaceSelect(room)}
                    className={`p-6 border-2 rounded-xl hover:border-blue-500 hover:shadow-md cursor-pointer transition-all bg-white relative ${selectedSpace?.id === room.id && activeTab === "room"
                      ? "border-blue-600 shadow-lg bg-blue-50"
                      : "border-gray-200"
                      }`}
                  >
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-400 text-white rounded-full text-xs flex items-center justify-center">
                      1
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-600 uppercase">{room.id}</p>
                      <div className="flex justify-center gap-2 text-gray-500 text-xs">
                        <Users className="w-4 h-4" />
                        <span>{room.capacity}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No rooms available</p>
              )}
            </div>
          </TabsContent>

          {/* ROOFS */}
          <TabsContent value="roof" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <p className="text-gray-500">Loading roofs...</p>
              ) : roofs.length ? (
                roofs.map((roof) => (
                  <div
                    key={roof.id}
                    onClick={() => handleSpaceSelect(roof)}
                    className={`p-6 border-2 rounded-xl hover:border-blue-500 hover:shadow-md cursor-pointer transition-all bg-white ${selectedSpace?.id === roof.id && activeTab === "roof"
                      ? "border-blue-600 shadow-lg bg-blue-50"
                      : "border-gray-200"
                      }`}
                  >
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">{roof.name}</h3>
                      <p className="text-sm text-gray-600 uppercase">{roof.id}</p>
                      <div className="flex justify-center gap-2 text-gray-500 text-xs">
                        <Users className="w-4 h-4" />
                        <span>{roof.capacity}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No roofs available</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* RIGHT PANEL */}
      {selectedSpace && (
        <div className="w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-auto">
          <div className="sticky top-0 p-4 bg-white border-b flex justify-between">
            <div>
              <h2 className="text-lg font-bold">{selectedSpace.name}</h2>
              <p className="text-sm text-gray-500">
                {selectedSpace.type} • {selectedSpace.capacity} People
              </p>
            </div>
            <button onClick={() => setSelectedSpace(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">CURRENT STATUS</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${selectedSpace.status === "Available" ? "bg-green-500" : "bg-red-500"}`}
                />
                <span className="font-medium text-gray-900">{selectedSpace.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-600">Capacity</p>
                <div className="flex gap-2 items-center">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-lg font-bold">{selectedSpace.capacity || "—"}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600">Type</p>
                <p className="font-bold text-gray-900">{selectedSpace.type}</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center border-t pt-4">
              No pending booking requests for this space.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
