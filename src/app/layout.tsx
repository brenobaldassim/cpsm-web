/**
 * Root Layout
 *
 * Application-wide layout with providers, fonts, and metadata.
 * Wraps all pages with tRPC and React Query providers.
 */

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { TRPCProvider } from "@/app/_trpc/Provider"
import { SessionProvider } from "next-auth/react"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layouts/navigation"
import { cn } from "@/lib/utils"

// Font optimization
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Client & Product Manager",
    template: "%s | Client & Product Manager",
  },
  description:
    "Sales and client management system with real-time inventory tracking",
  keywords: ["sales", "client management", "inventory", "products", "CRM"],
  authors: [{ name: "Your Company" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Client & Product Manager",
    description:
      "Sales and client management system with real-time inventory tracking",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, "dark")}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider>
          <TRPCProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
                  <SidebarTrigger />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 justify-start items-center">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
