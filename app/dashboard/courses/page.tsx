import Link from "next/link"
import { requireServerAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export default async function DashboardCoursesPage() {
  const user = await requireServerAuth()

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          level: true,
          _count: { select: { lessons: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const publishedCourses =
    enrollments.length === 0
      ? await prisma.course.findMany({
          where: { published: true },
          select: {
            id: true,
            title: true,
            level: true,
            price: true,
            description: true,
          },
          orderBy: { createdAt: "desc" },
        })
      : []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mis cursos</h2>
        <p className="text-gray-600">
          Accede a tus cursos activos y revisa tu progreso.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
            Aún no estás matriculado en ningún curso.
          </div>

          {publishedCourses.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Cursos disponibles
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {publishedCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/dashboard/courses/${course.id}`}
                    className="rounded-lg border border-gray-200 bg-white p-5"
                  >
                    <div className="text-sm text-gray-500">
                      Nivel {course.level}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-900">
                      <span className="font-semibold">
                        {course.price ? `${course.price} €` : "Gratis"}
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        Nivel {course.level}
                      </span>
                    </div>
                    <div className="mt-4 inline-flex w-full justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                      Ver contenido
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {enrollments.map((enrollment) => (
            <Link
              key={enrollment.id}
              href={`/dashboard/courses/${enrollment.course?.id}`}
              className="group block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-500">
                    Nivel {enrollment.course?.level}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {enrollment.course?.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {enrollment.course?._count.lessons} lecciones
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {enrollment.progress}% progreso
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progreso</span>
                  <span className="font-medium text-gray-900">
                    {enrollment.progress}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-blue-700">
                Ver contenido
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
