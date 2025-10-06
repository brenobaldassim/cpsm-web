import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
