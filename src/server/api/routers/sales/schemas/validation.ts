import z from 'zod'

export const saleItemInput = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
})

export const createSaleInput = z.object({
  clientId: z.string(),
  items: z.array(saleItemInput).min(1),
  saleDate: z.coerce.date().optional(),
})

const sortOptions = ['saleDate', 'totalAmount', 'createdAt'] as const
export const listSalesInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(sortOptions).default('saleDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const filterSalesInput = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  clientId: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

export const getSummaryInput = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})
