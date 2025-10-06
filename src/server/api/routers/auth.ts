/**
 * Auth tRPC Router
 *
 * Handles user authentication: login, signup, logout, getSession
 */

import { TRPCError } from '@trpc/server'
import * as bcrypt from 'bcrypt'
import { z } from 'zod'
import { signIn, signOut } from '@/server/auth'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { emailSchema, passwordSchema } from '@/lib/validations'

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

      // Find user to verify they exist
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

      // Sign in with NextAuth
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      // Calculate expiration (30 days from now)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

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
    .mutation(async ({ ctx }) => {
      // Sign out with NextAuth
      await signOut({ redirect: false })
      return { success: true }
    }),

  /**
   * auth.getSession
   * Get current authenticated user session
   */
  getSession: publicProcedure
    .output(sessionOutput.nullable())
    .query(async ({ ctx }) => {
      // Session is already loaded in context
      if (!ctx.session?.user) {
        return null
      }

      // Get user details from database
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      })

      if (!user) {
        return null
      }

      // Calculate expiration
      const expiresAt = new Date(
        ctx.session.expires || Date.now() + 30 * 24 * 60 * 60 * 1000
      )

      return {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
        expiresAt,
      }
    }),
})
