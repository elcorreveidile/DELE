export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-6xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          DELE C2
        </h1>
        <p className="text-xl text-center text-gray-700 mb-12">
          Plataforma de preparación para el examen DELE C2 con tutor IA y contenido original
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">13 Tipos de Tareas</h3>
            <p className="text-gray-600">
              Práctica completa de las 13 tareas del examen DELE C2 según especificaciones del Instituto Cervantes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">Tutor IA</h3>
            <p className="text-gray-600">
              Feedback inmediato y personalizado con evaluación por bandas 0-3 según criterios oficiales.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">9 Módulos</h3>
            <p className="text-gray-600">
              Curso estructurado de 160-200 horas con progresión clara desde fundamentos hasta simulacros completos.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            🚧 Proyecto en desarrollo - Implementando documentación técnica completa
          </p>
        </div>
      </div>
    </main>
  )
}
