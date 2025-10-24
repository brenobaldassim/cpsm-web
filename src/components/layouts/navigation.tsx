"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  LogOut,
  CircleUserRound,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Routes } from "@/app/routes"

const navItems = [
  {
    label: "Dashboard",
    href: Routes.HOME,
    icon: Home,
  },
  {
    label: "Clients",
    href: Routes.CLIENTS,
    icon: Users,
  },
  {
    label: "Products",
    href: Routes.PRODUCTS,
    icon: Package,
  },
  {
    label: "Sales",
    href: Routes.SALES,
    icon: ShoppingCart,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { status, data: session } = useSession()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: Routes.LOGIN })
  }

  if (status === "unauthenticated") {
    return null
  }

  if (pathname === Routes.LOGIN || pathname === Routes.SIGN_UP) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex flex-col items-center justify-center px-4 py-6 gap-4 bg-sidebar-accent/50 rounded-lg">
          <CircleUserRound className="size-9" />
          <p className="text-sm font-medium text-sidebar-foreground">
            {session?.user?.email}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      size="lg"
                    >
                      <Link href={item.href} className="text-xl">
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-2">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-center border-2 border-sidebar-border"
          >
            <LogOut className="mr-2 size-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
