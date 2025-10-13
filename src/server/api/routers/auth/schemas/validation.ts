import { emailSchema, passwordSchema } from '@/lib/validations'
import { z } from 'zod'

export const signupInput = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const userOutput = z.object({
  id: z.string(),
  email: z.string(),
  createdAt: z.date(),
})
