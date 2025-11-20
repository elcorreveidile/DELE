import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

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

export async function POST(req: Request) {
  try {
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

    const body = await req.json()

    // Validar datos
    const validatedData = registerSchema.parse(body)

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "STUDENT", // Por defecto todos son estudiantes
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: "Usuario creado exitosamente",
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error en registro:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        {
          error:
            "No se pudo conectar a la base de datos. Verifica DATABASE_URL y que la base esté accesible.",
          hint: "Ejecuta `npx prisma db push` y revisa tus variables de entorno.",
        },
        { status: 500 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2021 / P2003 suelen indicar tablas o relaciones inexistentes
      if (error.code === "P2021" || error.code === "P2003") {
        return NextResponse.json(
          {
            error:
              "La base de datos no tiene el esquema actualizado. Ejecuta `npx prisma db push` o tus migraciones.",
          },
          { status: 500 }
        )
      }
    }

    const reason =
      error instanceof Error
        ? error.message
        : "Error desconocido en el servidor de registro"

    return NextResponse.json(
      { error: "Error al crear usuario", detail: reason },
      { status: 500 }
    )
  }
}
