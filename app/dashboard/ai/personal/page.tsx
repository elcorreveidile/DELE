import { requireServerAuth } from "@/lib/auth-helpers"

export default async function DashboardAIPersonalPage() {
  const user = await requireServerAuth()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">IA Personal</h2>
        <p className="text-gray-600">
          Conversa con tu asistente DELE para resolver dudas, practicar y
          recibir feedback.
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-lg font-semibold text-gray-900">
          Próximamente
        </p>
        <p className="mt-2 text-gray-600">
          Estamos preparando el chat personal con contexto de tus cursos y
          progreso. Quédate atento.
        </p>
        <p className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {user.email}
        </p>
      </div>
    </div>
  )
}
