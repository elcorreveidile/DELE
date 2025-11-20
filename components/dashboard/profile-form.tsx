"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useUploadThing } from "@/lib/uploadthing-client"

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"]

interface ProfileFormProps {
  name?: string | null
  avatarUrl?: string | null
  currentLevel?: string | null
  targetLevel?: string | null
  studyHoursPerWeek?: number | null
  examDate?: string | null
}

export function ProfileForm({
  name,
  avatarUrl,
  currentLevel,
  targetLevel,
  studyHoursPerWeek,
  examDate,
}: ProfileFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const { startUpload, isUploading } = useUploadThing("avatarUploader", {
    onClientUploadComplete: (res) => {
      const file = res?.[0]
      if (file?.url) {
        setFormState((prev) => ({ ...prev, avatarUrl: file.url }))
        setMessage("Avatar subido. No olvides guardar los cambios.")
      }
    },
    onUploadError: (err) => {
      setError(err.message || "Error al subir la imagen")
    },
  })
  const [formState, setFormState] = useState({
    name: name ?? "",
    avatarUrl: avatarUrl ?? "",
    currentLevel: currentLevel ?? "",
    targetLevel: targetLevel ?? "",
    studyHoursPerWeek: studyHoursPerWeek?.toString() ?? "",
    examDate: examDate ? examDate.slice(0, 10) : "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setError(null)
    const file = e.target.files[0]
    setSelectedFile(file.name)
    await startUpload([file])
    e.target.value = ""
  }

  const triggerFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)
    setError(null)

    const payload = {
      name: formState.name.trim() || undefined,
      avatarUrl: formState.avatarUrl.trim() || undefined,
      currentLevel: formState.currentLevel || undefined,
      targetLevel: formState.targetLevel || undefined,
      studyHoursPerWeek:
        formState.studyHoursPerWeek === ""
          ? undefined
          : Number(formState.studyHoursPerWeek),
      examDate: formState.examDate || undefined,
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "No se pudo guardar el perfil")
      }

      setMessage("Perfil actualizado")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Tu nombre"
          />
        </div>

        <div id="avatar-uploader">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avatar (URL)
          </label>
          <input
            type="url"
            name="avatarUrl"
            value={formState.avatarUrl}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Pega la URL de tu foto o usa “Subir imagen” para cargar un archivo.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <button
              type="button"
              onClick={triggerFilePicker}
              disabled={isUploading}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              {isUploading ? "Subiendo..." : "Subir imagen"}
            </button>
            {selectedFile && !isUploading && (
              <span className="text-xs text-gray-600">
                Seleccionado: {selectedFile}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nivel actual
          </label>
          <select
            name="currentLevel"
            value={formState.currentLevel}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Sin definir</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nivel objetivo
          </label>
          <select
            name="targetLevel"
            value={formState.targetLevel}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Sin definir</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horas por semana
          </label>
          <input
            type="number"
            name="studyHoursPerWeek"
            min={0}
            max={168}
            value={formState.studyHoursPerWeek}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Ej: 8"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de examen
          </label>
          <input
            type="date"
            name="examDate"
            value={formState.examDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  )
}
