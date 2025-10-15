import z from "zod"
import { Prisma } from "@prisma/client"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const saleWithItemsAndClient = Prisma.validator<Prisma.SaleDefaultArgs>()({
  include: { saleItems: true, client: true },
})

export type SaleWithItemsAndClient = Prisma.SaleGetPayload<
  typeof saleWithItemsAndClient
>

export const saleSchema = z.custom<SaleWithItemsAndClient>((val) => {
  return typeof val === "object" && val !== null && "id" in val
})

export const saleItemInput = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
})

export const createSaleInput = z.object({
  clientId: z.string(),
  items: z.array(saleItemInput).min(1),
  saleDate: z.coerce.date().optional(),
})

const sortOptions = ["saleDate", "totalAmount", "createdAt"] as const
export const listSalesInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(sortOptions).default("saleDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
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

export const listSalesOutput = z.object({
  sales: z.array(saleSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

export type TSaleSchema = z.infer<typeof saleSchema>
export type TListSalesOutput = z.infer<typeof listSalesOutput>
