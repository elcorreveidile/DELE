import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { requireServerAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { BookOpen, GraduationCap, Clock, Trophy } from "lucide-react"

export default async function DashboardPage() {
  const user = await requireServerAuth()

  // Obtener datos del estudiante
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "ACTIVE",
    },
    include: {
      course: {
        include: {
          _count: {
            select: { lessons: true },
          },
        },
      },
    },
  })

  const studentProfile = await prisma.studentProfile.findUnique({
    where: {
      userId: user.id,
    },
  })

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          ¡Hola, {user.name}! 👋
        </h2>
        <p className="mt-2 text-gray-600">
          Bienvenido de vuelta a tu plataforma de preparación DELE
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          label="Cursos activos"
          value={enrollments.length}
          color="blue"
        />
        <StatCard
          icon={GraduationCap}
          label="Nivel objetivo"
          value={studentProfile?.targetLevel || "No definido"}
          color="purple"
        />
        <StatCard
          icon={Clock}
          label="Horas de estudio"
          value={`${studentProfile?.studyHoursPerWeek || 0}h/semana`}
          color="green"
        />
        <StatCard
          icon={Trophy}
          label="Progreso total"
          value={`${Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / Math.max(enrollments.length, 1))}%`}
          color="yellow"
        />
      </div>

      {/* Cursos activos */}
      <div>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Tus cursos activos
          </h3>
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Ver todos
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">
              Aún no estás matriculado en ningún curso
            </p>
            <Link
              href="/dashboard/courses"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Ver cursos disponibles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {enrollment.course.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {enrollment.course._count.lessons} lecciones
                </p>
                
                {/* Barra de progreso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium text-gray-900">
                      {enrollment.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>

                <Link
                  href={`/dashboard/courses/${enrollment.course.id}`}
                  className="mt-4 inline-flex w-full justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver contenido
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon
  label: string
  value: string | number
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
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
