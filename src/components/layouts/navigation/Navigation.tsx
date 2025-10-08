/**
 * Navigation Component
 *
 * Responsive navigation bar with mobile hamburger menu.
 * Shows different UI based on screen size and authentication status.
 */

'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { NavItem } from './types'
import { MobileNavigation } from './components/mobile/MobileNavigation'
import { DesktopNavigation } from './components/desktop/DesktopNavigation'

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Clients', href: '/clients' },
  { label: 'Products', href: '/products' },
  { label: 'Sales', href: '/sales' },
]

export function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const { data: session } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <>
      <MobileNavigation
        mobileMenuOpen={menuOpen}
        setMobileMenuOpen={setMenuOpen}
        session={session}
        navItems={navItems}
        pathname={pathname}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <DesktopNavigation
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        navItems={navItems}
        pathname={pathname}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        session={session}
      />
    </>
  )
}
