import { requireServerRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export default async function AdminEnrollmentsPage() {
  await requireServerRole(["ADMIN", "TEACHER"])

  const enrollments = await prisma.enrollment.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      course: {
        select: { id: true, title: true, level: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Matrículas</h2>
        <p className="text-gray-600">
          Últimas 50 matrículas con su progreso y estado.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estudiante
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progreso
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Desde
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="font-medium">{enrollment.course?.title}</div>
                  <div className="text-xs text-gray-500">
                    Nivel {enrollment.course?.level}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="font-medium">
                    {enrollment.user?.name || "Sin nombre"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {enrollment.user?.email}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {enrollment.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {enrollment.progress}%
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {enrollment.startedAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
