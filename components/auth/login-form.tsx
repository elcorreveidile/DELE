"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Credenciales incorrectas")
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Ocurrió un error. Intenta de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>

      <div className="text-center text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-blue-600 hover:underline font-medium">
          Regístrate aquí
        </Link>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-900 mb-2 font-semibold">Usuarios de prueba:</p>
        <div className="space-y-1 text-xs text-blue-700">
          <p>👨‍💼 Admin: admin@dele.com / admin123</p>
          <p>👨‍🏫 Profesor: profesor@dele.com / teacher123</p>
          <p>👨‍🎓 Estudiante: estudiante@dele.com / student123</p>
        </div>
      </div>
    </form>
  )
}
