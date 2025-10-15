/**
 * Products tRPC Router
 *
 * Handles product management with stock tracking:
 * create, update, delete, list, getById, checkStock
 */

import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../../trpc"
import {
  createProductInput,
  updateProductInput,
  listProductsInput,
  listProductsOutput,
  checkStockInput,
} from "./schemas/validation"

export const productsRouter = createTRPCRouter({
  /**
   * products.create
   * Create a new product
   */
  create: protectedProcedure
    .input(createProductInput)
    .mutation(async ({ input, ctx }) => {
      // Get user ID
      const user = await ctx.prisma.user.findFirst()
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user found",
        })
      }

      const product = await ctx.prisma.product.create({
        data: {
          ...input,
          createdBy: user.id,
        },
      })

      return product
    }),

  /**
   * products.update
   * Update product (price changes don't affect historical sales)
   */
  update: protectedProcedure
    .input(updateProductInput)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input

      // Check if product exists
      const existingProduct = await ctx.prisma.product.findUnique({
        where: { id },
      })

      if (!existingProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        })
      }

      const product = await ctx.prisma.product.update({
        where: { id },
        data: updateData,
      })

      return product
    }),

  /**
   * products.delete
   * Delete a product (only if no sales)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Check if product exists
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.id },
        include: { saleItems: true },
      })

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        })
      }

      // Check if product has sales
      if (product.saleItems.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cannot delete product with sales history",
        })
      }

      await ctx.prisma.product.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  /**
   * products.getById
   * Get product by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.id },
      })

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        })
      }

      return product
    }),

  /**
   * products.list
   * List products with pagination, search, filtering
   */
  list: protectedProcedure
    .input(listProductsInput)
    .output(listProductsOutput)
    .query(async ({ input, ctx }) => {
      const { page, limit, search, inStockOnly, sortBy, sortOrder } = input
      const skip = (page - 1) * limit

      // Build where clause
      const where: {
        name?: { contains: string; mode: "insensitive" }
        stockQty?: { gt: number }
      } = {}

      if (search) {
        where.name = { contains: search, mode: "insensitive" as const }
      }

      if (inStockOnly) {
        where.stockQty = { gt: 0 }
      }

      // Get total count
      const total = await ctx.prisma.product.count({ where })

      // Get products
      const products = await ctx.prisma.product.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      })

      return {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }),

  /**
   * products.checkStock
   * Check if requested quantity is available
   */
  checkStock: protectedProcedure
    .input(checkStockInput)
    .query(async ({ input, ctx }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.productId },
      })

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        })
      }

      return {
        available: product.stockQty >= input.requestedQty,
        currentStock: product.stockQty,
        requestedQty: input.requestedQty,
      }
    }),
})
