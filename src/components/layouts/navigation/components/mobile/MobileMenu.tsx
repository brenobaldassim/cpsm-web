import { Session } from 'next-auth'
import Link from 'next/link'
import { NavItem } from '../../types'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  navItems: NavItem[]
  pathname: string
  setMobileMenuOpen: (mobileMenuOpen: boolean) => void
  handleLogout: () => void
  isLoggingOut: boolean
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  navItems,
  pathname,
  setMobileMenuOpen,
  handleLogout,
  isLoggingOut,
}) => {
  return (
    <div className="md:hidden border-t border-neutral-200">
      <div className="space-y-1 px-2 pb-3 pt-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block rounded-md px-3 py-2 text-base font-medium',
              pathname === item.href
                ? 'bg-neutral-100 text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full text-left rounded-md px-3 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}
