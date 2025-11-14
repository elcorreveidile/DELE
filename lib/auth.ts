import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import type { User as PrismaUser, Role } from "@prisma/client"

// Extender tipos de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      role: Role
      image: string | null
    }
  }

  interface User extends PrismaUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos")
        }

        // Buscar usuario por email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          throw new Error("No existe una cuenta con este email")
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          emailVerified: user.emailVerified,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Error page
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Al hacer login, agregar datos del usuario al token
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // Actualizar sesión si hay cambios
      if (trigger === "update" && session) {
        token.name = session.name
        token.email = session.email
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Redirigir después de login según rol
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith("/")) return `${baseUrl}${url}`
      return baseUrl
    }
  },

  debug: process.env.NODE_ENV === "development",
}

// Helpers para uso en Server Components
export async function getServerSession() {
  const { getServerSession: getSession } = await import("next-auth/next")
  return await getSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getServerSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getServerSession()
  if (!session?.user) {
    throw new Error("No autenticado")
  }
  return session.user
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error("No tienes permisos para esta acción")
  }
  return user
}