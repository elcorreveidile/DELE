"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  User, 
  Settings,
  LogOut,
  Shield
} from "lucide-react"
import type { User as SessionUser } from "next-auth"

interface DashboardNavProps {
  user: SessionUser
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mis Cursos", href: "/dashboard/courses", icon: BookOpen },
    { name: "IA Personal", href: "/dashboard/ai/personal", icon: MessageSquare },
    { name: "Perfil", href: "/dashboard/profile", icon: User },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="flex items-center gap-4">
      {/* Navegación principal */}
      <nav className="hidden md:flex items-center gap-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Link al admin (solo para admin y teacher) */}
      {(user.role === "ADMIN" || user.role === "TEACHER") && (
        <Link
          href="/admin"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden md:inline">Admin</span>
        </Link>
      )}

      {/* User menu */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Salir</span>
        </button>
      </div>
    </div>
  )
}