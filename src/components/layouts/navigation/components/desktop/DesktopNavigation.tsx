import { NavItem } from '../../types'
import Link from 'next/link'
import { DesktopMenu } from './DesktopMenu'
import { Session } from 'next-auth'

interface DesktopNavigationProps {
  navItems: NavItem[]
  pathname: string
  handleLogout: () => void
  isLoggingOut: boolean
  session: Session | null
  menuOpen: boolean
  setMenuOpen: (menuOpen: boolean) => void
}
export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navItems,
  pathname,
  handleLogout,
  isLoggingOut,
  session,
}) => {
  return (
    <nav className="hidden md:block fixed left-0 top-0 h-screen w-64 border-r border-neutral-200 bg-white overflow-hidden">
      <div className="flex flex-col h-full px-4 py-6">
        <div className="flex items-center mb-8">
          <Link
            href="/"
            className="text-xl font-bold text-neutral-900 hover:text-neutral-700"
          >
            CPM
          </Link>
        </div>

        {session && (
          <DesktopMenu
            navItems={navItems}
            pathname={pathname}
            handleLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />
        )}
      </div>
    </nav>
  )
}
