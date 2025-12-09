-- Manual Migration for DELE C2 Platform
-- Generated from prisma/schema.prisma

-- Create ENUM types
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
CREATE TYPE "C2TaskType" AS ENUM (
  'P1_T1', 'P1_T2', 'P1_T3', 'P1_T4', 'P1_T5', 'P1_T6', 'P1_T7',
  'P2_T1', 'P2_T2', 'P2_T3',
  'P3_T1', 'P3_T2', 'P3_T3'
);
CREATE TYPE "Prueba" AS ENUM ('PRUEBA_1', 'PRUEBA_2', 'PRUEBA_3');
CREATE TYPE "Skill" AS ENUM ('CL', 'CA', 'EE', 'EO', 'IE', 'IO', 'ME', 'MO');
CREATE TYPE "MediationMode" AS ENUM ('ORAL', 'ESCRITA', 'MULTIMODAL');
CREATE TYPE "Difficulty" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
CREATE TYPE "RouteType" AS ENUM ('STANDARD', 'INTENSIVE', 'LONG_TERM', 'CUSTOM');
CREATE TYPE "PathStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'ABANDONED');
CREATE TYPE "ItemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');
CREATE TYPE "CheckpointType" AS ENUM ('PARTIAL_SIMULACRO', 'FULL_SIMULACRO', 'SELF_ASSESSMENT', 'REVIEW');
CREATE TYPE "Band" AS ENUM ('BAND_0', 'BAND_1', 'BAND_2', 'BAND_3');
CREATE TYPE "EvaluationType" AS ENUM ('AI', 'HUMAN', 'HYBRID');
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'COMPLETED');
CREATE TYPE "Interval" AS ENUM ('MONTHLY', 'YEARLY', 'ONE_TIME');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'UNPAID');
CREATE TYPE "ContentType" AS ENUM ('TEXT', 'AUDIO', 'GRAPHIC', 'VIDEO', 'SCENARIO', 'INSTRUCTION');
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED');

-- Users and Authentication
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "locale" TEXT NOT NULL DEFAULT 'es',
    "levelEstimated" TEXT,
    "levelGoal" TEXT,
    "weeklyHours" INTEGER,
    "examDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "comprehensionLectura" INTEGER,
    "comprehensionAuditiva" INTEGER,
    "expresionEscrita" INTEGER,
    "expresionOral" INTEGER,
    "interaccionOral" INTEGER,
    "mediacionEscrita" INTEGER,
    "mediacionOral" INTEGER,
    "hasStudiedSpanish" BOOLEAN NOT NULL DEFAULT false,
    "yearsStudying" INTEGER,
    "hasLivedInSpain" BOOLEAN NOT NULL DEFAULT false,
    "monthsInSpain" INTEGER,
    "previousDELELevel" TEXT,
    "previousDELEDate" TIMESTAMP(3),
    "preferredStudyTime" TEXT,
    "learningStyleVisual" BOOLEAN NOT NULL DEFAULT true,
    "learningStyleAuditory" BOOLEAN NOT NULL DEFAULT true,
    "learningStyleKinesthetic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    UNIQUE("provider", "providerAccountId")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expires" TIMESTAMP(3) NOT NULL,
    UNIQUE("identifier", "token")
);

-- Course Structure
CREATE TABLE "Level" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "levelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hoursRecommendedMin" INTEGER NOT NULL,
    "hoursRecommendedMax" INTEGER NOT NULL,
    "isFreemiumUnitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("levelId") REFERENCES "Level"("id"),
    UNIQUE("levelId")
);

CREATE TABLE "Module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" TEXT[] NOT NULL,
    "skills" "Skill"[] NOT NULL,
    "deleTaskTypes" "C2TaskType"[] NOT NULL,
    "hoursMin" INTEGER NOT NULL,
    "hoursMax" INTEGER NOT NULL,
    "isFreemium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE,
    UNIQUE("courseId", "order")
);

CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" TEXT[] NOT NULL,
    "resources" JSONB[] NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE,
    UNIQUE("moduleId", "order")
);

