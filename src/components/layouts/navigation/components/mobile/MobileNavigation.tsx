import { NavItem } from '../../types'
import { Session } from 'next-auth'
import Link from 'next/link'
import { MenuButton } from '../MenuButton'
import { MobileMenu } from './MobileMenu'

interface MobileNavigationProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (mobileMenuOpen: boolean) => void
  session: Session | null
  navItems: NavItem[]
  pathname: string
  handleLogout: () => void
  isLoggingOut: boolean
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  session,
  navItems,
  pathname,
  handleLogout,
  isLoggingOut,
}) => {
  return (
    <nav className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 bg-white">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-neutral-900 hover:text-neutral-700"
          >
            CPM
          </Link>

          {session && (
            <MenuButton
              menuOpen={mobileMenuOpen}
              setMenuOpen={setMobileMenuOpen}
            />
          )}
        </div>

        {mobileMenuOpen && session && (
          <MobileMenu
            navItems={navItems}
            pathname={pathname}
            setMobileMenuOpen={setMobileMenuOpen}
            handleLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />
        )}
      </div>
    </nav>
  )
}
