import { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Iniciar Sesión | DELE Platform",
  description: "Accede a tu cuenta de DELE Platform",
}

export default function LoginPage() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">DELE Platform</h1>
        <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
      </div>

      {/* Formulario */}
      <LoginForm />

      {/* Link a registro */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link 
            href="/register" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>

      {/* Usuarios de prueba (solo en desarrollo) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            Usuarios de prueba:
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>👨‍💼 Admin: admin@dele.com / admin123</p>
            <p>👨‍🏫 Profesor: profesor@dele.com / teacher123</p>
            <p>👨‍🎓 Estudiante: estudiante@dele.com / student123</p>
          </div>
        </div>
      )}
    </div>
  )
}