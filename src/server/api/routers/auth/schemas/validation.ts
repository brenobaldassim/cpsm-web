import { emailSchema, passwordSchema } from "@/lib/validations"
import { z } from "zod"
import { User } from "@prisma/client"

export const signupInput = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type UserOutput = Omit<User, "password">

export const userOutput = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<UserOutput>
