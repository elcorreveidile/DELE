import { requireServerRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { Users, BookOpen, GraduationCap, DollarSign } from "lucide-react"

export default async function AdminPage() {
  const user = await requireServerRole(["ADMIN", "TEACHER"])

  // Obtener estadísticas
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    activeEnrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: "ACTIVE" } }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Panel de Administración
        </h2>
        <p className="mt-2 text-gray-600">
          Vista general de la plataforma
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          icon={Users}
          label="Total Usuarios"
          value={totalUsers}
          color="blue"
        />
        <AdminStatCard
          icon={BookOpen}
          label="Total Cursos"
          value={totalCourses}
          color="purple"
        />
        <AdminStatCard
          icon={GraduationCap}
          label="Matrículas Activas"
          value={activeEnrollments}
          color="green"
        />
        <AdminStatCard
          icon={DollarSign}
          label="Total Matrículas"
          value={totalEnrollments}
          color="yellow"
        />
      </div>
    </div>
  )
}

function AdminStatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any
  label: string
  value: number
  color: "blue" | "purple" | "green" | "yellow"
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}