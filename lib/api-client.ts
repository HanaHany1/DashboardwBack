const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://co-work-backend-test.up.railway.app"

export const apiClient = {
  // Auth endpoints
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || "Login failed")
    }
    return res.json()
  },

  async getMe() {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("No authentication token")
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Failed to fetch user")
    return res.json()
  },


  // Rooms endpoints
  async getRooms() {
  // قائمة بأسماء الغرف التي تعمل عند جلبها بشكل منفرد
  const roomIdentifiers = [ 
    "Small Study Room", 
    
    // <--- نستخدم الاسم الذي يعمل (study room3 بأحرف صغيرة)
    "study room3",        
    
    // <--- نستخدم الاسم الذي أكدتِ أنه يعمل
    "gaming room2",       
    
    // <--- تم التعديل لإضافة مسافة في النهاية لحل مشكلة "Room not found" لـ "gaming room"
    "gaming room ",        
  ]

    try {
      // نستخدم Promise.all لجلب جميع الغرف بالتوازي
      const roomPromises = roomIdentifiers.map(identifier =>
        // getRoomById موجودة بالفعل في ملفك، وتستخدم الـ ID أو الاسم
        apiClient.getRoomById(identifier).catch((error) => {
          console.error(`[Final] Failed to fetch room ${identifier}:`, error.message);
          return null;
        })
      )

      const results = await Promise.all(roomPromises)

      // تصفية النتائج وإزالة أي غرفة فشل جلبها (القيمة null)
      const validRooms = results.filter(room => room !== null)

      console.log(`[Final] Successfully fetched ${validRooms.length} rooms individually out of ${roomIdentifiers.length}.`)

      return validRooms
    } catch (error) {
      console.log("[Final] General Rooms fetch error during individual calls:", error)
      return []
    }
  },

  async getRoomById(roomId: string) {
    // هذه الدالة مهمة جداً لنجاح العملية
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://co-work-backend-test.up.railway.app";
    // نستخدم encodeURIComponent لضمان أن الأسماء التي تحتوي على مسافات تعمل في URL
    const res = await fetch(`${API_BASE_URL}/api/rooms/${encodeURIComponent(roomId)}`)

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}))
      throw new Error(errorBody.message || `Failed to fetch room with identifier: ${roomId} (Status: ${res.status})`)
    }
    return res.json()
  },

  // Roof endpoints

  // Roof endpoints
  async getRoofs() {
    const res = await fetch(`${API_BASE_URL}/roof`)
    if (!res.ok) throw new Error("Failed to fetch roofs")
    const data = await res.json()
    // <--- التعديل هنا ليتعامل مع الـ Array أو الكائن الذي يحتوي على roofs/data
    return Array.isArray(data) ? data : data.roofs || data.data || [] //
  },
  async getRoofById(roofId: string) {
    const res = await fetch(`${API_BASE_URL}/roof/${roofId}`)
    if (!res.ok) throw new Error("Failed to fetch roof")
    return res.json()
  },

  async getRoofsByBranch(branchId: string) {
    const res = await fetch(`${API_BASE_URL}/roof/branch/${branchId}`)
    if (!res.ok) throw new Error("Failed to fetch roofs")
    const data = await res.json()
    return Array.isArray(data) ? data : data.roofs || []
  },

  // Bookings endpoints
  async createBooking(bookingData: any) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/api/bookings/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || "Failed to create booking")
    }
    return res.json()
  },

  async getBookings() {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/api/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Failed to fetch bookings")
    const data = await res.json()
    return Array.isArray(data) ? data : data.bookings || []
  },

  async getBookingById(bookingId: string) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Failed to fetch booking")
    return res.json()
  },

  // Admin endpoints
  async getPendingBookings() {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })

      if (!res.ok) {
        console.log("[v0] Failed to fetch bookings. Status:", res.status)
        return []
      }

      const data = await res.json()
      return Array.isArray(data) ? data : data.bookings || data.data || []
    } catch (error) {
      console.log("[v0] Bookings fetch error:", error)
      return []
    }
  },

  async approveBooking(bookingId: string) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/booking/${bookingId}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || "Failed to approve booking")
    }
    return res.json()
  },

  async rejectBooking(bookingId: string) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/booking/${bookingId}/reject`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || "Failed to reject booking")
    }
    return res.json()
  },

  async setAdmin(userId: string, email: string) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/api/admin/set-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, email }),
    })
    if (!res.ok) throw new Error("Failed to set admin")
    return res.json()
  },

  // Notifications endpoints
  async getNotifications(userId: string) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/api/notifications/my-notifications?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Failed to fetch notifications")
    const data = await res.json()
    return Array.isArray(data) ? data : data.notifications || []
  },

  async markNotificationAsRead(notificationId: string) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/api/notifications/mark-as-read?notiId=${notificationId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Failed to mark notification as read")
    return res.json()
  },

  // Branches endpoints
  async getBranches() {
    const res = await fetch(`${API_BASE_URL}/api/branches`)
    if (!res.ok) throw new Error("Failed to fetch branches")
    const data = await res.json()
    return Array.isArray(data) ? data : data.branches || []
  },

  async getBranchById(branchId: string) {
    const res = await fetch(`${API_BASE_URL}/api/branches/${branchId}`)
    if (!res.ok) throw new Error("Failed to fetch branch")
    return res.json()
  },

  // Events endpoints
  async getEvents() {
    const res = await fetch(`${API_BASE_URL}/api/events`)
    if (!res.ok) throw new Error("Failed to fetch events")
    const data = await res.json()
    return Array.isArray(data) ? data : data.events || []
  },

  async getEventById(eventId: string) {
    const res = await fetch(`${API_BASE_URL}/api/events/${eventId}`)
    if (!res.ok) throw new Error("Failed to fetch event")
    return res.json()
  },

  async getEventsByBranch(branchId: string) {
    const res = await fetch(`${API_BASE_URL}/api/events/branch/${branchId}`)
    if (!res.ok) throw new Error("Failed to fetch events")
    const data = await res.json()
    return Array.isArray(data) ? data : data.events || []
  },

  // Games endpoints
  async getGames() {
    const res = await fetch(`${API_BASE_URL}/api/games/all`)
    if (!res.ok) throw new Error("Failed to fetch games")
    const data = await res.json()
    return Array.isArray(data) ? data : data.games || []
  },

  async getGameById(gameId: string) {
    const res = await fetch(`${API_BASE_URL}/api/games/${gameId}`)
    if (!res.ok) throw new Error("Failed to fetch game")
    return res.json()
  },

  // Payment endpoints
  async uploadPaymentProof(bookingId: string, file: File) {
    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("file", file)
    formData.append("bookingId", bookingId)

    const res = await fetch(`${API_BASE_URL}/api/payment/upload-proof`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    if (!res.ok) throw new Error("Failed to upload payment proof")
    return res.json()
  },
}
