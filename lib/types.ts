export interface Room {
  id: string
  name: string
  branchId: string
  capacity: number
  pricePerHour: number
  isActive: boolean
  status?: "Available" | "Occupied" | "Maintenance"
}

export interface Roof {
  id: string
  name: string
  branchId: string
  capacity: number
  pricePerHour: number
  isActive: boolean
  status?: "Available" | "Occupied" | "Maintenance"
}

export interface Booking {
  id: string
  userId: string
  userEmail: string
  roomId?: string
  roofId?: string
  branchId: string
  branchName: string
  roomName?: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "COMPLETED"
  depositScreenshotUrl?: string
  createdAt?: string
  guestName?: string
  numberOfGuests?: number
}

export interface Branch {
  id: string
  name: string
  location: string
}

export interface Notification {
  id: string
  userId: string
  text: string
  type: string
  relatedId?: string
  isRead: boolean
  createdAt: string
}
