export default function TestEnv() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Variables de Entorno</h1>
      
      <div className="space-y-2">
        <p>✅ DATABASE_URL: {process.env.DATABASE_URL ? 'Configurada' : '❌ Falta'}</p>
        <p>✅ AUTH_SECRET: {process.env.AUTH_SECRET ? 'Configurada' : '❌ Falta'}</p>
        <p>✅ STRIPE_SECRET_KEY: {process.env.STRIPE_SECRET_KEY ? 'Configurada' : '❌ Falta'}</p>
        <p>✅ OPENAI_API_KEY: {process.env.OPENAI_API_KEY ? 'Configurada' : '❌ Falta'}</p>
        <p>✅ UPLOADTHING_SECRET: {process.env.UPLOADTHING_SECRET ? 'Configurada' : '❌ Falta'}</p>
        
        <div className="mt-4">
          <p className="font-semibold">Clave pública de Stripe (visible):</p>
          <code className="text-xs bg-gray-100 p-2 block">
            {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '❌ No configurada'}
          </code>
        </div>
      </div>
    </div>
  )
}
