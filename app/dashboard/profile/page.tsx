import { requireServerAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/dashboard/profile-form"

function AvatarPreview({ name, image }: { name?: string | null; image?: string | null }) {
  const initials = (name || "DELE")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "DE"

  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name ?? "Avatar"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600">
            {initials}
          </div>
        )}
      </div>
      <div className="text-sm text-gray-600">
        <p className="font-semibold text-gray-900">{name || "Sin nombre"}</p>
        <p>{image ? "Avatar cargado" : "Sin avatar, usa la URL abajo"}</p>
      </div>
    </div>
  )
}

export default async function DashboardProfilePage() {
  const user = await requireServerAuth()

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: user.id },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Perfil</h2>
        <p className="text-gray-600">
          Datos básicos de tu cuenta y objetivos DELE.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-gray-900">Cuenta</h3>
          <div className="mt-3">
            <AvatarPreview name={user.name} image={user.image} />
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Para cambiar avatar, usa el botón de subida en el formulario de abajo.
          </p>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <div>
              <span className="font-medium text-gray-900">Nombre: </span>
              {user.name || "No definido"}
            </div>
            <div>
              <span className="font-medium text-gray-900">Email: </span>
              {user.email}
            </div>
            <div>
              <span className="font-medium text-gray-900">Rol: </span>
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-gray-900">Objetivo DELE</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <div>
              <span className="font-medium text-gray-900">Nivel objetivo: </span>
              {studentProfile?.targetLevel || "Sin definir"}
            </div>
            <div>
              <span className="font-medium text-gray-900">Nivel actual: </span>
              {studentProfile?.currentLevel || "Sin definir"}
            </div>
            <div>
              <span className="font-medium text-gray-900">Horas/semana: </span>
              {studentProfile?.studyHoursPerWeek ?? "No indicado"}
            </div>
            <div>
              <span className="font-medium text-gray-900">Examen: </span>
              {studentProfile?.examDate
                ? new Date(studentProfile.examDate).toLocaleDateString()
                : "Sin fecha"}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Actualiza tu objetivo DELE
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Define tu nivel actual, objetivo, horas semanales y fecha de examen.
        </p>
        <div className="mt-4">
          <ProfileForm
            name={user.name}
            avatarUrl={user.image}
            currentLevel={studentProfile?.currentLevel}
            targetLevel={studentProfile?.targetLevel}
            studyHoursPerWeek={studentProfile?.studyHoursPerWeek}
            examDate={
              studentProfile?.examDate
                ? studentProfile.examDate.toISOString()
                : null
            }
          />
        </div>
      </div>
    </div>
  )
}
