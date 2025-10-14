/**
 * Clients tRPC Router
 *
 * Handles client management: create, update, delete, list, getById
 * Includes Brazilian-specific validations (CPF, CEP)
 */

import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../../trpc"
import {
  createClientInput,
  updateClientInput,
  listClientsInput,
  listClientsOutput,
} from "./schemas/validation"

export const clientsRouter = createTRPCRouter({
  /**
   * clients.create
   * Create a new client with addresses
   */
  create: protectedProcedure
    .input(createClientInput)
    .mutation(async ({ input, ctx }) => {
      const { addresses, ...clientData } = input

      // Check for duplicate CPF
      const existingClient = await ctx.prisma.client.findUnique({
        where: { cpf: input.cpf },
      })

      if (existingClient) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "CPF already registered",
        })
      }

      // Get user ID from context (using seed admin for now)
      const user = await ctx.prisma.user.findFirst()
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user found",
        })
      }

      // Create client with addresses
      const client = await ctx.prisma.client.create({
        data: {
          ...clientData,
          createdBy: user.id,
          addresses: {
            create: addresses,
          },
        },
        include: {
          addresses: true,
        },
      })

      return client
    }),

  /**
   * clients.update
   * Update existing client
   */
  update: protectedProcedure
    .input(updateClientInput)
    .mutation(async ({ input, ctx }) => {
      const { id, addresses, ...updateData } = input

      // Check if client exists
      const existingClient = await ctx.prisma.client.findUnique({
        where: { id },
      })

      if (!existingClient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        })
      }

      // Update client and addresses
      if (addresses) {
        // Delete existing addresses and create new ones
        await ctx.prisma.address.deleteMany({
          where: { clientId: id },
        })
      }

      const client = await ctx.prisma.client.update({
        where: { id },
        data: {
          ...updateData,
          ...(addresses && {
            addresses: {
              create: addresses,
            },
          }),
        },
        include: {
          addresses: true,
        },
      })

      return client
    }),

  /**
   * clients.delete
   * Delete a client (only if no sales)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Check if client exists
      const client = await ctx.prisma.client.findUnique({
        where: { id: input.id },
        include: { sales: true },
      })

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        })
      }

      // Check if client has sales
      if (client.sales.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cannot delete client with sales history",
        })
      }

      // Delete client (addresses will cascade)
      await ctx.prisma.client.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  /**
   * clients.getById
   * Get client by ID with addresses
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const client = await ctx.prisma.client.findUnique({
        where: { id: input.id },
        include: {
          addresses: true,
        },
      })

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        })
      }

      return client
    }),

  /**
   * clients.list
   * List clients with pagination, search, sorting
   */
  list: protectedProcedure
    .input(listClientsInput)
    .output(listClientsOutput)
    .query(async ({ input, ctx }) => {
      const { page, limit, search, sortBy, sortOrder } = input
      const skip = (page - 1) * limit

      // Build where clause
      const where = search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}

      // Get total count
      const total = await ctx.prisma.client.count({ where })

      // Get clients
      const clients = await ctx.prisma.client.findMany({
        where,
        include: {
          addresses: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      })

      return {
        clients,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }),
})
