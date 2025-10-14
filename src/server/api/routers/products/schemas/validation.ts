import { z } from "zod"
import { priceSchema, stockSchema } from "@/lib/validations"

export const createProductInput = z.object({
  name: z.string().min(1).max(255),
  priceInCents: priceSchema,
  stockQty: stockSchema.default(0),
})

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  priceInCents: z.number(),
  stockQty: z.number(),
  createdAt: z.date(),
})

export const updateProductInput = z.object({
  id: z.string(),
  name: z.string().min(1).max(255).optional(),
  priceInCents: priceSchema.optional(),
  stockQty: stockSchema.optional(),
})

const sortOptions = ["name", "priceInCents", "stockQty", "createdAt"] as const

export const listProductsInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  inStockOnly: z.boolean().default(false),
  sortBy: z.enum(sortOptions).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})

export const checkStockInput = z.object({
  productId: z.string(),
  requestedQty: z.number().int().positive(),
})

export const listProductsOutput = z.object({
  products: z.array(productSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

export type TProductSchema = z.infer<typeof productSchema>
export type TListProductsOutput = z.infer<typeof listProductsOutput>
