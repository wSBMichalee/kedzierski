// src/app/(frontend)/[locale]/layout.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Oswald, Inter } from 'next/font/google'
import { getAnalyticsConfig, getConsentTexts } from '@intecion/ipal-kit'
import {
  Analytics,
  ConsentProvider,
  CookieButton,
} from '@intecion/ipal-kit/client'
import { CustomCookieBanner } from '@/components/ui/CustomCookieBanner'
import { i18nConfig } from '@/i18n.config'
import {
  getCachedPayload,
  getConfiguredLocales,
  getSettings,
} from '@/lib/content'
import { getCompany, getHeader, getFooter } from '@/lib/payload'
import { SiteHeader } from '@/components/layout/Header'
import { SiteFooter } from '@/components/layout/Footer'
import { getOrganizationSchema, getWebsiteSchema } from '@/lib/schema-org'
import './globals.css'

// ─── Typografia (next/font — self-hosted, nie CDN) ───────────────────────────
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
})
// ─────────────────────────────────────────────────────────────────────────────

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Walidacja locale — nieznany → 404
  const locales = await getConfiguredLocales()
  if (!locales.includes(locale)) notFound()

  const payload = await getCachedPayload()

  const [settings, header, footer, company] = await Promise.all([
    getSettings(locale),
    getHeader(locale),
    getFooter(locale),
    getCompany(),
  ])

  const privacyPage = (settings as { privacyPolicy?: unknown }).privacyPolicy

  // UWAGA — w getConsentTexts: config = I18nConfig (inaczej niż w createContentHelpers!)
  const [texts, analytics] = await Promise.all([
    getConsentTexts({
      config: i18nConfig,          // tu config to I18nConfig
      locale,
      payload,
      privacyPolicy:
        privacyPage && typeof privacyPage === 'object'
          ? { page: privacyPage, label: 'Datenschutzerklärung' }
          : undefined,
    }),
    getAnalyticsConfig(payload),
  ])

  return (
    <html
      lang={locale}
      className={`${oswald.variable} ${inter.variable}`}
    >
      <body className="font-body bg-background text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema(company)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebsiteSchema(company)) }}
        />
        <ConsentProvider texts={texts}>
          <SiteHeader header={header} settings={settings} locale={locale} company={company} />
          <main>{children}</main>
          <SiteFooter footer={footer} settings={settings} locale={locale} company={company} />

          {/* Kolejność ważna: Provider owija wszystko, Banner+Button+Analytics w środku */}
          <CustomCookieBanner />
          <CookieButton className="fixed bottom-4 left-4 z-40 md:hidden" />
          <Analytics {...analytics} />
        </ConsentProvider>
      </body>
    </html>
  )
}

export async function generateStaticParams() {
  const locales = await getConfiguredLocales()
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | steuerlotse',
    default: 'steuerlotse — Ihre Steuererklärung in guten Händen',
  },
  description:
    'Kompetente Lohnsteuerhilfe für Arbeitnehmer, Rentner und Studenten. Mitglied werden und Steuern zurückholen.',
  openGraph: {
    locale: 'de_DE',
  },
}
