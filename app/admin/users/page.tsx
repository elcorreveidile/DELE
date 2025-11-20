import { requireServerRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  await requireServerRole(["ADMIN", "TEACHER"])

  const query = searchParams?.q?.trim() || ""

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { email: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
        <p className="text-gray-600">Listado básico de usuarios registrados.</p>
      </div>

      <form className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <label className="text-sm font-medium text-gray-700">
          Buscar por nombre o email
        </label>
        <div className="flex w-full gap-2 md:w-auto">
          <input
            type="text"
            name="q"
            defaultValue={query}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 md:w-64"
            placeholder="Ej: juan o @dele.com"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Filtrar
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alta
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {user.name || "Sin nombre"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
