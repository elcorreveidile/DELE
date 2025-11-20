import { NextResponse } from "next/server"
import { z } from "zod"
import { Prisma, DeleLevel } from "@prisma/client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const requestCounts = new Map<string, { count: number; timestamp: number }>()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

function rateLimit(key: string) {
  const now = Date.now()
  const entry = requestCounts.get(key)
  if (!entry || now - entry.timestamp > WINDOW_MS) {
    requestCounts.set(key, { count: 1, timestamp: now })
    return false
  }
  entry.count += 1
  if (entry.count > MAX_REQUESTS) return true
  return false
}

const profileSchema = z.object({
  currentLevel: z
    .nativeEnum(DeleLevel)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  targetLevel: z
    .nativeEnum(DeleLevel)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120)
    .optional(),
  avatarUrl: z.string().url().optional(),
  studyHoursPerWeek: z
    .preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined
      const num = Number(val)
      return Number.isNaN(num) ? val : num
    }, z.number().int().min(0).max(168).optional()),
  examDate: z
    .preprocess((val) => {
      if (!val) return undefined
      const date = new Date(String(val))
      return Number.isNaN(date.getTime()) ? val : date
    }, z.date().optional()),
})

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown"
  if (rateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes, inténtalo en unos segundos." },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const data = profileSchema.parse(body)

    const profileData = {
      currentLevel: data.currentLevel,
      targetLevel: data.targetLevel,
      studyHoursPerWeek: data.studyHoursPerWeek,
      examDate: data.examDate,
    }

    // Actualizar usuario (nombre/avatar) y perfil
    if (data.name || data.avatarUrl) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: data.name,
          image: data.avatarUrl,
        },
      })
    }

    const profile = await prisma.studentProfile.upsert({
      where: { userId: session.user.id },
      update: profileData,
      create: {
        userId: session.user.id,
        ...profileData,
      },
    })

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Error al guardar el perfil", code: error.code },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Error desconocido al actualizar el perfil" },
      { status: 500 }
    )
  }
}
