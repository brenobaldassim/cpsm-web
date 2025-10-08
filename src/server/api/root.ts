/**
 * tRPC Root Router
 *
 * Combines all sub-routers into a single API.
 * Export type definition for client-side type inference.
 */

import { createTRPCRouter, createCallerFactory } from './trpc'
import { authRouter } from './routers/auth'
import { clientsRouter } from './routers/clients'
import { productsRouter } from './routers/products'
import { salesRouter } from './routers/sales'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  clients: clientsRouter,
  products: productsRouter,
  sales: salesRouter,
})

// Export type definition for client-side
export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
