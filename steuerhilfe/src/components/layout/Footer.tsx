// src/components/layout/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Youtube, Instagram, Linkedin, ShieldCheck, Server, Lock } from 'lucide-react'
import type { JSX } from 'react'

type SocialKey = 'facebook' | 'youtube' | 'instagram' | 'linkedin'

const SOCIAL_ICONS: Record<SocialKey, React.ElementType> = {
  facebook: Facebook,
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
}

const TRUST_ICONS: Record<string, React.ElementType> = {
  ShieldCheck,
  Server,
  Lock,
}

type Props = {
  footer: unknown
  settings: unknown
  locale: string
  company: unknown
}

type FooterData = {
  spalten?: Array<{
    titel: string
    links?: Array<{ label: string; href: string }>
  }>
  copyright?: string
  rechtlicheLinks?: Array<{ label: string; href: string }>
}

type CompanyData = {
  kurzname?: string
  logo?: { url?: string; alt?: string }
  social?: Partial<Record<SocialKey, string>>
  trustSignale?: Array<{ text: string; icon?: string }>
  adresse?: { strasse?: string; plz?: string; ort?: string }
  telefon?: string
  email?: string
}

export function SiteFooter({ footer, settings, locale, company }: Props) {
  const f = (footer as FooterData) ?? {}
  const c = (company as CompanyData) ?? {}
  const spalten = f?.spalten ?? []
  const social = c?.social ?? {}
  const trustSignale = c?.trustSignale ?? []

  const logoUrl = typeof c?.logo === 'object' ? c?.logo?.url : null
  const logoAlt = typeof c?.logo === 'object'
    ? c?.logo?.alt || c?.kurzname || 'Logo'
    : c?.kurzname || 'Lohnsteuerhilfe'

  return (
    <footer className="bg-surface-dark text-white" aria-label="Seitenfußzeile">
      {/* Trust-Signale — Strip */}
      {trustSignale.length > 0 && (
        <div className="border-b border-white/10">
          <div className="container-site py-4">
            <ul
              className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
              role="list"
              aria-label="Sicherheitsmerkmale"
            >
              {trustSignale.map((signal, i) => {
                const Icon = signal.icon ? (TRUST_ICONS[signal.icon] ?? ShieldCheck) : ShieldCheck
                return (
                  <li key={i} className="flex items-center gap-2 text-white/70 text-small-desktop">
                    <Icon className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" strokeWidth={1.5} />
                    {signal.text}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Hauptinhalt */}
      <div className="container-site py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} aria-label={`${logoAlt} — Startseite`} className="inline-block mb-4">
              {logoUrl ? (
                <Image src={logoUrl} alt={logoAlt} width={140} height={36} className="h-9 w-auto brightness-0 invert" />
              ) : (
                <span className="font-heading text-white text-xl">{c.kurzname || 'Lohnsteuerhilfe'}</span>
              )}
            </Link>

            {/* Adresse */}
            {c?.adresse && (
              <address className="not-italic text-white/70 text-small-desktop mb-4 leading-relaxed">
                {c?.adresse?.strasse && <span className="block">{c?.adresse?.strasse}</span>}
                {(c?.adresse?.plz || c?.adresse?.ort) && (
                  <span className="block">{[c?.adresse?.plz, c?.adresse?.ort].filter(Boolean).join(' ')}</span>
                )}
                {c?.telefon && <span className="block mt-2"><a href={`tel:${c?.telefon}`} className="hover:text-white hover:underline hover:underline-offset-4 transition-colors">{c?.telefon}</a></span>}
                {c?.email && <span className="block"><a href={`mailto:${c?.email}`} className="hover:text-white hover:underline hover:underline-offset-4 transition-colors">{c?.email}</a></span>}
              </address>
            )}

            {/* Social Media */}
            {Object.keys(social).length > 0 && (
              <div className="flex gap-3">
                {(Object.entries(social) as [SocialKey, string][]).map(([key, url]) => {
                  if (!url) return null
                  const Icon = SOCIAL_ICONS[key]
                  if (!Icon) return null
                  const LABELS: Record<SocialKey, string> = {
                    facebook: 'Facebook',
                    youtube: 'YouTube',
                    instagram: 'Instagram',
                    linkedin: 'LinkedIn',
                  }
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${LABELS[key]} (öffnet in neuem Tab)`}
                      className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent/30 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <Icon className="w-4 h-4 text-white" aria-hidden="true" strokeWidth={1.5} />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Link columns */}
          <nav aria-label="Fußzeile-Navigation" className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {spalten.map((spalte, i) => (
              <div key={i}>
                <h3 className="font-heading text-white text-h4-mobile mb-4">{spalte.titel}</h3>
                {spalte.links && (
                  <ul className="space-y-2" role="list">
                    {spalte.links.map((link, li) => (
                      <li key={li}>
                        <Link
                          href={link.href}
                          className="text-white/70 hover:text-white hover:underline hover:underline-offset-4 text-small-desktop transition-colors duration-150 focus-visible:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 pb-40">
        <div className="container-site py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/70 text-small-desktop">
            {f.copyright || `© ${new Date().getFullYear()} Lohnsteuerhilfeverein e.V.`}
          </p>
          <nav aria-label="Rechtliches">
            <ul className="flex flex-wrap gap-4" role="list">
              {f.rechtlicheLinks && f.rechtlicheLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white hover:underline hover:underline-offset-4 text-small-desktop transition-colors duration-150 focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/${locale}/barrierefreiheit`}
                  className="text-white/70 hover:text-white hover:underline hover:underline-offset-4 text-small-desktop transition-colors duration-150 focus-visible:underline"
                >
                  Barrierefreiheit
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
