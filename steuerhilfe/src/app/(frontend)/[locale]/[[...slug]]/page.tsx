// src/app/(frontend)/[locale]/[[...slug]]/page.tsx
// Główny routing treści — obsługuje wszystkie strony CMS przez resolveRoute
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RenderBlocks } from '@intecion/ipal-kit/rsc'
import { createPageMetadata } from '@intecion/ipal-kit'
import { i18nConfig } from '@/i18n.config'
import { blockRegistry } from '@/blocks/registry'
import { getCachedPayload, resolveRoute } from '@/lib/content'
import { getTurnstileSiteKey } from '@/lib/payload'

// createPageMetadata — wymaga NEXT_PUBLIC_SERVER_URL dla canonicali
const pageMetadata = createPageMetadata({
  config: i18nConfig,
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  return pageMetadata({ payload: await getCachedPayload(), locale, slug })
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug?: string[] }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale, slug } = await params
  const { page } = await searchParams
  const pageNum = page ? parseInt(page, 10) : 1

  // resolveRoute przyjmuje TRZY argumenty: (locale, segments: string[], page: number)
  // segments to tablica — NIE string złączony przez join
  const route = await resolveRoute(locale, slug ?? [], pageNum)
  if (!route) notFound()

  // Turnstile pobrany RAZ w page.tsx — NIE importuj getTurnstileSiteKey w blokach
  // (tworzyłoby cykl: blok → lib/payload → lib/content → payload.config → blok)
  const turnstileSiteKey = await getTurnstileSiteKey()

  return (
    <RenderBlocks
      blocks={route.doc.layout as never}
      components={blockRegistry}
      enhanceProps={({ block }) => {
        // Dane W DÓŁ przez enhanceProps — nie przez import w blokach
        if (block.blockType === 'contact' || block.blockType === 'newsletterCTA') {
          return { locale, turnstileSiteKey }
        }
        return { locale }
      }}
    />
  )
}
