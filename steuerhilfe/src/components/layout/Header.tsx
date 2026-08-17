// src/components/layout/Header.tsx
// RSC — dane z globalnych CMS (header, settings, company)
import Link from 'next/link'
import Image from 'next/image'
import { MobileNav } from './MobileNav'
import { DesktopNav } from './DesktopNav'

type Props = {
  header: unknown
  settings: unknown
  locale: string
  company: unknown
}

type NavItem = {
  label: string
  type: 'link' | 'dropdown'
  href?: string
  isCTA?: boolean
  submenu?: Array<{ label: string; href: string; description?: string }>
}

type HeaderData = {
  navItems?: NavItem[]
  ctaButton?: { label?: string; href?: string }
}

type CompanyData = {
  kurzname?: string
  logo?: { url?: string; alt?: string }
}

export function SiteHeader({ header, settings, locale, company }: Props) {
  const h = (header as HeaderData) ?? {}
  const c = (company as CompanyData) ?? {}
  const navItems = h?.navItems ?? []
  const ctaButton = h?.ctaButton

  const logoUrl = typeof c?.logo === 'object' ? c?.logo?.url : null
  const logoAlt = typeof c?.logo === 'object'
    ? c?.logo?.alt || c?.kurzname || 'Logo'
    : c?.kurzname || 'Lohnsteuerhilfe'

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container-site">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 flex-shrink-0"
            aria-label={`${logoAlt} — Startseite`}
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            ) : (
              <span className="font-heading text-primary text-xl lg:text-2xl tracking-tight">
                {c.kurzname || 'Lohnsteuerhilfe'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav navItems={navItems} locale={locale} />

          {/* Desktop CTA */}
          {ctaButton?.label && (
            <div className="hidden lg:block flex-shrink-0">
              <Link
                href={ctaButton.href || `/${locale}/berater-finden`}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-accent hover:bg-accent-dark text-white font-body font-500 text-sm rounded-lg transition-all duration-200 ease-out hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {ctaButton.label}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <MobileNav
            navItems={navItems}
            locale={locale}
            ctaButton={ctaButton}
          />
        </div>
      </div>
    </header>
  )
}
