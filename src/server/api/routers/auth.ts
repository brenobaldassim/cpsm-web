/**
 * Auth tRPC Router
 *
 * Handles user authentication: login, signup, logout, getSession
 */

import { TRPCError } from '@trpc/server'
import * as bcrypt from 'bcrypt'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { emailSchema, passwordSchema } from '@/src/lib/validations'

const loginInput = z.object({
  email: emailSchema,
  password: passwordSchema,
})

const signupInput = z.object({
  email: emailSchema,
  password: passwordSchema,
})

const userOutput = z.object({
  id: z.string(),
  email: z.string(),
  createdAt: z.date(),
})

const sessionOutput = z.object({
  user: userOutput,
  expiresAt: z.date(),
})

export const authRouter = createTRPCRouter({
  /**
   * auth.login
   * Authenticate user with email and password
   */
  login: publicProcedure
    .input(loginInput)
    .output(sessionOutput)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input

      // Find user
      const user = await ctx.prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        })
      }

      // TODO: Create session (integrate with NextAuth in T025-T026)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

      return {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
        expiresAt,
      }
    }),

  /**
   * auth.signup
   * Create new user account
   */
  signup: publicProcedure
    .input(signupInput)
    .output(userOutput)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input

      // Check if user already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email already registered',
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      })

      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      }
    }),

  /**
   * auth.logout
   * End current user session
   */
  logout: protectedProcedure
    .output(z.object({ success: z.boolean() }))
    .mutation(async () => {
      // TODO: Destroy session (integrate with NextAuth in T025-T026)
      return { success: true }
    }),

  /**
   * auth.getSession
   * Get current authenticated user session
   */
  getSession: publicProcedure
    .output(sessionOutput.nullable())
    .query(async ({ ctx }) => {
      // TODO: Get session from NextAuth (T025-T026)
      // For now, return null
      return null
    }),
})
