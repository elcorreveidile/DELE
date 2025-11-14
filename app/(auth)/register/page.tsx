import { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Crear Cuenta | DELE Platform",
  description: "Crea tu cuenta en DELE Platform",
}

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">DELE Platform</h1>
        <p className="text-gray-600 mt-2">Crea tu cuenta</p>
      </div>

      {/* Formulario */}
      <RegisterForm />

      {/* Link a login */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link 
            href="/login" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}