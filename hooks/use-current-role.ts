"use client"

import { useCurrentUser } from "./use-current-user"
import type { Role } from "@prisma/client"

export function useCurrentRole() {
  const { user } = useCurrentUser()
  return user?.role
}

export function useIsAdmin() {
  const role = useCurrentRole()
  return role === "ADMIN"
}

export function useIsTeacher() {
  const role = useCurrentRole()
  return role === "TEACHER"
}

export function useIsStudent() {
  const role = useCurrentRole()
  return role === "STUDENT"
}

export function useHasRole(allowedRoles: Role[]) {
  const role = useCurrentRole()
  return role ? allowedRoles.includes(role) : false
}