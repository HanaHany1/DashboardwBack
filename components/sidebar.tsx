"use client"

import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from "@/lib/auth-context"
import { LogOut, LayoutGrid, Bell } from 'lucide-react'
import Image from 'next/image' // <--- هذا هو السطر المطلوب إضافته
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutGrid,
    },
    {
      label: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
    },
  ]

  return (
  <div className="w-52 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image src="/shaghaf-logo.png" alt="Shaghaf Logo" width={50} height={50} />
          <h1 className="font-bold text-lg">Shagaf</h1>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        <p className="text-xs font-semibold text-gray-500 px-3 mb-3">MAIN MENU</p>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-teal-50 text-teal-600" : "text-gray-600 hover:bg-gray-50",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

        {user && (
          <div className="px-3 py-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-600">Manager</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  )
}
