/**
 * Authentication tRPC Router Contracts
 * Feature: 001-build-an-application
 *
 * Procedures for user authentication and session management.
 */

import { z } from 'zod'

// ============================================================================
// Input Schemas
// ============================================================================

export const loginInput = z.object({
  email: z.string().email().min(3).max(100),
  password: z.string().min(8).max(100),
})

export const signupInput = z.object({
  email: z.string().email().min(3).max(100),
  password: z.string().min(8).max(100),
})

// ============================================================================
// Output Schemas
// ============================================================================

export const userOutput = z.object({
  id: z.string(),
  email: z.string(),
  createdAt: z.date(),
})

export const sessionOutput = z.object({
  user: userOutput,
  expiresAt: z.date(),
})

// ============================================================================
// Procedure Definitions
// ============================================================================

/**
 * auth.login
 *
 * Authenticate user with email and password.
 *
 * Input:
 *   - email: string (valid email, 3-100 chars)
 *   - password: string (8-100 chars)
 *
 * Output:
 *   - user: User object
 *   - expiresAt: Session expiration timestamp
 *
 * Errors:
 *   - UNAUTHORIZED: Invalid credentials
 *   - TOO_MANY_REQUESTS: Rate limit exceeded
 *
 * Test Cases:
 *   1. Valid credentials → Return session
 *   2. Invalid email → UNAUTHORIZED
 *   3. Invalid password → UNAUTHORIZED
 *   4. Missing fields → Validation error
 *   5. Multiple failed attempts → Rate limit
 */
export const loginProcedure = {
  input: loginInput,
  output: sessionOutput,
}

/**
 * auth.signup
 *
 * Create new user account.
 *
 * Input:
 *   - email: string (valid email, 3-100 chars, unique)
 *   - password: string (8-100 chars)
 *
 * Output:
 *   - user: User object
 *
 * Errors:
 *   - CONFLICT: Email already exists
 *   - BAD_REQUEST: Invalid input format
 *
 * Test Cases:
 *   1. Valid new user → Create and return user
 *   2. Duplicate email → CONFLICT
 *   3. Weak password → Validation error
 *   4. Invalid email format → Validation error
 */
export const signupProcedure = {
  input: signupInput,
  output: userOutput,
}

/**
 * auth.logout
 *
 * End current user session.
 *
 * Input: void
 *
 * Output:
 *   - success: boolean
 *
 * Test Cases:
 *   1. Active session → Logout successful
 *   2. No session → Returns success (idempotent)
 */
export const logoutProcedure = {
  input: z.void(),
  output: z.object({ success: z.boolean() }),
}

/**
 * auth.getSession
 *
 * Get current authenticated user session.
 *
 * Input: void
 *
 * Output:
 *   - session: Session object or null if not authenticated
 *
 * Test Cases:
 *   1. Authenticated → Return session
 *   2. Not authenticated → Return null
 *   3. Expired session → Return null
 */
export const getSessionProcedure = {
  input: z.void(),
  output: sessionOutput.nullable(),
}

// ============================================================================
// Contract Summary
// ============================================================================

export const authContract = {
  login: loginProcedure,
  signup: signupProcedure,
  logout: logoutProcedure,
  getSession: getSessionProcedure,
}
