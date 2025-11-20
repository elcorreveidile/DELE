import Link from "next/link"
import {
  BookOpen,
  Clock3,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 text-slate-50">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(94,234,212,0.1),transparent_25%)]" />
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          {/* Hero */}
          <section className="grid lg:grid-cols-2 gap-12 items-center relative">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-cyan-50 ring-1 ring-white/10 backdrop-blur">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                Preparación oficial DELE 2025
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
                  Domina tu examen DELE con un plan guiado de principio a fin
                </h1>
                <p className="text-lg text-slate-200 leading-relaxed">
                  Cursos completos, simulacros cronometrados y feedback
                  personalizado para que llegues seguro al día del examen. Todo
                  en una plataforma creada por profesores acreditados.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-cyan-400 px-6 py-3 text-slate-950 font-semibold shadow-xl shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  Empieza gratis
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 font-semibold text-slate-50 hover:bg-white/10 transition"
                >
                  Ya tengo cuenta
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {[
                  { label: "Tasa de aprobado", value: "92%" },
                  { label: "Simulacros reales", value: "40+" },
                  { label: "Horas guiadas", value: "120h" },
                  { label: "Profesores", value: "Equipo DELE" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm"
                  >
                    <p className="text-2xl font-semibold text-white">
                      {item.value}
                    </p>
                    <p className="text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-cyan-200 font-medium">Ruta personalizada</p>
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <p className="mt-3 text-xl font-semibold text-white">
                  Plan semanal adaptado a tu nivel
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    { title: "Diagnóstico inicial", detail: "Test de nivel y objetivos" },
                    { title: "Simulacros cronometrados", detail: "Formato real B1/B2/C1" },
                    { title: "Corrección con rubrica", detail: "Expresión escrita y oral" },
                    { title: "IA personal", detail: "Feedback y práctica 24/7" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/5"
                    >
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-sm text-slate-300">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Características */}
          <section className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Método DELE probado",
                desc: "Lecciones diseñadas por examinadores con rubricas oficiales y ejemplos reales.",
                icon: BookOpen,
              },
              {
                title: "Práctica guiada",
                desc: "Calendario semanal con tareas diarias, recordatorios y entregables revisados.",
                icon: Clock3,
              },
              {
                title: "Acompañamiento humano + IA",
                desc: "Combina tutorías con profesores y práctica ilimitada con tu asistente IA.",
                icon: MessageSquare,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-cyan-400/15 p-3 text-cyan-200">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                </div>
                <p className="mt-3 text-slate-200">{item.desc}</p>
              </div>
            ))}
          </section>

          {/* Niveles / cursos */}
          <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-inner">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">
                  Cursos disponibles
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Prepara tu nivel DELE con rutas enfocadas
                </h2>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-white text-slate-900 px-4 py-2 font-semibold shadow-lg shadow-white/20 transition hover:-translate-y-0.5"
              >
                Ver plan completo
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  level: "B1",
                  title: "Base sólida para aprobar",
                  focus: "Gramática clave, comprensión auditiva y redacción práctica.",
                },
                {
                  level: "B2",
                  title: "Intensivo Premium",
                  focus: "Simulacros avanzados, vocabulario temático y orales cronometrados.",
                },
                {
                  level: "C1",
                  title: "Expresión avanzada",
                  focus: "Matices, conectores y argumentación para destacar en el tribunal.",
                },
              ].map((course) => (
                <div
                  key={course.level}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cyan-300/20 px-3 py-1 text-sm font-semibold text-cyan-100">
                      Nivel {course.level}
                    </span>
                    <GraduationCap className="w-5 h-5 text-white/70" />
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-slate-200">{course.focus}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-cyan-100">
                    <ShieldCheck className="w-4 h-4" />
                    Con soporte de profesor y IA
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA final */}
          <section className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 px-8 py-10 text-slate-950 shadow-2xl shadow-cyan-500/30">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Listo para empezar
                </p>
                <h3 className="text-3xl font-bold leading-tight">
                  Da el primer paso hacia tu certificación DELE
                </h3>
                <p className="text-lg text-slate-900/80">
                  Accede al plan de estudio, simulacros y tutorías. Empieza gratis
                  y decide luego.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-950 text-white px-6 py-3 font-semibold shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
                >
                  Crear cuenta
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-900/30 px-6 py-3 font-semibold text-slate-950 hover:bg-white/20 transition"
                >
                  Entrar
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
