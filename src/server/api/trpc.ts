/**
 * tRPC Server Setup
 *
 * Initializes tRPC with context (session, db) and error formatting.
 * Exports procedures (public, protected) for creating API routes.
 */

import { initTRPC, TRPCError } from "@trpc/server"
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import superjson from "superjson"
import { ZodError } from "zod"
import { auth } from "../auth"
import { prisma } from "../db"

/**
 * Create context for each request
 * Contains: database client, session (if authenticated)
 */
export async function createTRPCContext(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _opts: FetchCreateContextFnOptions
) {
  const session = await auth()

  return {
    prisma,
    session,
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
 * Create caller factory for server-side calls
 */
export const createCallerFactory = t.createCallerFactory

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure

/**
 * Protected procedure - requires authentication
 * Throws UNAUTHORIZED error if user is not authenticated
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    })
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  })
})
