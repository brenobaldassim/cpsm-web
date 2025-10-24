/**
 * tRPC Root Router
 *
 * Combines all sub-routers into a single API.
 * Export type definition for client-side type inference.
 */

import { createTRPCRouter, createCallerFactory } from "./trpc"
import { authRouter } from "./routers/auth/router"
import { clientsRouter } from "./routers/clients/router"
import { productsRouter } from "./routers/products/router"
import { salesRouter } from "./routers/sales/router"

export const appRouter = createTRPCRouter({
  auth: authRouter,
  clients: clientsRouter,
  products: productsRouter,
  sales: salesRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
