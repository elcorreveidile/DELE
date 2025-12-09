# Esquema de Base de Datos - DELE C2

## Visión General

Este documento describe el esquema de base de datos específico para el nivel C2, basado en:
- 13 tipos de tareas específicas (P1: T1-T7, P2: T1-T3, P3: T1-T3)
- Sistema de evaluación por bandas (0-3)
- 4 criterios de evaluación: Cohesión y coherencia, Corrección, Alcance, Mediación/Cumplimiento
- 9 módulos de curso (160-200 horas)
- Soporte para mediación multimodal y oral

---

## Esquema Prisma Completo

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// USUARIOS Y AUTENTICACIÓN
// ============================================================================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(STUDENT)
  locale        String    @default("es")

  // Perfil de aprendizaje
  levelEstimated String?  // A1, A2, B1, B2, C1, C2
  levelGoal      String?  // Nivel objetivo
  weeklyHours    Int?     // Horas semanales disponibles
  examDate       DateTime? // Fecha del examen oficial

  // Relaciones
  profile         Profile?
  accounts        Account[]
  sessions        Session[]
  learningPaths   LearningPath[]
  attempts        Attempt[]
  progress        Progress[]
  subscriptions   Subscription[]
  oralRecordings  OralRecording[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Profile {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Auto-evaluación por destreza (1-5)
  comprehensionLectura  Int? // Comprensión de lectura
  comprehensionAuditiva Int? // Comprensión auditiva
  expresionEscrita      Int? // Expresión escrita
  expresionOral         Int? // Expresión oral
  interaccionOral       Int? // Interacción oral
  mediacionEscrita      Int? // Mediación escrita
  mediacionOral         Int? // Mediación oral

  // Experiencia previa
  hasStudiedSpanish     Boolean @default(false)
  yearsStudying         Int?
  hasLivedInSpain       Boolean @default(false)
  monthsInSpain         Int?
  previousDELELevel     String? // Último nivel DELE obtenido
  previousDELEDate      DateTime?

  // Preferencias de aprendizaje
  preferredStudyTime    String? // morning, afternoon, evening, night
  learningStyleVisual   Boolean @default(true)
  learningStyleAuditory Boolean @default(true)
  learningStyleKinesthetic Boolean @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  STUDENT
  TEACHER
  ADMIN
}

// Auth.js models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ============================================================================
// ESTRUCTURA DE NIVELES Y CURSOS
// ============================================================================

model Level {
  id          String   @id @default(cuid())
  code        String   @unique // A1, A2, B1, B2, C1, C2
  name        String   // "Nivel C2 - Maestría"
  description String
  order       Int      @unique

  courses     Course[]
  examModels  ExamModel[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Course {
  id          String @id @default(cuid())
  levelId     String
  level       Level  @relation(fields: [levelId], references: [id])

  title                String
  description          String
  hoursRecommendedMin  Int // 160 para C2
  hoursRecommendedMax  Int // 200 para C2

  // Freemium: una unidad gratuita por nivel
  isFreemiumUnitId     String? // ID del módulo freemium

  // Relaciones
  modules        Module[]
  learningPaths  LearningPath[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([levelId]) // Un curso por nivel
}

// ============================================================================
// MÓDULOS Y LECCIONES (ESTRUCTURA DEL CURSO C2)
// ============================================================================

model Module {
  id          String   @id @default(cuid())
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  order       Int      // 1-9 para C2
  title       String   // "Módulo 1: Léxico y estructuras"
  description String

  // Objetivos y metadata
  objectives           String[] // Array de objetivos de aprendizaje
  skills               Skill[]  // CL, CA, EE, EO, IE, IO, ME, MO
  deleTaskTypes        C2TaskType[] // Tipos de tareas DELE que cubre

  // Duración estimada
  hoursMin    Int      // 20 horas mínimo
  hoursMax    Int      // 25 horas máximo

  // Freemium
  isFreemium  Boolean  @default(false)

  // Relaciones
  lessons          Lesson[]
  tasks            Task[]
  learningPathItems LearningPathItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([courseId, order])
}

model Lesson {
  id          String @id @default(cuid())
  moduleId    String
  module      Module @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  order       Int    // Orden dentro del módulo
  title       String // "Sesión 1: Fundamentos de mediación"

  // Contenido
  description      String
  objectives       String[] // Objetivos específicos de la lección

  // Recursos
  resources        Json[] // Array de recursos: {type: 'video'|'text'|'audio', url, title}

  // Duración
  estimatedMinutes Int

  // Relaciones
  tasks       Task[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([moduleId, order])
}

// ============================================================================
// TAREAS Y TIPOS DE TAREAS C2
// ============================================================================

model Task {
  id          String     @id @default(cuid())
  moduleId    String
  module      Module     @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  lessonId    String?
  lesson      Lesson?    @relation(fields: [lessonId], references: [id], onDelete: SetNull)

  // Tipo de tarea
  taskType    C2TaskType // P1_T1, P1_T2, etc.
  skill       Skill      // CL, CA, EE, EO, etc.

  // Prueba y peso
  prueba      Prueba     // PRUEBA_1, PRUEBA_2, PRUEBA_3
  weight      Float?     // Peso en puntuación (ej: 33.33 para cada prueba)

  // Contenido
  title          String
  instructions   String   // Instrucciones de la tarea
  description    String?  // Descripción adicional

  // Recursos y materiales
  resourceRefs   Json[]   // Referencias a textos, audios, gráficos
  // Ejemplo: [{type: 'text', url: '/texts/c2/educacion-1.pdf', title: 'Artículo sobre educación'}]

  // Parámetros de la tarea
  domain         String?  // público, profesional, educativo, personal
  textGenre      String?  // ensayo, carta, informe, artículo
  wordCountMin   Int?     // Para tareas escritas
  wordCountMax   Int?     // Para tareas escritas
  durationMinutes Int?    // Duración estimada
  preparationMinutes Int? // Tiempo de preparación (oral)

  // Para tareas de mediación
  requiresMultipleSources Boolean @default(false)
  sourceCount            Int?     // Número de fuentes a integrar
  mediationMode          MediationMode? // ORAL, ESCRITA, MULTIMODAL

  // Metadatos
  difficulty     Difficulty @default(C2)
  isOfficial     Boolean    @default(false) // Tarea de examen oficial vs práctica
  isSimulacro    Boolean    @default(false) // Es parte de un simulacro

  // Relaciones
  attempts       Attempt[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([taskType])
  @@index([prueba])
  @@index([moduleId])
}

enum C2TaskType {
  // Prueba 1: Uso de lengua, comprensión de lectura y auditiva
  P1_T1  // Léxico con distinciones sutiles (CL)
  P1_T2  // Estructuras complejas (CL)
  P1_T3  // Cohesión y coherencia (CL)
  P1_T4  // Comprensión auditiva con matices (CA)
  P1_T5  // Identificación de ideas implícitas (CA)
  P1_T6  // Detección de actitudes y opiniones (CA)
  P1_T7  // Comprensión de textos complejos (CA)

  // Prueba 2: Expresión, mediación e interacción escritas
  P2_T1  // Mediación escrita multimodal
  P2_T2  // Expresión escrita (carta, ensayo, etc.)
  P2_T3  // Expresión escrita (artículo, informe, etc.)

  // Prueba 3: Expresión, mediación e interacción orales
  P3_T1  // Mediación oral (exposición basada en fuentes)
  P3_T2  // Interacción: entrevista/conversación formal
  P3_T3  // Negociación y acuerdo
}

enum Prueba {
  PRUEBA_1  // Uso de lengua, CL, CA (105 min, 33.33%)
  PRUEBA_2  // Expresión, mediación e interacción escritas (150 min, 33.33%)
  PRUEBA_3  // Expresión, mediación e interacción orales (20 min + 30 prep, 33.34%)
}

enum Skill {
  CL  // Comprensión de lectura
  CA  // Comprensión auditiva
  EE  // Expresión escrita
  EO  // Expresión oral
  IE  // Interacción escrita
  IO  // Interacción oral
  ME  // Mediación escrita
  MO  // Mediación oral
}

enum MediationMode {
  ORAL
  ESCRITA
  MULTIMODAL
}

enum Difficulty {
  A1
  A2
  B1
  B2
  C1
  C2
}

// ============================================================================
// MODELOS DE EXAMEN OFICIAL
// ============================================================================

model ExamModel {
  id       String @id @default(cuid())
  levelId  String
  level    Level  @relation(fields: [levelId], references: [id])

  name        String   // "Modelo de Examen DELE C2 - 2024"
  year        Int
  convocatoria String  // "Mayo 2024", "Noviembre 2024"

  // Archivo PDF
  pdfPath     String   // Ruta al PDF con marca de agua

  // Metadata
  section     Prueba
  taskType    C2TaskType?
  duration    Int      // Minutos
  weight      Float    // Porcentaje de la calificación

  // Relaciones
  attempts    Attempt[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([levelId])
  @@index([section])
}

// ============================================================================
// RUTAS DE APRENDIZAJE
// ============================================================================

model LearningPath {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id])

  // Tipo de ruta
  routeType RouteType @default(STANDARD)

  // Fechas
  startDate  DateTime
  targetDate DateTime? // Fecha objetivo del examen

  // Estado
  status     PathStatus @default(ACTIVE)

  // Relaciones
  items      LearningPathItem[]
  checkpoints Checkpoint[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, courseId])
}

model LearningPathItem {
  id             String       @id @default(cuid())
  learningPathId String
  learningPath   LearningPath @relation(fields: [learningPathId], references: [id], onDelete: Cascade)

  moduleId       String
  module         Module       @relation(fields: [moduleId], references: [id])

  // Planificación
  week           Int          // Semana en la ruta
  session        Int          // Sesión dentro de la semana
  scheduledDate  DateTime?    // Fecha programada

  // Estado
  status         ItemStatus   @default(PENDING)
  startedAt      DateTime?
  completedAt    DateTime?

  // Progreso
  timeSpentMinutes Int        @default(0)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([learningPathId, moduleId])
  @@index([learningPathId, status])
}

enum RouteType {
  STANDARD    // 6 meses, 5-6h/semana
  INTENSIVE   // 4 meses, 8-10h/semana
  LONG_TERM   // 8-12 meses, 3-4h/semana
  CUSTOM      // Personalizada
}

enum PathStatus {
  ACTIVE
  PAUSED
  COMPLETED
  ABANDONED
}

enum ItemStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  SKIPPED
}

// ============================================================================
// CHECKPOINTS Y SIMULACROS
// ============================================================================

model Checkpoint {
  id             String       @id @default(cuid())
  learningPathId String
  learningPath   LearningPath @relation(fields: [learningPathId], references: [id], onDelete: Cascade)

  type           CheckpointType
  week           Int
  scheduledDate  DateTime
  completedAt    DateTime?

  // Resultados
  prueba1Score   Float?
  prueba2Score   Float?
  prueba3Score   Float?
  totalScore     Float?
  passed         Boolean?

  // Feedback
  feedback       String?
  weaknesses     String[] // Áreas de mejora identificadas

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([learningPathId])
}

enum CheckpointType {
  PARTIAL_SIMULACRO   // Simulacro parcial (una prueba)
  FULL_SIMULACRO      // Simulacro completo (3 pruebas)
  SELF_ASSESSMENT     // Auto-evaluación
  REVIEW              // Revisión de progreso
}

// ============================================================================
// INTENTOS Y EVALUACIONES
// ============================================================================

model Attempt {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Puede ser tarea de práctica o modelo de examen
  taskId      String?
  task        Task?      @relation(fields: [taskId], references: [id], onDelete: SetNull)
  examModelId String?
  examModel   ExamModel? @relation(fields: [examModelId], references: [id], onDelete: SetNull)

  // Producción del estudiante
  submissionText  String?  // Para tareas escritas
  submissionFiles Json[]   // Para archivos adjuntos (audios, etc.)

  // Evaluación automática (Prueba 1)
  autoScore       Float?   // Puntuación automática (0-100)
  correctAnswers  Int?
  totalQuestions  Int?

  // Evaluación por criterios (Pruebas 2 y 3)
  evaluation      Evaluation?

  // Metadata
  durationSeconds Int      // Tiempo empleado
  completedAt     DateTime @default(now())

  // Feedback del tutor IA
  aiFeedback      String?  // Feedback generado por IA
  aiAnalysis      Json?    // Análisis detallado por el tutor IA

  // Feedback humano (para oral)
  humanFeedback   String?
  evaluatorId     String?  // ID del profesor evaluador

  // Relaciones
  oralRecording   OralRecording?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([taskId])
  @@index([completedAt])
}

// ============================================================================
// SISTEMA DE EVALUACIÓN POR BANDAS (0-3)
// ============================================================================

model Evaluation {
  id         String   @id @default(cuid())
  attemptId  String   @unique
  attempt    Attempt  @relation(fields: [attemptId], references: [id], onDelete: Cascade)

  // Tipo de evaluación
  prueba     Prueba
  taskType   C2TaskType

  // Evaluación por criterios (Bandas 0-3)
  // Cada criterio se evalúa en escala 0-3

  // Criterio 1: Cohesión y coherencia
  cohesionBand    Band
  cohesionComment String?

  // Criterio 2: Corrección (gramatical y léxica)
  correccionBand    Band
  correccionComment String?

  // Criterio 3: Alcance (léxico y gramatical)
  alcanceBand    Band
  alcanceComment String?

  // Criterio 4: Mediación/Cumplimiento de tarea
  // (Mediación para P2 T1 y P3 T1; Cumplimiento para el resto)
  cumplimientoBand    Band
  cumplimientoComment String?

  // Para Prueba 3: Escala holística (40% de la nota)
  holisticBand    Band?
  holisticComment String?

  // Puntuación calculada
  criteriaScore   Float  // Suma ponderada de criterios (0-100)
  holisticScore   Float? // Puntuación holística (0-100, solo P3)
  finalScore      Float  // Puntuación final de la tarea (0-33.33)

  // Pesos aplicados
  weightsUsed     Json   // Registro de pesos: {cohesion: 0.25, correccion: 0.25, ...}

  // Metadata
  evaluatedBy     EvaluationType
  evaluatorId     String?  // ID del profesor (si es humano)
  evaluatedAt     DateTime @default(now())

  // Feedback general
  generalFeedback String?
  strengths       String[] // Puntos fuertes
  weaknesses      String[] // Áreas de mejora
  recommendations String[] // Recomendaciones específicas

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([prueba])
  @@index([evaluatedAt])
}

enum Band {
  BAND_0  // Marcadamente inferior al C2
  BAND_1  // Por debajo del C2 (no consecución)
  BAND_2  // Nivel C2 (APTO)
  BAND_3  // Supera claramente el C2 (consecución sobrada)
}

enum EvaluationType {
  AI           // Evaluación automática por IA
  HUMAN        // Evaluación por profesor
  HYBRID       // IA + revisión humana
}

// ============================================================================
// GRABACIONES ORALES (PRUEBA 3)
// ============================================================================

model OralRecording {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  attemptId  String   @unique
  attempt    Attempt  @relation(fields: [attemptId], references: [id], onDelete: Cascade)

  // Archivo de audio
  audioUrl       String   // URL del audio en almacenamiento S3
  audioFormat    String   // mp3, wav, ogg
  durationSeconds Int
  fileSize       Int      // Bytes

  // Metadata
  taskType       C2TaskType // P3_T1, P3_T2, P3_T3
  recordedAt     DateTime   @default(now())

  // Transcripción (opcional, para análisis IA)
  transcription  String?
  transcribedBy  String?    // 'ai' o ID del transcriptor

  // Estado de evaluación
  evaluationStatus EvaluationStatus @default(PENDING)
  evaluatedAt      DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([evaluationStatus])
}

enum EvaluationStatus {
  PENDING       // Pendiente de evaluación
  IN_REVIEW     // En revisión por profesor
  COMPLETED     // Evaluación completada
}

// ============================================================================
// PROGRESO DEL ESTUDIANTE
// ============================================================================

model Progress {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Por destreza
  skill     Skill
  levelId   String

  // Métricas
  completion       Float   @default(0) // 0-100%
  averageScore     Float?  // Puntuación media en esta destreza
  attemptsCount    Int     @default(0)
  timeSpentMinutes Int     @default(0)

  // Bandas promedio por criterio (para identificar debilidades)
  avgCohesionBand    Float?
  avgCorreccionBand  Float?
  avgAlcanceBand     Float?
  avgCumplimientoBand Float?

  // Fortalezas y debilidades identificadas
  strengths   String[]
  weaknesses  String[]

  lastUpdated DateTime @updatedAt
  createdAt   DateTime @default(now())

  @@unique([userId, skill, levelId])
  @@index([userId])
}

// ============================================================================
// PAGOS Y SUSCRIPCIONES
// ============================================================================

model PaymentPlan {
  id          String   @id @default(cuid())
  name        String   // "Plan Mensual C2", "Plan Anual C2"
  description String

  // Precio
  price       Int      // En céntimos (ej: 2900 = 29€)
  currency    String   @default("EUR")
  interval    Interval // MONTHLY, YEARLY, ONE_TIME

  // Acceso
  accessScope String[] // ["C2"] o ["all_levels"]
  features    String[] // Lista de características incluidas

  // Stripe
  stripePriceId String @unique

  // Estado
  isActive    Boolean  @default(true)

  // Relaciones
  subscriptions Subscription[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Interval {
  MONTHLY
  YEARLY
  ONE_TIME
}

model Subscription {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  planId    String
  plan      PaymentPlan @relation(fields: [planId], references: [id])

  // Estado
  status    SubscriptionStatus

  // Stripe
  stripeSubscriptionId String  @unique
  stripeCustomerId     String

  // Fechas
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAt           DateTime?
  canceledAt         DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([status])
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  TRIALING
  INCOMPLETE
  INCOMPLETE_EXPIRED
  UNPAID
}

// ============================================================================
// CONTENIDO Y RECURSOS
// ============================================================================

model TextResource {
  id          String   @id @default(cuid())
  title       String
  content     String   // Texto completo

  // Metadata
  genre       String   // ensayo, artículo, carta, informe
  domain      String   // público, profesional, educativo
  wordCount   Int
  level       Difficulty @default(C2)

  // Variedad del español
  spanishVariety String // peninsular, mexicano, argentino, colombiano

  // Temas y etiquetas
  topics      String[] // educación, tecnología, medio ambiente, etc.
  tags        String[]

  // Fuente y derechos
  source      String?  // Origen del texto (creación original, adaptación)
  author      String?
  isOriginal  Boolean  @default(true)

  // Uso en tareas
  usedInTasks C2TaskType[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([level])
  @@index([genre])
  @@fulltext([content])
}

model AudioResource {
  id          String   @id @default(cuid())
  title       String
  audioUrl    String   // URL del audio en S3

  // Metadata
  durationSeconds Int
  format      String   // mp3, wav, ogg
  fileSize    Int      // Bytes

  // Contenido
  transcription String? // Transcripción del audio
  genre         String  // entrevista, conferencia, conversación
  domain        String  // público, profesional, educativo
  level         Difficulty @default(C2)

  // Variedad del español
  spanishVariety String // peninsular, mexicano, argentino, etc.
  speakersCount  Int     @default(1)
  speakersGender String? // M, F, M/F

  // Temas
  topics      String[]
  tags        String[]

  // Uso en tareas
  usedInTasks C2TaskType[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([level])
  @@index([genre])
}

model GraphicResource {
  id          String   @id @default(cuid())
  title       String
  imageUrl    String   // URL de la imagen en S3

  // Metadata
  type        String   // infografía, gráfico, tabla, diagrama, foto
  format      String   // png, jpg, svg
  fileSize    Int      // Bytes

  // Contenido
  description String   // Descripción del contenido visual
  dataPoints  Json?    // Datos representados (para gráficos)

  // Contexto
  domain      String   // público, profesional, educativo
  topics      String[]
  tags        String[]

  // Uso en tareas
  usedInTasks C2TaskType[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([type])
}

// ============================================================================
// ÍNDICES Y OPTIMIZACIONES
// ============================================================================

// Los índices ya están definidos en los modelos con @@index
// Índices adicionales según patrones de acceso:
// - User: email (único)
// - Task: taskType, prueba, moduleId
// - Attempt: userId, taskId, completedAt
// - Evaluation: prueba, evaluatedAt
// - OralRecording: userId, evaluationStatus
// - Progress: userId, skill
// - Subscription: userId, status
```

---

## Descripción de Modelos Clave

### 1. Task - Tareas C2

El modelo `Task` representa cada tarea de práctica del curso C2:

- **taskType**: Enum `C2TaskType` con los 13 tipos específicos (P1_T1 a P3_T3)
- **prueba**: PRUEBA_1, PRUEBA_2 o PRUEBA_3
- **skill**: Destreza evaluada (CL, CA, EE, EO, ME, MO)
- **resourceRefs**: Array JSON con referencias a textos, audios, gráficos
- **Mediación**: Campos específicos para tareas de mediación (requiresMultipleSources, sourceCount, mediationMode)

Ejemplo de resourceRefs JSON:
```json
[
  {
    "type": "text",
    "id": "text_resource_id_123",
    "title": "Artículo sobre educación digital",
    "url": "/api/resources/texts/123"
  },
  {
    "type": "graphic",
    "id": "graphic_resource_id_456",
    "title": "Infografía: Uso de tecnología en aulas",
    "url": "/api/resources/graphics/456"
  }
]
```

### 2. Evaluation - Sistema de Bandas 0-3

El modelo `Evaluation` implementa el sistema oficial de evaluación:

- **4 criterios principales**: cohesionBand, correccionBand, alcanceBand, cumplimientoBand
- **Bandas**: BAND_0, BAND_1, BAND_2 (APTO), BAND_3
- **Escala holística**: Solo para Prueba 3 (40% del peso)
- **Puntuaciones calculadas**: criteriaScore, holisticScore, finalScore

#### Fórmulas de cálculo:

**Para Prueba 2 (tareas escritas):**
```
criteriaScore = (cohesionBand + correccionBand + alcanceBand + cumplimientoBand) / 4 * 100
finalScore = (criteriaScore / 3) * 33.33
```

**Para Prueba 3 (tareas orales):**
```
criteriaScore = (cohesionBand + correccionBand + alcanceBand + cumplimientoBand) / 4 * 100
holisticScore = holisticBand * 33.33
combinedScore = (criteriaScore * 0.6) + (holisticScore * 0.4)
finalScore = (combinedScore / 100) * 33.34
```

### 3. Module - Estructura del Curso

Los 9 módulos del curso C2:

| Módulo | Título | Tareas | Horas |
|--------|--------|--------|-------|
| 1 | Léxico y estructuras | P1: T1, T2, T3 | 20-25h |
| 2 | Comprensión auditiva | P1: T4, T5, T6, T7 | 20-25h |
| 3 | Mediación escrita multimodal | P2: T1 | 25-30h |
| 4 | Expresión escrita formal | P2: T2, T3 | 20-25h |
| 5 | Mediación oral | P3: T1 | 20-25h |
| 6 | Interacción: entrevista | P3: T2 | 15-20h |
| 7 | Negociación y acuerdo | P3: T3 | 15-20h |
| 8 | Simulacros parciales | P1, P2 o P3 | 12-15h |
| 9 | Simulacros completos | Examen completo | 12-15h |

### 4. OralRecording - Grabaciones de Prueba 3

Manejo específico de tareas orales:

- **Almacenamiento**: S3-compatible storage para archivos de audio
- **Transcripción opcional**: Para análisis preliminar por IA
- **Evaluación humana**: Campo `evaluationStatus` para flujo de revisión
- **Formatos soportados**: mp3, wav, ogg

### 5. Progress - Seguimiento por Destreza

Tracking detallado del progreso del estudiante:

- **Por destreza**: CL, CA, EE, EO, IE, IO, ME, MO
- **Bandas promedio**: Para identificar criterios débiles
- **Fortalezas/debilidades**: Arrays de strings con áreas específicas
- **Métricas**: completion (0-100%), averageScore, attemptsCount, timeSpentMinutes

---

## Enums Específicos de C2

### C2TaskType
```prisma
enum C2TaskType {
  // Prueba 1 (7 tareas)
  P1_T1  // Léxico con distinciones sutiles - 12 ítems
  P1_T2  // Estructuras complejas - 10 ítems
  P1_T3  // Cohesión y coherencia - 6 ítems
  P1_T4  // Comprensión auditiva con matices - 8 ítems
  P1_T5  // Ideas implícitas - 8 ítems
  P1_T6  // Actitudes y opiniones - 6 ítems
  P1_T7  // Textos complejos - 12 ítems

  // Prueba 2 (3 tareas)
  P2_T1  // Mediación escrita multimodal - 500-650 palabras
  P2_T2  // Expresión escrita formal - 200-250 palabras
  P2_T3  // Expresión escrita formal - 200-250 palabras

  // Prueba 3 (3 tareas)
  P3_T1  // Mediación oral - 5-6 min + 20 min prep
  P3_T2  // Interacción formal - 5-6 min
  P3_T3  // Negociación - 5-6 min
}
```

### Band (Sistema de Evaluación)
```prisma
enum Band {
  BAND_0  // 0 puntos - Marcadamente inferior
  BAND_1  // 1 punto - No consecución
  BAND_2  // 2 puntos - Nivel C2 (APTO)
  BAND_3  // 3 puntos - Consecución sobrada
}
```

**Nota importante**: Para aprobar cada prueba se requiere mínimo 20/33.33 puntos (60%).

---

## Relaciones Clave

### User → Progress → Evaluation
```
User (estudiante)
  → Attempt (intento de tarea)
    → Evaluation (evaluación por bandas)
      → 4 criterios con Band (0-3)
  → Progress (progreso por destreza)
    → Bandas promedio por criterio
```

### Course → Module → Lesson → Task
```
Course (C2)
  → Module (9 módulos)
    → Lesson (sesiones)
      → Task (tareas específicas)
        → C2TaskType (P1_T1...P3_T3)
        → resourceRefs (textos, audios, gráficos)
```

### LearningPath → Items → Progress
```
LearningPath (ruta del estudiante)
  → LearningPathItem (módulo en la ruta)
    → Module (contenido)
      → Task (tareas a completar)
  → Checkpoint (simulacros)
    → Resultados por prueba
```

---

## Consideraciones de Implementación

### 1. Almacenamiento de Recursos

**Audios (OralRecording y AudioResource)**:
- Usar S3-compatible storage (AWS S3, Supabase Storage, Railway Volumes)
- URL firmadas con expiración para seguridad
- Formatos: mp3 (preferido por compresión), wav (alta calidad)
- Nomenclatura: `c2/oral/{userId}/{attemptId}/{timestamp}.mp3`

**Textos (TextResource)**:
- Almacenar directamente en PostgreSQL (campo `content`)
- Índice de texto completo para búsquedas: `@@fulltext([content])`
- Opción: almacenar PDFs en S3 para descarga con marca de agua

**Gráficos (GraphicResource)**:
- Almacenar en S3: `c2/graphics/{resourceId}/{filename}.{png|jpg|svg}`
- Generar miniaturas para preview
- Incluir alt text en campo `description` para accesibilidad

### 2. Evaluación Automática vs Humana

**Automática (IA)**:
- Prueba 1: 100% automática (respuestas cerradas)
- Prueba 2: IA para feedback preliminar, humano para nota oficial
- Prueba 3: Requiere evaluación humana obligatoria

**Flujo de evaluación**:
```
Attempt creado → EvaluationType.AI (feedback inmediato)
                → EvaluationType.HUMAN (revisión profesor)
                → EvaluationType.HYBRID (combinación)
```

### 3. Cálculo de Puntuaciones

Implementar en servidor (no confiar en cliente):

```typescript
// utils/scoring.ts

function calculateP2Score(evaluation: Evaluation): number {
  const criteriaSum =
    evaluation.cohesionBand +
    evaluation.correccionBand +
    evaluation.alcanceBand +
    evaluation.cumplimientoBand;

  const criteriaScore = (criteriaSum / 4) * 100;
  return (criteriaScore / 3) * 33.33;
}

function calculateP3Score(evaluation: Evaluation): number {
  const criteriaSum =
    evaluation.cohesionBand +
    evaluation.correccionBand +
    evaluation.alcanceBand +
    evaluation.cumplimientoBand;

  const criteriaScore = (criteriaSum / 4) * 100;
  const holisticScore = evaluation.holisticBand! * 33.33;

  const combined = (criteriaScore * 0.6) + (holisticScore * 0.4);
  return (combined / 100) * 33.34;
}

function checkPassed(p1Score: number, p2Score: number, p3Score: number): boolean {
  const PASSING_SCORE = 20;
  return p1Score >= PASSING_SCORE &&
         p2Score >= PASSING_SCORE &&
         p3Score >= PASSING_SCORE;
}
```

### 4. Índices y Optimización

**Índices críticos ya incluidos**:
- `Task`: `taskType`, `prueba`, `moduleId`
- `Attempt`: `userId`, `taskId`, `completedAt`
- `Evaluation`: `prueba`, `evaluatedAt`
- `OralRecording`: `userId`, `evaluationStatus`
- `Progress`: `userId`, `skill`

**Query patterns optimizados**:
```typescript
// Dashboard del estudiante: progreso por destreza
await prisma.progress.findMany({
  where: { userId, levelId },
  include: {
    user: { select: { name: true, email: true } }
  }
});

// Historial de intentos con evaluaciones
await prisma.attempt.findMany({
  where: { userId },
  include: {
    task: { select: { title: true, taskType: true } },
    evaluation: true
  },
  orderBy: { completedAt: 'desc' },
  take: 20
});

// Tareas pendientes en ruta de aprendizaje
await prisma.learningPathItem.findMany({
  where: {
    learningPathId,
    status: { in: ['PENDING', 'IN_PROGRESS'] }
  },
  include: {
    module: {
      include: {
        tasks: { where: { isSimulacro: false } }
      }
    }
  },
  orderBy: [{ week: 'asc' }, { session: 'asc' }]
});
```

### 5. Migraciones y Seed

**Orden de seeding**:
1. Level (C2)
2. Course (1 curso para C2)
3. Modules (9 módulos)
4. Lessons (sesiones por módulo)
5. Tasks (tareas específicas por tipo)
6. TextResource, AudioResource, GraphicResource
7. PaymentPlan (planes de suscripción)

**Ejemplo de seed para módulos**:
```typescript
const modules = [
  {
    order: 1,
    title: 'Léxico y estructuras',
    skills: ['CL'],
    deleTaskTypes: ['P1_T1', 'P1_T2', 'P1_T3'],
    hoursMin: 20,
    hoursMax: 25,
    isFreemium: true // Módulo 1 gratuito para demo
  },
  {
    order: 2,
    title: 'Comprensión auditiva',
    skills: ['CA'],
    deleTaskTypes: ['P1_T4', 'P1_T5', 'P1_T6', 'P1_T7'],
    hoursMin: 20,
    hoursMax: 25
  },
  // ... resto de módulos
];
```

### 6. Validaciones

**En el servidor (Zod schemas recomendado)**:
```typescript
import { z } from 'zod';

const EvaluationSchema = z.object({
  attemptId: z.string().cuid(),
  prueba: z.enum(['PRUEBA_1', 'PRUEBA_2', 'PRUEBA_3']),
  cohesionBand: z.enum(['BAND_0', 'BAND_1', 'BAND_2', 'BAND_3']),
  correccionBand: z.enum(['BAND_0', 'BAND_1', 'BAND_2', 'BAND_3']),
  alcanceBand: z.enum(['BAND_0', 'BAND_1', 'BAND_2', 'BAND_3']),
  cumplimientoBand: z.enum(['BAND_0', 'BAND_1', 'BAND_2', 'BAND_3']),
  holisticBand: z.enum(['BAND_0', 'BAND_1', 'BAND_2', 'BAND_3']).optional(),
  // ... resto de campos
});

// Validación específica para P3
const P3EvaluationSchema = EvaluationSchema.extend({
  holisticBand: z.enum(['BAND_0', 'BAND_1', 'BAND_2', 'BAND_3']) // Obligatorio en P3
});
```

### 7. Soft Deletes (Opcional)

Para mantener historial, considerar añadir:
```prisma
model Task {
  // ... campos existentes
  deletedAt DateTime?

  @@index([deletedAt])
}
```

Queries con soft delete:
```typescript
where: { deletedAt: null }
```

---

## Próximos Pasos

1. ✅ Esquema de base de datos creado
2. **Implementar schema.prisma**: Copiar el esquema a `prisma/schema.prisma`
3. **Crear migraciones**: `npx prisma migrate dev --name init_c2`
4. **Crear seed scripts**: Poblar niveles, curso C2, módulos y tareas básicas
5. **Generar Prisma Client**: `npx prisma generate`
6. **Crear tipos TypeScript**: Exportar types desde Prisma Client
7. **Implementar helpers de scoring**: Funciones de cálculo de puntuaciones
8. **Configurar almacenamiento S3**: Para audios y gráficos

---

## Notas Finales

### Decisiones de diseño:

1. **Banda 2 = APTO**: El sistema está diseñado para que Banda 2 represente el nivel C2 estándar (aprobado)
2. **Evaluación híbrida**: IA para feedback formativo, humanos para certificación
3. **Variedad del español**: Campos `spanishVariety` en recursos para cumplir requisito de 3 variedades mínimas
4. **Mediación multimodal**: Soporte para múltiples fuentes (textos + gráficos) en resourceRefs JSON
5. **Flexibilidad en rutas**: Sistema LearningPath permite rutas estándar, intensivas o personalizadas
6. **Freemium**: Módulo 1 marcado como freemium para demo sin pago
7. **Checkpoints**: Sistema de simulacros parciales y completos integrado en la ruta de aprendizaje

### Compatibilidad con arquitectura existente:

- ✅ Compatible con Auth.js (modelos Account, Session, VerificationToken)
- ✅ Compatible con Stripe (modelos PaymentPlan, Subscription)
- ✅ Extensible para futuros niveles (A1-C1)
- ✅ Soporta roles múltiples (STUDENT, TEACHER, ADMIN)
- ✅ Preparado para i18n (campo `locale` en User)

