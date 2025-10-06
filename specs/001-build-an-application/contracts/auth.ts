/**
 * Authentication tRPC Router Contracts
 * Feature: 001-build-an-application
 *
 * Procedures for user authentication and session management.
 */

import { z } from "zod";

// ============================================================================
// Input Schemas
// ============================================================================

export const loginInput = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100),
});

export const signupInput = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100),
});

// ============================================================================
// Output Schemas
// ============================================================================

export const userOutput = z.object({
  id: z.string(),
  username: z.string(),
  createdAt: z.date(),
});

export const sessionOutput = z.object({
  user: userOutput,
  expiresAt: z.date(),
});

// ============================================================================
// Procedure Definitions
// ============================================================================

/**
 * auth.login
 *
 * Authenticate user with username and password.
 *
 * Input:
 *   - username: string (3-50 chars)
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
 *   2. Invalid username → UNAUTHORIZED
 *   3. Invalid password → UNAUTHORIZED
 *   4. Missing fields → Validation error
 *   5. Multiple failed attempts → Rate limit
 */
export const loginProcedure = {
  input: loginInput,
  output: sessionOutput,
};

/**
 * auth.signup
 *
 * Create new user account.
 *
 * Input:
 *   - username: string (3-50 chars, unique)
 *   - password: string (8-100 chars)
 *
 * Output:
 *   - user: User object
 *
 * Errors:
 *   - CONFLICT: Username already exists
 *   - BAD_REQUEST: Invalid input format
 *
 * Test Cases:
 *   1. Valid new user → Create and return user
 *   2. Duplicate username → CONFLICT
 *   3. Weak password → Validation error
 *   4. Invalid username format → Validation error
 */
export const signupProcedure = {
  input: signupInput,
  output: userOutput,
};

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
};

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
};

// ============================================================================
// Contract Summary
// ============================================================================

export const authContract = {
  login: loginProcedure,
  signup: signupProcedure,
  logout: logoutProcedure,
  getSession: getSessionProcedure,
};
