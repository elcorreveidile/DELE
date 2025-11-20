import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/auth"

const f = createUploadthing()

const requireUser = async () => {
  const session = await auth()
  if (!session?.user) throw new Error("No autorizado")
  return session.user.id
}

export const fileRouter = {
  avatarUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const userId = await requireUser()
      return { userId }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof fileRouter
