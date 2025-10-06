/**
 * tRPC Root Router
 *
 * Combines all sub-routers into a single API.
 * Export type definition for client-side type inference.
 */

import { createTRPCRouter } from './trpc'
import { authRouter } from './routers/auth'
// import { clientsRouter } from './routers/clients'
// import { productsRouter } from './routers/products'
// import { salesRouter } from './routers/sales'

/**
 * Root router - merges all API routers
 */
export const appRouter = createTRPCRouter({
  auth: authRouter, // T030 ✓
  // clients: clientsRouter,  // T031-T032
  // products: productsRouter, // T033-T034
  // sales: salesRouter,     // T035-T036
})

// Export type definition for client-side
export type AppRouter = typeof appRouter
