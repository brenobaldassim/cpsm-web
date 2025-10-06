/**
 * NextAuth.js API Route Handler
 *
 * Handles all authentication routes:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/session
 * - etc.
 */

import { handlers } from '@/server/auth'

export const { GET, POST } = handlers
