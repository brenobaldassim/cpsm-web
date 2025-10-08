interface MenuButtonProps {
  menuOpen: boolean
  setMenuOpen: (menuOpen: boolean) => void
}
export const MenuButton: React.FC<MenuButtonProps> = ({
  menuOpen,
  setMenuOpen,
}) => {
  return (
    <div className="">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-500"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-label="Toggle menu"
      >
        <span className="sr-only">Open main menu</span>
        {/* Hamburger icon */}
        {menuOpen ? (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
