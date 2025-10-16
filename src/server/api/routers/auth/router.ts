/**
 * Auth tRPC Router
 *
 * Handles user authentication: login, signup, logout, getSession
 */

import { TRPCError } from "@trpc/server"
import * as bcrypt from "bcryptjs"

import { createTRPCRouter, publicProcedure } from "../../trpc"
import { signupInput, userOutput } from "./schemas/validation"
import { excludePassword } from "./utils"

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(signupInput)
    .output(userOutput)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input

      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        })
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      const user = await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      })

      return excludePassword(user)
    }),
})
