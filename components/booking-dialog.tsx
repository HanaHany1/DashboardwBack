"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"

interface BookingDialogProps {
  isOpen: boolean
  onClose: () => void
  roomId?: string
  roofId?: string
  onSuccess?: () => void
}

export function BookingDialog({ isOpen, onClose, roomId, roofId, onSuccess }: BookingDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    guestName: "",
    numberOfGuests: "",
    date: "",
    startTime: "",
    endTime: "",
    totalPrice: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiClient.createBooking({
        roomId,
        roofId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        totalPrice: Number.parseFloat(formData.totalPrice),
      })

      alert("Booking created successfully!")
      onClose()
      onSuccess?.()
      setFormData({
        guestName: "",
        numberOfGuests: "",
        date: "",
        startTime: "",
        endTime: "",
        totalPrice: "",
      })
    } catch (error) {
      alert("Failed to create booking. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
          <DialogDescription>Fill in the booking details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name</Label>
            <Input
              id="guestName"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              placeholder="Enter guest name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfGuests">Number of Guests</Label>
            <Input
              id="numberOfGuests"
              name="numberOfGuests"
              type="number"
              value={formData.numberOfGuests}
              onChange={handleChange}
              placeholder="Enter number of guests"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalPrice">Total Price (EGP)</Label>
            <Input
              id="totalPrice"
              name="totalPrice"
              type="number"
              step="0.01"
              value={formData.totalPrice}
              onChange={handleChange}
              placeholder="Enter total price"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-600" disabled={loading}>
              {loading ? "Creating..." : "Create Booking"}
            </Button>
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
