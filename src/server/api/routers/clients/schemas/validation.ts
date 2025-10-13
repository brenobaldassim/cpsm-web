import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { emailSchema, cpfSchema, addressSchema } from '@/lib/validations'

const clientWithAddresses = Prisma.validator<Prisma.ClientDefaultArgs>()({
  include: { addresses: true },
})

export type ClientWithAddresses = Prisma.ClientGetPayload<
  typeof clientWithAddresses
>

export const clientSchema = z.custom<ClientWithAddresses>((val) => {
  return typeof val === 'object' && val !== null && 'id' in val
})

export const createClientInput = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: emailSchema,
  cpf: cpfSchema,
  socialMedia: z.string().max(100).optional(),
  addresses: z
    .array(addressSchema)
    .min(1)
    .max(2)
    .refine(
      (addresses) => {
        const types = addresses.map((a) => a.type)
        return types.length === new Set(types).size
      },
      { message: 'Cannot have duplicate address types' }
    ),
})

export const updateClientInput = z.object({
  id: z.string(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: emailSchema.optional(),
  socialMedia: z.string().max(100).optional(),
  addresses: z
    .array(addressSchema)
    .min(1)
    .max(2)
    .optional()
    .refine(
      (addresses) => {
        if (!addresses) return true
        const types = addresses.map((a) => a.type)
        return types.length === new Set(types).size
      },
      { message: 'Cannot have duplicate address types' }
    ),
})

const sortOptions = ['firstName', 'lastName', 'email', 'createdAt'] as const

export const listClientsInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  sortBy: z.enum(sortOptions).default('lastName'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export const listClientsOutput = z.object({
  clients: z.array(clientSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

export type TListClientsOutput = z.infer<typeof listClientsOutput>
export type TClientSchema = z.infer<typeof clientSchema>
