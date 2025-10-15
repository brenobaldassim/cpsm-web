/**
 * Auth tRPC Router
 *
 * Handles user authentication: login, signup, logout, getSession
 */

import { TRPCError } from "@trpc/server"
import * as bcrypt from "bcryptjs"

import { createTRPCRouter, publicProcedure } from "../../trpc"
import { signupInput, userOutput } from "./schemas/validation"

export const authRouter = createTRPCRouter({
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
          code: "CONFLICT",
          message: "Email already registered",
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
})
