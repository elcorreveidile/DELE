import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Verificar acceso al admin (solo ADMIN y TEACHER)
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN" && token?.role !== "TEACHER") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// Rutas que requieren autenticación
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
}