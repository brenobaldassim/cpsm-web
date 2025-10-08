/**
 * Server-side tRPC Caller
 *
 * Create a tRPC caller that can be used in Server Components
 * for Server-Side Rendering (SSR).
 */

import { cache } from 'react'
import { createCaller as createCallerFactory } from './root'
import { createTRPCContext } from './trpc'

/**
 * Create a server-side tRPC caller
 * Uses React cache to dedupe requests within the same render
 */
export const createCaller = cache(async () => {
  const context = await createTRPCContext({
    req: new Request(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
    resHeaders: new Headers(),
  })
  return createCallerFactory(context)
})
