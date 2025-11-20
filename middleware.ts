import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export default auth((req) => {
  const user = req.auth?.user
  const pathname = req.nextUrl.pathname

  // Sin sesión, redirigir a login (se aplica solo en rutas del matcher)
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Verificar acceso al admin (solo ADMIN y TEACHER)
  if (pathname.startsWith("/admin")) {
    if (user.role !== "ADMIN" && user.role !== "TEACHER") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
})

// Rutas que requieren autenticación
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
}
