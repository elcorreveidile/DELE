import { requireServerRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: { q?: string; level?: string }
}) {
  await requireServerRole(["ADMIN", "TEACHER"])

  const query = searchParams?.q?.trim() || ""
  const level = searchParams?.level

  const courses = await prisma.course.findMany({
    where: {
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(level ? { level } : {}),
    },
    select: {
      id: true,
      title: true,
      level: true,
      published: true,
      featured: true,
      price: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cursos</h2>
        <p className="text-gray-600">Listado de cursos disponibles en la plataforma.</p>
      </div>

      <form className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="grid gap-2 md:grid-cols-2 md:gap-3">
          <label className="text-sm font-medium text-gray-700 md:col-span-2">
            Filtros
          </label>
          <input
            type="text"
            name="q"
            defaultValue={query}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Buscar por título o descripción"
          />
          <select
            name="level"
            defaultValue={level || ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Todos los niveles</option>
            {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 md:justify-end">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Aplicar filtros
          </button>
          <a
            href="/admin/courses"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Limpiar
          </a>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nivel
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alta
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="font-medium">{course.title}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  Nivel {course.level}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="mr-2 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    {course.published ? "Publicado" : "Borrador"}
                  </span>
                  {course.featured && (
                    <span className="inline-flex rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                      Destacado
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {course.price ? `${course.price.toFixed(2)} €` : "Gratis"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {course.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
