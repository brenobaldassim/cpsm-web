import type { Metadata } from 'next'
import './globals.css'
import { TRPCProvider } from '@/src/app/_trpc/Provider'

export const metadata: Metadata = {
  title: 'Client & Product Manager',
  description: 'Sales and client management system with inventory tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  )
}
