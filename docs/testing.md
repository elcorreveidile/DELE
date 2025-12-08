# Estrategia de testing

La app aún no está inicializada; este documento define el plan de pruebas para el stack Next.js + TypeScript + Prisma + Stripe + Auth.js.

## Pirámide de pruebas
- **Linting y type-check:** `pnpm lint`, `pnpm type-check` para asegurar calidad y contratos de tipos.
- **Unit tests:** lógica pura (motor de rutas, normalización de datos, prompts de IA). Framework sugerido: `vitest` o `jest`.
- **Integration/API tests:** API Routes de Next.js con `supertest`/`next-test-api-route-handler`, base de datos de prueba (PostgreSQL temporal) y mocks de Stripe/Auth.
- **E2E (UI):** `playwright` o `cypress` para flujos clave: registro/login, compra (Stripe en modo test), acceso a cursos, ejecución de simulacros y feedback del tutor IA (solo texto en v1).

## Datos de prueba
- Semilla mínima con usuarios `student/teacher/admin`, cursos A1–C2, módulos freemium/premium y un par de modelos de examen.
- Fixtures de respuestas/tareas para validar el motor de rutas y la generación de feedback.

## Automatización
- Pipeline CI: `pnpm lint && pnpm type-check && pnpm test`.
- Job opcional para E2E en preproducción antes de despliegue a producción.

## Estado actual
- No hay código ejecutable ni pruebas implementadas; se añadió un comando `npm test` de marcador de posición que confirma la ausencia de suites mientras se inicializa la app Next.js.
- Una vez inicializada la app Next.js, añadir `vitest`/`jest`, configurar `tsconfig` para tests y crear suites mínimas para el motor de rutas y los endpoints de autenticación/pagos.
