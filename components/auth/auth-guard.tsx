"use client"

import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/hooks/use-current-user"
import type { Role } from "@prisma/client"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: Role[]
  fallbackUrl?: string
}

export function AuthGuard({ 
  children, 
  allowedRoles,
  fallbackUrl = "/dashboard"
}: AuthGuardProps) {
  const router = useRouter()
  const { user, isLoading } = useCurrentUser()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push(fallbackUrl)
      }
    }
  }, [user, isLoading, allowedRoles, fallbackUrl, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}