-- Tasks
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "lessonId" TEXT,
    "taskType" "C2TaskType" NOT NULL,
    "skill" "Skill" NOT NULL,
    "prueba" "Prueba" NOT NULL,
    "weight" DOUBLE PRECISION,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "description" TEXT,
    "resourceRefs" JSONB[] NOT NULL,
    "domain" TEXT,
    "textGenre" TEXT,
    "wordCountMin" INTEGER,
    "wordCountMax" INTEGER,
    "durationMinutes" INTEGER,
    "preparationMinutes" INTEGER,
    "requiresMultipleSources" BOOLEAN NOT NULL DEFAULT false,
    "sourceCount" INTEGER,
    "mediationMode" "MediationMode",
    "difficulty" "Difficulty" NOT NULL DEFAULT 'C2',
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "isSimulacro" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE,
    FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL
);

-- Exam Models
CREATE TABLE "ExamModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "levelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "convocatoria" TEXT NOT NULL,
    "pdfPath" TEXT NOT NULL,
    "section" "Prueba" NOT NULL,
    "taskType" "C2TaskType",
    "duration" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("levelId") REFERENCES "Level"("id")
);

-- Learning Paths
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "routeType" "RouteType" NOT NULL DEFAULT 'STANDARD',
    "startDate" TIMESTAMP(3) NOT NULL,
    "targetDate" TIMESTAMP(3),
    "status" "PathStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("courseId") REFERENCES "Course"("id"),
    UNIQUE("userId", "courseId")
);

CREATE TABLE "LearningPathItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "learningPathId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "session" INTEGER NOT NULL,
    "scheduledDate" TIMESTAMP(3),
    "status" "ItemStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "timeSpentMinutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE,
    FOREIGN KEY ("moduleId") REFERENCES "Module"("id"),
    UNIQUE("learningPathId", "moduleId")
);

-- Checkpoints
CREATE TABLE "Checkpoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "learningPathId" TEXT NOT NULL,
    "type" "CheckpointType" NOT NULL,
    "week" INTEGER NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "prueba1Score" DOUBLE PRECISION,
    "prueba2Score" DOUBLE PRECISION,
    "prueba3Score" DOUBLE PRECISION,
    "totalScore" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "feedback" TEXT,
    "weaknesses" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE
);

-- Attempts and Evaluations
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "taskId" TEXT,
    "examModelId" TEXT,
    "submissionText" TEXT,
    "submissionFiles" JSONB[] NOT NULL,
    "autoScore" DOUBLE PRECISION,
    "correctAnswers" INTEGER,
    "totalQuestions" INTEGER,
    "durationSeconds" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aiFeedback" TEXT,
    "aiAnalysis" JSONB,
    "humanFeedback" TEXT,
    "evaluatorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL,
    FOREIGN KEY ("examModelId") REFERENCES "ExamModel"("id") ON DELETE SET NULL
);

CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attemptId" TEXT NOT NULL UNIQUE,
    "prueba" "Prueba" NOT NULL,
    "taskType" "C2TaskType" NOT NULL,
    "cohesionBand" "Band" NOT NULL,
    "cohesionComment" TEXT,
    "correccionBand" "Band" NOT NULL,
    "correccionComment" TEXT,
    "alcanceBand" "Band" NOT NULL,
    "alcanceComment" TEXT,
    "cumplimientoBand" "Band" NOT NULL,
    "cumplimientoComment" TEXT,
    "holisticBand" "Band",
    "holisticComment" TEXT,
    "criteriaScore" DOUBLE PRECISION NOT NULL,
    "holisticScore" DOUBLE PRECISION,
    "finalScore" DOUBLE PRECISION NOT NULL,
    "weightsUsed" JSONB NOT NULL,
    "evaluatedBy" "EvaluationType" NOT NULL,
    "evaluatorId" TEXT,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generalFeedback" TEXT,
    "strengths" TEXT[] NOT NULL,
    "weaknesses" TEXT[] NOT NULL,
    "recommendations" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE CASCADE
);

