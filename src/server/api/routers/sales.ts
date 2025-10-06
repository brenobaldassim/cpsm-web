/**
 * Sales tRPC Router
 *
 * Handles sales creation and reporting:
 * - Automatic stock deduction
 * - Price preservation (historical prices locked)
 * - Date-based filtering
 */

import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

// Input schemas
const saleItemInput = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
})

const createSaleInput = z.object({
  clientId: z.string(),
  items: z.array(saleItemInput).min(1),
  saleDate: z.coerce.date().optional(),
})

const listSalesInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['saleDate', 'totalAmount', 'createdAt']).default('saleDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

const filterSalesInput = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  clientId: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

const getSummaryInput = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})

export const salesRouter = createTRPCRouter({
  /**
   * sales.create
   * Create a sale with automatic stock deduction and price preservation
   */
  create: protectedProcedure
    .input(createSaleInput)
    .mutation(async ({ input, ctx }) => {
      const { clientId, items, saleDate } = input

      // Get user ID
      const user = await ctx.prisma.user.findFirst()
      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No user found',
        })
      }

      // Verify client exists
      const client = await ctx.prisma.client.findUnique({
        where: { id: clientId },
      })

      if (!client) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Client not found',
        })
      }

      // Validate products and stock availability
      const productIds = items.map((item) => item.productId)
      const products = await ctx.prisma.product.findMany({
        where: { id: { in: productIds } },
      })

      if (products.length !== items.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'One or more products not found',
        })
      }

      // Check stock availability
      const stockChecks = items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!
        return {
          productId: item.productId,
          productName: product.name,
          available: product.stockQty,
          requested: item.quantity,
        }
      })

      const insufficientStock = stockChecks.filter(
        (check) => check.available < check.requested
      )

      if (insufficientStock.length > 0) {
        const message = insufficientStock
          .map(
            (s) =>
              `${s.productName}: ${s.requested} requested, ${s.available} available`
          )
          .join('; ')
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Insufficient stock: ${message}`,
        })
      }

      // Calculate total and prepare sale items
      const saleItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!
        return {
          productId: item.productId,
          quantity: item.quantity,
          priceInCents: product.priceInCents, // Price preservation
          subtotalInCents: product.priceInCents * item.quantity,
        }
      })

      const totalAmount = saleItems.reduce(
        (sum, item) => sum + item.subtotalInCents,
        0
      )

      // Create sale in a transaction
      const sale = await ctx.prisma.$transaction(async (tx) => {
        // Deduct stock
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQty: {
                decrement: item.quantity,
              },
            },
          })
        }

        // Create sale
        const newSale = await tx.sale.create({
          data: {
            clientId,
            createdBy: user.id,
            saleDate: saleDate || new Date(),
            totalAmount,
            saleItems: {
              create: saleItems,
            },
          },
          include: {
            saleItems: {
              include: {
                product: true,
              },
            },
            client: {
              include: {
                addresses: true,
              },
            },
          },
        })

        return newSale
      })

      return sale
    }),

  /**
   * sales.getById
   * Get sale details with items, client, and products
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const sale = await ctx.prisma.sale.findUnique({
        where: { id: input.id },
        include: {
          saleItems: {
            include: {
              product: true,
            },
          },
          client: {
            include: {
              addresses: true,
            },
          },
        },
      })

      if (!sale) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Sale not found',
        })
      }

      return sale
    }),

  /**
   * sales.list
   * List all sales with pagination
   */
  list: protectedProcedure
    .input(listSalesInput)
    .query(async ({ input, ctx }) => {
      const { page, limit, sortBy, sortOrder } = input
      const skip = (page - 1) * limit

      const total = await ctx.prisma.sale.count()

      const sales = await ctx.prisma.sale.findMany({
        include: {
          saleItems: {
            include: {
              product: true,
            },
          },
          client: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      })

      return {
        sales,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }),

  /**
   * sales.filter
   * Filter sales by date range and/or client
   */
  filter: protectedProcedure
    .input(filterSalesInput)
    .query(async ({ input, ctx }) => {
      const { startDate, endDate, clientId, page, limit } = input
      const skip = (page - 1) * limit

      // Build where clause
      const where: {
        saleDate?: { gte?: Date; lte?: Date }
        clientId?: string
      } = {}

      if (startDate || endDate) {
        where.saleDate = {}
        if (startDate) where.saleDate.gte = startDate
        if (endDate) where.saleDate.lte = endDate
      }

      if (clientId) {
        where.clientId = clientId
      }

      const total = await ctx.prisma.sale.count({ where })

      const sales = await ctx.prisma.sale.findMany({
        where,
        include: {
          saleItems: {
            include: {
              product: true,
            },
          },
          client: true,
        },
        orderBy: {
          saleDate: 'desc',
        },
        skip,
        take: limit,
      })

      return {
        sales,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }),

  /**
   * sales.getSummary
   * Get sales summary for date range (total sales, revenue)
   */
  getSummary: protectedProcedure
    .input(getSummaryInput)
    .query(async ({ input, ctx }) => {
      const { startDate, endDate } = input

      const sales = await ctx.prisma.sale.findMany({
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          saleItems: true,
        },
      })

      const totalSales = sales.length
      const totalRevenueInCents = sales.reduce(
        (sum, sale) => sum + sale.totalAmount,
        0
      )
      const totalItemsSold = sales.reduce(
        (sum, sale) =>
          sum + sale.saleItems.reduce((s, item) => s + item.quantity, 0),
        0
      )

      return {
        startDate,
        endDate,
        totalSales,
        totalRevenueInCents,
        averageSaleInCents:
          totalSales > 0 ? Math.round(totalRevenueInCents / totalSales) : 0,
        totalItemsSold,
      }
    }),
})
