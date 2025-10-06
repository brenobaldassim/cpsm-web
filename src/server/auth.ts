/**
 * NextAuth.js Configuration
 *
 * Handles authentication with credentials provider and database sessions.
 * Integrates with Prisma for user management.
 */

import { PrismaAdapter } from '@auth/prisma-adapter'
import * as bcrypt from 'bcrypt'
import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './db'

/**
 * Module augmentation for NextAuth types
 * Adds our custom properties to the session
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

/**
 * NextAuth configuration options
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  /**
   * Configure providers
   * We use credentials provider for email/password authentication
   */
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          return null
        }

        // Verify password with bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
          return null
        }

        // Return user object (will be stored in JWT/session)
        return {
          id: user.id,
          email: user.email,
        }
      },
    }),
  ],

  /**
   * Configure session strategy
   * Use JWT for stateless sessions (faster, no database lookups on every request)
   */
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  /**
   * Configure pages
   * Redirect to our custom login page
   */
  pages: {
    signIn: '/login',
  },

  /**
   * Callbacks for customizing session and JWT behavior
   */
  callbacks: {
    /**
     * JWT callback - called when JWT is created or updated
     * Add user ID to the token
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },

    /**
     * Session callback - called when session is checked
     * Add user ID to the session object
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },

  /**
   * Enable debug mode in development
   */
  debug: process.env.NODE_ENV === 'development',
})
