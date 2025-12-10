"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideFolder as Placeholder } from 'lucide-react'

export default function CustomersPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard/customers")
  }, [router])

  return null
}
