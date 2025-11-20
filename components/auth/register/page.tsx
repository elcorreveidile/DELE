import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>
        <p className="text-gray-600 mt-2">Regístrate para empezar</p>
      </div>
      <RegisterForm />
    </div>
  )
}