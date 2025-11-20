import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales inválidas")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
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
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role as Role
      }
      return token
    },
    async session({ session, token }) {
      if (!session.user) return session

      // En runtime Edge (middleware) evitamos llamadas a Prisma
      const isEdge =
        typeof (globalThis as { EdgeRuntime?: string }).EdgeRuntime !==
        "undefined"
      if (isEdge) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        return session
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        select: { id: true, name: true, email: true, role: true, image: true },
      })

      session.user.id = token.id as string
      session.user.role = token.role as Role
      if (dbUser) {
        session.user.name = dbUser.name ?? session.user.name
        session.user.email = dbUser.email ?? session.user.email
        session.user.image = dbUser.image ?? session.user.image
      }

      return session
    },
  },
})
