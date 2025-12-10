"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { apiClient } from "@/lib/api-client"

interface BranchCredentials {
  id: string
  name: string
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [branches, setBranches] = useState<BranchCredentials[]>([])
  const [selectedBranch, setSelectedBranch] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loadingBranches, setLoadingBranches] = useState(true)

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchesData = await apiClient.getBranches()
        console.log("[v0] Branches fetched:", branchesData)
        // Map branches to credentials structure - adjust based on your backend response
        const mappedBranches = branchesData.map((branch: any) => ({
          id: branch.id,
          name: branch.name,
          email: branch.email || `admin@${branch.name.toLowerCase().replace(/\s+/g, '')}`,
          password: branch.password || "",
        }))
        setBranches(mappedBranches)
        if (mappedBranches.length > 0) {
          setSelectedBranch(mappedBranches[0].id)
          setEmail(mappedBranches[0].email)
          setPassword(mappedBranches[0].password)
        }
      } catch (err) {
        console.log("[v0] Error fetching branches:", err)
        setError("Failed to load branches")
      } finally {
        setLoadingBranches(false)
      }
    }

    fetchBranches()
  }, [])

  // Update email and password when branch is selected
  const handleBranchChange = (branchId: string) => {
    const selectedBranchData = branches.find(b => b.id === branchId)
    if (selectedBranchData) {
      setSelectedBranch(branchId)
      setEmail(selectedBranchData.email)
      setPassword(selectedBranchData.password)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/shaghaf-logo.png"
              alt="Shagaf Co-working Space"
              width={300}
              height={300}
              // className="w-auto h-auto"
              priority
            />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="branch@shagaf.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={isLoading || loadingBranches}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-xs text-gray-500">
            © 2025 Shagaf Co-working Space. All rights reserved.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
