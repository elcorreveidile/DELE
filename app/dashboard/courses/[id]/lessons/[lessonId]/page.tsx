import Link from "next/link"
import { notFound } from "next/navigation"
import { requireServerAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

const sampleLessonContent = {
  id: "sample-0",
  title: "Lección 0: Introducción y guía de estudio",
  content: `
## Bienvenida al curso

Esta lección 0 es gratuita y te adelanta qué vas a encontrar:

- Cómo está estructurado el curso y el orden recomendado.
- Cómo aprovechar las tareas corregidas y los simulacros cronometrados.
- Consejos para organizar tus horas semanales.

## Plan de estudio sugerido
1) Revisa la lección de estrategia inicial.
2) Completa los ejercicios de muestra.
3) Agenda 2 simulacros cortos esta semana.

## Recursos
- Checklist de preparación.
- Modelo de hoja de ruta semanal.
  `,
}

export default async function LessonPage({
  params,
}: {
  params: { id: string; lessonId: string }
}) {
  const user = await requireServerAuth()
  const { id: courseId, lessonId } = params

  const course = await prisma.course.findFirst({
    where: {
      OR: [{ id: courseId }, { slug: courseId }],
    },
    select: { id: true, title: true, level: true, slug: true },
  })

  if (!course) {
    notFound()
  }

  if (lessonId === "sample-0") {
    return (
      <LessonLayout
        courseId={course.id}
        courseTitle={course.title}
        title={sampleLessonContent.title}
        content={sampleLessonContent.content}
        isFree
      />
    )
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: { select: { id: true, title: true, level: true } },
    },
  })

  if (!lesson || lesson.courseId !== course.id) {
    notFound()
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  })

  const canAccess = lesson.isFree || Boolean(enrollment)

  return (
    <LessonLayout
      courseId={course.id}
      courseTitle={course.title}
      title={`Lección ${lesson.order}: ${lesson.title}`}
      content={lesson.content}
      isFree={lesson.isFree}
      canAccess={canAccess}
    />
  )
}

function LessonLayout({
  courseId,
  courseTitle,
  title,
  content,
  isFree,
  canAccess = true,
}: {
  courseId: string
  courseTitle: string
  title: string
  content: string
  isFree?: boolean
  canAccess?: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
            {courseTitle}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-xs text-gray-500">
            {isFree ? "Previsualización gratuita" : "Contenido completo"}
          </p>
        </div>
        <Link
          href={`/dashboard/courses/${courseId}`}
          className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver al curso
        </Link>
      </div>

      {!canAccess ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          No tienes acceso a esta lección. Solicita matrícula para verla completa.
        </div>
      ) : (
        <article className="prose prose-gray max-w-none rounded-lg border border-gray-200 bg-white p-6">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
        </article>
      )}
    </div>
  )
}

// Renderizado simple de markdown para el ejemplo; puedes sustituir por un parser real si lo necesitas.
function markdownToHtml(md: string) {
  return md
    .split("\n")
    .map((line) => {
      if (line.startsWith("## ")) return `<h2>${line.replace("## ", "")}</h2>`
      if (line.startsWith("- ")) return `<li>${line.replace("- ", "")}</li>`
      if (line.startsWith("1)")) return `<li>${line}</li>`
      return `<p>${line}</p>`
    })
    .join("")
}
