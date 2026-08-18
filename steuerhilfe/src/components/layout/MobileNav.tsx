'use client'
// src/components/layout/MobileNav.tsx
// AnimatePresence — panel wysuwa się z góry, overlay fade
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { buttonVariants } from '@/components/ui/Button'

type NavItem = {
  label: string
  type: 'link' | 'dropdown'
  href?: string
  submenu?: Array<{ label: string; href: string }>
}

type Props = {
  navItems: NavItem[]
  locale: string
  ctaButton?: { label?: string; href?: string }
}

export function MobileNav({ navItems, locale, ctaButton }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null)
  const prefersReduced = useReducedMotion()

  const close = () => {
    setIsOpen(false)
    setOpenSubmenu(null)
  }

  const panelVariants = {
    hidden: { y: prefersReduced ? 0 : '-100%', opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: prefersReduced ? 0 : '-100%', opacity: 0 },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: prefersReduced ? 0 : -16 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.25, ease: 'easeOut' },
    }),
  }

  return (
    <div className="lg:hidden">
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
        aria-controls="mobile-nav-panel"
        className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-DEFAULT transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: prefersReduced ? 0 : -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: prefersReduced ? 0 : 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 text-primary" aria-hidden="true" strokeWidth={1.5} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: prefersReduced ? 0 : 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: prefersReduced ? 0 : -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-5 h-5 text-primary" aria-hidden="true" strokeWidth={1.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-primary-dark z-40"
            onClick={close}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-nav-panel"
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 bg-white z-50 shadow-xl pt-20 pb-8 px-6"
            aria-label="Mobile Navigation"
          >
            {/* Close button in panel */}
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-DEFAULT transition-colors"
              aria-label="Menü schließen"
            >
              <X className="w-5 h-5 text-primary" aria-hidden="true" strokeWidth={1.5} />
            </button>

            <ul className="space-y-1" role="list">
              {navItems.map((item, index) => (
                <motion.li
                  key={index}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {item.type === 'dropdown' && item.submenu ? (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSubmenu(openSubmenu === index ? null : index)
                        }
                        className="w-full flex items-center justify-between px-4 py-3 text-foreground font-body font-medium hover:text-primary hover:bg-surface-DEFAULT rounded-lg transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                        aria-expanded={openSubmenu === index}
                      >
                        {item.label}
                        <motion.span
                          animate={{ rotate: openSubmenu === index ? 180 : 0 }}
                          transition={{ duration: prefersReduced ? 0 : 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 text-muted" aria-hidden="true" strokeWidth={1.5} />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {openSubmenu === index && (
                          <motion.ul
                            initial={prefersReduced ? {} : { height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={prefersReduced ? {} : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4"
                            role="list"
                          >
                            {item.submenu.map((sub, si) => (
                              <li key={si}>
                                <Link
                                  href={sub.href}
                                  onClick={close}
                                  className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset rounded-lg"
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      onClick={close}
                      className="block px-4 py-3 text-foreground font-body font-medium hover:text-primary hover:bg-surface-DEFAULT rounded-lg transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            {ctaButton?.label && (
              <motion.div
                custom={navItems.length}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 pt-6 border-t border-border"
              >
                <Link
                  href={ctaButton.href || `/${locale}/berater-finden`}
                  onClick={close}
                  className={buttonVariants({ variant: 'accent', size: 'lg', className: 'w-full' })}
                >
                  {ctaButton.label}
                </Link>
              </motion.div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
