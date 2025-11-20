import { redirect } from "next/navigation"
import { auth } from "./auth"
import type { Role } from "@prisma/client"

export async function getServerUser() {
  const session = await auth()
  return session?.user
}

export async function requireServerAuth() {
  const user = await getServerUser()
  
  if (!user) {
    redirect("/login")
  }
  
  return user
}

export async function requireServerRole(allowedRoles: Role[]) {
  const user = await requireServerAuth()
  
  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard")
  }
  
  return user
}

export async function checkServerRole(allowedRoles: Role[]) {
  const user = await getServerUser()
  
  if (!user) return false
  
  return allowedRoles.includes(user.role)
}
