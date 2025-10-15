/**
 * tRPC Client
 *
 * Type-safe client for calling tRPC procedures from React components.
 */

import { httpBatchLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { type AppRouter } from "../server/api/root"
import superjson from "superjson"

export const trpc = createTRPCReact<AppRouter>()

function getBaseUrl() {
  if (typeof window !== "undefined") return "" // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export function getTRPCUrl() {
  return getBaseUrl() + "/api/trpc"
}

export const trpcClientOptions = {
  transformer: superjson,
  links: [
    httpBatchLink({
      url: getTRPCUrl(),
    }),
  ],
}
