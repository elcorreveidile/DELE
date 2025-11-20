import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bienvenido</h1>
        <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
      </div>
      <LoginForm />
    </div>
  )
}