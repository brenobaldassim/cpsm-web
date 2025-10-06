/**
 * Root Layout
 *
 * Application-wide layout with providers, fonts, and metadata.
 * Wraps all pages with tRPC and React Query providers.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { TRPCProvider } from '@/app/_trpc/Provider'

// Font optimization
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Client & Product Manager',
    template: '%s | Client & Product Manager',
  },
  description:
    'Sales and client management system with real-time inventory tracking',
  keywords: ['sales', 'client management', 'inventory', 'products', 'CRM'],
  authors: [{ name: 'Your Company' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Client & Product Manager',
    description:
      'Sales and client management system with real-time inventory tracking',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-50 font-sans antialiased">
        <TRPCProvider>
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
        </TRPCProvider>
      </body>
    </html>
  )
}
