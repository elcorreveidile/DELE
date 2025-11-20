import Link from "next/link"
import { requireServerAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export default async function CourseDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await requireServerAuth()

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          duration: true,
          isFree: true,
        },
      },
    },
  })

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: params.id,
      },
    },
  })

  if (!course) {
    return (
      <div className="space-y-3">
        <p className="text-lg font-semibold text-gray-900">
          Curso no encontrado
        </p>
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver a mis cursos
        </Link>
      </div>
    )
  }

  const sampleLesson = {
    id: "sample-0",
    order: 0,
    title: "Lección 0: Introducción y guía de estudio",
    description:
      "Acceso libre para que conozcas el enfoque del curso, la estructura de las tareas y cómo organizar tu estudio semanal.",
    duration: 10,
    isFree: true,
    contentPoints: [
      "Objetivos del curso y qué esperar en cada módulo.",
      "Cómo usar las hojas de ruta semanales y los simulacros.",
      "Consejos rápidos para aprovechar las correcciones y feedback.",
    ],
  }

  const lessons = [sampleLesson, ...course.lessons]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-600">
            Nivel {course.level}
          </p>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          {course.description && (
            <p className="mt-2 max-w-3xl text-gray-700">{course.description}</p>
          )}
        </div>
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver a mis cursos
        </Link>
      </div>

      {!enrollment && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          No estás matriculado en este curso. Solicita acceso desde tus cursos.
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Contenido del curso
        </h2>
        {lessons.length === 0 ? (
          <p className="text-gray-600 text-sm">Aún no hay lecciones publicadas.</p>
        ) : (
          <ol className="space-y-3">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
                className={`block rounded-lg border px-4 py-3 transition hover:-translate-y-0.5 hover:shadow ${
                  lesson.id === "sample-0"
                    ? "border-blue-200 bg-blue-50/60"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Lección {lesson.order}
                    </p>
                    <h3 className="text-base font-semibold text-gray-900">
                      {lesson.title}
                    </h3>
                    {lesson.description && (
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                    )}
                    {"contentPoints" in lesson && lesson.contentPoints && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                        {lesson.contentPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {lesson.duration ? `${lesson.duration} min` : "Flexible"}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {lesson.isFree ? "Previsualización gratuita" : "Contenido completo"}
                </div>
              </Link>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
