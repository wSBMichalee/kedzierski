// src/components/layout/DesktopNav.tsx
// RSC — statyczna nawigacja desktopowa z dropdown
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

type NavItem = {
  label: string
  type: 'link' | 'dropdown'
  href?: string
  isCTA?: boolean
  submenu?: Array<{ label: string; href: string; description?: string }>
}

type Props = {
  navItems: NavItem[]
  locale: string
}

export function DesktopNav({ navItems, locale }: Props) {
  return (
    <nav
      className="hidden lg:flex items-center gap-1"
      aria-label="Hauptnavigation"
    >
      {navItems.map((item, index) => {
        if (item.type === 'dropdown' && item.submenu && item.submenu.length > 0) {
          return (
            <div key={index} className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-sm font-body font-500 text-foreground hover:text-primary rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                aria-haspopup="true"
              >
                {item.label}
                <ChevronDown
                  className="w-4 h-4 text-muted transition-transform duration-200 group-hover:rotate-180"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
              </button>

              {/* Dropdown panel */}
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50"
                role="region"
              >
                <div className="bg-white rounded-xl border border-border shadow-xl p-2 min-w-[240px]">
                  {item.submenu.map((sub, si) => (
                    <Link
                      key={si}
                      href={sub.href}
                      className="block px-4 py-3 rounded-lg hover:bg-surface-DEFAULT transition-colors duration-150 group/sub focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                    >
                      <span className="block font-body font-500 text-sm text-foreground group-hover/sub:text-primary transition-colors">
                        {sub.label}
                      </span>
                      {sub.description && (
                        <span className="block text-xs text-muted mt-0.5">
                          {sub.description}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        return (
          <Link
            key={index}
            href={item.href || '#'}
            className="px-3 py-2 text-sm font-body font-500 text-foreground hover:text-primary rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
