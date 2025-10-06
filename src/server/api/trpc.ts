/**
 * tRPC Server Setup
 *
 * Initializes tRPC with context (session, db) and error formatting.
 * Exports procedures (public, protected) for creating API routes.
 */

import { initTRPC } from '@trpc/server'
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { prisma } from '../db'

/**
 * Create context for each request
 * Contains: database client, session (if authenticated)
 */
export async function createTRPCContext(_opts: FetchCreateContextFnOptions) {
  return {
    prisma,
    // TODO: Add session from NextAuth when T025-T026 are complete
    session: null as { user: { id: string; email: string } } | null,
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

/**
 * Initialize tRPC with context and transformers
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * Create router
 */
export const createTRPCRouter = t.router

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure

/**
 * Protected procedure - requires authentication
 * TODO: Implement authentication check when T025-T026 are complete
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // For now, allow all requests during development
  // This will be replaced with proper authentication check
  if (!ctx.session?.user) {
    // Temporarily commented out until auth is implemented
    // throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session!.user },
    },
  })
})
