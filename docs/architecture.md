# Arquitectura técnica

## Visión general
- **Frontend:** Next.js + TypeScript, UI minimalista, responsive. Soporte i18n (es base, en habilitación inglés) con `next-intl` o `next-i18next`.
- **Backend/API:** API Routes de Next.js o serverless en Vercel; opción Railway para servicios persistentes y tareas de fondo. 
- **BD:** PostgreSQL administrado (Railway/Supabase/neon). ORM: Prisma. 
- **Autenticación/Autorización:** Auth.js (NextAuth) con adaptador Prisma. Proveedores: email/password, Magic Link, OAuth Google/Apple y RRSS. Roles: student, teacher, admin. Middleware de autorización por ruta/endpoint. 
- **Pagos:** Stripe Checkout + Billing portal. Modelos de suscripción y pago por curso. Webhooks seguros con firma. Acceso freemium: desbloqueo gratuito de una unidad por nivel.
- **Almacenamiento de ficheros:** almacenamiento gestionado (S3 compatible) para audios, entregas y materiales; PDFs descargables con marca de agua.
- **Observabilidad:** logging estructurado (pino/winston), métricas básicas y trazas (OpenTelemetry opcional). 

## Datos y modelos (Prisma)
- `User(id, name, email, role, locale, level_estimated, level_goal, weekly_hours, exam_date)`
- `Profile` (auto-evaluación por destreza, experiencia previa, preferencias).
- `Level(id, code[A1–C2], description)`
- `Course(id, levelId, title, description, hours_recommended_min, hours_recommended_max, is_freemium_unit_id)`
- `Module(id, courseId, order, title, objectives, skills[CL,CA,EE,EO], task_types, is_freemium)`
- `Lesson(id, moduleId, title, resources[], estimated_minutes)`
- `Task(id, moduleId, skill, dele_task_type, domain, resource_refs[], instructions, estimated_minutes)`
- `ExamModel(id, levelId, name, pdf_path, section, task_type, duration_minutes, weight)`
- `LearningPath(id, userId, courseId, route_type[standard/intensive/long], start_date)`
- `LearningPathItem(id, learningPathId, moduleId, week, session, status)`
- `Attempt(id, userId, taskId|examModelId, score, rubric_breakdown, feedback, duration_seconds)`
- `Progress(id, userId, skill, levelId, completion, last_updated)`
- `PaymentPlan(id, name, price, interval, access_scope)` / `Subscription(userId, planId, status, stripe_ref)`

## Endpoints/API routes
- **Auth**: `/api/auth/*` (Auth.js providers; email/password + Magic Link + OAuth Google/Apple/RS). 
- **Cursos/Módulos/Tareas**: 
  - `GET /api/courses` (listado; marca freemium), `GET /api/courses/[level]`, `GET /api/modules/[id]`, `GET /api/tasks/[id]`.
- **Ruta de aprendizaje**: 
  - `POST /api/learning-path` (genera ruta a partir de perfil), `GET /api/learning-path` (actual), `PATCH /api/learning-path` (reajuste con progreso), `POST /api/learning-path/checkpoints` (registrar simulacro).
- **Intentos y progreso**: 
  - `POST /api/attempts`, `GET /api/attempts?user`, `GET /api/progress`.
- **Exam models**: `GET /api/exams/[level]` (metadatos + enlaces a PDFs con marca de agua).
- **Pagos**: 
  - `POST /api/checkout/session` (Stripe), `POST /api/webhooks/stripe` (suscripciones y compras), `GET /api/billing/portal`.
- **Tutor IA**: 
  - `POST /api/tutor/feedback` (escrita), `POST /api/tutor/oral` (subida de audio + anotación por profesor; IA solo texto v1.0).

## Flujo de autenticación y roles
- Auth.js + Prisma adapter con tabla `Account` para OAuth/Magic Link. 
- Middleware para proteger `/dashboard`, `/courses/*`, `/api/*` (except públicos). 
- Roles: 
  - **student**: acceso a su ruta, cursos comprados, freemium limitado.
  - **teacher**: creación de rutas específicas para grupos, revisión de audios/textos, vista de analíticas.
  - **admin**: gestión de planes, contenidos, usuarios, y materiales.

## i18n
- Mensajes en español base; namespaces para UI común, cursos y tutor. Toggle de idioma en perfil. 

## Integración de materiales
- Tabla `ExamModel` enlaza con rutas de PDFs en `documentos/` o almacenamiento. Descargas firmadas y marcadas con watermark (inserción server-side previa). 
- Tareas/recursos referencian paths de bancos de textos/audios del repo; subida de audios a S3; metadatos almacenados en BD.

## Arquitectura del Tutor IA (v1)
- **Contexto del prompt**: nivel estimado y objetivo, resultados recientes, debilidades por destreza, instrucciones del examen, tarea solicitada, producción del estudiante. 
- **Salida esperada**: análisis por criterios (coherencia, cohesión, léxico, gramática, adecuación), feedback priorizado, reformulaciones modelo, recordatorio de que no es calificación oficial. 
- **Seguridad**: limitar claims de calificación, marcar feedback como orientativo; mantener instrucciones de examen (variedad peninsular). 

## CI/CD y despliegue
- **Dev**: entorno local con `.env` y DB local/Cloud. 
- **Preview/Prod**: Vercel para frontend/API; Railway para DB (o Supabase). Jobs de seed y migraciones en CI antes de desplegar. 
- **Testing**: lint, type-check, unit tests de lógica del motor de rutas y prompts. 

## Tareas inmediatas
- Inicializar app Next.js con Prisma + Auth.js + Stripe skeleton. 
- Implementar modelos y migraciones iniciales (sin datos sensibles). 
- Crear endpoints stub y páginas base (landing, auth, dashboard, cursos, simulacros, tutor IA). 
- Añadir seed para niveles, cursos, módulos y vínculo básico con tareas DELE.