-- Oral Recordings
CREATE TABLE "OralRecording" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL UNIQUE,
    "audioUrl" TEXT NOT NULL,
    "audioFormat" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "taskType" "C2TaskType" NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transcription" TEXT,
    "transcribedBy" TEXT,
    "evaluationStatus" "EvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "evaluatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE CASCADE
);

-- Progress
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "skill" "Skill" NOT NULL,
    "levelId" TEXT NOT NULL,
    "completion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION,
    "attemptsCount" INTEGER NOT NULL DEFAULT 0,
    "timeSpentMinutes" INTEGER NOT NULL DEFAULT 0,
    "avgCohesionBand" DOUBLE PRECISION,
    "avgCorreccionBand" DOUBLE PRECISION,
    "avgAlcanceBand" DOUBLE PRECISION,
    "avgCumplimientoBand" DOUBLE PRECISION,
    "strengths" TEXT[] NOT NULL,
    "weaknesses" TEXT[] NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    UNIQUE("userId", "skill", "levelId")
);

-- Payments
CREATE TABLE "PaymentPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "interval" "Interval" NOT NULL,
    "accessScope" TEXT[] NOT NULL,
    "features" TEXT[] NOT NULL,
    "stripePriceId" TEXT NOT NULL UNIQUE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL UNIQUE,
    "stripeCustomerId" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("planId") REFERENCES "PaymentPlan"("id")
);

-- Content
CREATE TABLE "ContentPiece" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentId" TEXT NOT NULL UNIQUE,
    "type" "ContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "genre" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "level" "Difficulty" NOT NULL DEFAULT 'C2',
    "wordCount" INTEGER,
    "durationSeconds" INTEGER,
    "spanishVariety" TEXT NOT NULL,
    "keywords" TEXT[] NOT NULL,
    "lexicalC2Terms" TEXT[] NOT NULL,
    "grammarFeatures" TEXT[] NOT NULL,
    "deleTaskTypes" "C2TaskType"[] NOT NULL,
    "usedInModules" TEXT[] NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileUrl" TEXT,
    "thumbnailUrl" TEXT,
    "createdBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "qualityScore" DOUBLE PRECISION,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Indexes
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Course_levelId_idx" ON "Course"("levelId");
CREATE INDEX "Module_courseId_idx" ON "Module"("courseId");
CREATE INDEX "Lesson_moduleId_idx" ON "Lesson"("moduleId");
CREATE INDEX "Task_taskType_idx" ON "Task"("taskType");
CREATE INDEX "Task_prueba_idx" ON "Task"("prueba");
CREATE INDEX "Task_moduleId_idx" ON "Task"("moduleId");
CREATE INDEX "ExamModel_levelId_idx" ON "ExamModel"("levelId");
CREATE INDEX "ExamModel_section_idx" ON "ExamModel"("section");
CREATE INDEX "LearningPath_userId_idx" ON "LearningPath"("userId");
CREATE INDEX "LearningPathItem_learningPathId_status_idx" ON "LearningPathItem"("learningPathId", "status");
CREATE INDEX "Checkpoint_learningPathId_idx" ON "Checkpoint"("learningPathId");
CREATE INDEX "Attempt_userId_idx" ON "Attempt"("userId");
CREATE INDEX "Attempt_taskId_idx" ON "Attempt"("taskId");
CREATE INDEX "Attempt_completedAt_idx" ON "Attempt"("completedAt");
CREATE INDEX "Evaluation_prueba_idx" ON "Evaluation"("prueba");
CREATE INDEX "Evaluation_evaluatedAt_idx" ON "Evaluation"("evaluatedAt");
CREATE INDEX "OralRecording_userId_idx" ON "OralRecording"("userId");
CREATE INDEX "OralRecording_evaluationStatus_idx" ON "OralRecording"("evaluationStatus");
CREATE INDEX "Progress_userId_idx" ON "Progress"("userId");
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");
CREATE INDEX "ContentPiece_type_status_idx" ON "ContentPiece"("type", "status");
CREATE INDEX "ContentPiece_level_category_idx" ON "ContentPiece"("level", "category");
