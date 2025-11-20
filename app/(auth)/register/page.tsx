import { Metadata } from "next"
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
    </div>
  )
}
