import { Button } from '@/components/ui/button'
import { NavItem } from '../../types'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface DesktopMenuProps {
  navItems: NavItem[]
  pathname: string
  handleLogout: () => void
  isLoggingOut: boolean
}

export const DesktopMenu: React.FC<DesktopMenuProps> = ({
  navItems,
  pathname,
  handleLogout,
  isLoggingOut,
}) => {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-4 py-3 text-sm font-medium rounded-md transition-colors',
              pathname === item.href
                ? 'bg-neutral-100 text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Logout button at the bottom */}
      <div className="pt-4 border-t border-neutral-200">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </div>
  )
}
