"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, BookOpen, Users, CreditCard, LogOut } from "lucide-react"
export function AdminNav() {
  const pathname = usePathname()

  const navigation = [
    { name: "Vista General", href: "/admin", icon: LayoutDashboard },
    { name: "Cursos", href: "/admin/courses", icon: BookOpen },
    { name: "Usuarios", href: "/admin/users", icon: Users },
    { name: "Matrículas", href: "/admin/enrollments", icon: CreditCard },
  ]

  return (
    <div className="flex items-center gap-4">
      <nav className="hidden md:flex items-center gap-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-purple-500"
                  : "hover:bg-purple-500/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <Link
        href="/dashboard"
        className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-500/50 transition-colors"
      >
        Ir al Dashboard
      </Link>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-500/50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden md:inline">Salir</span>
      </button>
    </div>
  )
}
