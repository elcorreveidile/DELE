import { requireServerRole } from "@/lib/auth-helpers"
import { AdminNav } from "@/components/admin/admin-nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Solo admin y teacher pueden acceder
  const user = await requireServerRole(["ADMIN", "TEACHER"])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-600 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">Panel de Administración</h1>
              <span className="px-2 py-1 bg-purple-500 rounded text-xs font-medium">
                {user.role}
              </span>
            </div>
            <AdminNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
