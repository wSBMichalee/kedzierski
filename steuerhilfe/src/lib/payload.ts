// src/lib/payload.ts
// Funkcje specyficzne dla projektu — importują getCachedPayload z ./content
// NIE twórz tutaj własnego getCachedPayload.
import { cache } from 'react'
import { getSiteIntegrations, getSiteSettings } from '@intecion/ipal-kit'
import type { SiteSetting } from '@/payload-types'
import { getCachedPayload } from './content'

// ─────────────────────────────────────────────
// Site Settings (typowane przez SiteSetting z payload-types)
// getSiteSettings<T> — generyk przy WYWOŁANIU, nie w pluginie
// ─────────────────────────────────────────────
export const getSettings = cache(async (locale: string) =>
  getSiteSettings<SiteSetting>(await getCachedPayload(), {
    locale: locale as never,  // locale as never — agnostyczne, nie hardkoduj 'de'
    depth: 2,
  }),
)

// ─────────────────────────────────────────────
// Globale projektu
// ─────────────────────────────────────────────
export const getCompany = cache(async () =>
  (await getCachedPayload()).findGlobal({ slug: 'company', depth: 2 }),
)

export const getHeader = cache(async (locale: string) =>
  (await getCachedPayload()).findGlobal({
    slug: 'header',
    locale: locale as never,
    depth: 2,
  }),
)

export const getFooter = cache(async (locale: string) =>
  (await getCachedPayload()).findGlobal({
    slug: 'footer',
    locale: locale as never,
    depth: 2,
  }),
)

export const getBeitragsTabelle = cache(async () =>
  (await getCachedPayload()).findGlobal({ slug: 'beitrags-tabelle', depth: 1 }),
)

// ─────────────────────────────────────────────
// Turnstile site key (przez SiteIntegrations — ipal-kit)
// getSiteIntegrations<T> — generyk przy wywołaniu
// ─────────────────────────────────────────────
export const getTurnstileSiteKey = cache(async (): Promise<string | undefined> => {
  const payload = await getCachedPayload()
  const { turnstileSiteKey } = await getSiteIntegrations<{ turnstileSiteKey?: string }>(payload)
  return turnstileSiteKey
})

// ─────────────────────────────────────────────
// Steuertipps (Posts) — listing z paginacją
// ─────────────────────────────────────────────
export const getPosts = cache(async ({
  locale,
  page = 1,
  limit = 9,
  kategorie,
}: {
  locale: string
  page?: number
  limit?: number
  kategorie?: string
}) => {
  const payload = await getCachedPayload()
  return payload.find({
    collection: 'posts',
    locale: locale as never,
    page,
    limit,
    where: kategorie ? { kategorie: { equals: kategorie } } : undefined,
    sort: '-createdAt',
    depth: 1,
  })
})

// ─────────────────────────────────────────────
// Leksykon — listing A-Z
// ─────────────────────────────────────────────
export const getLexikonEntries = cache(async (locale: string) => {
  const payload = await getCachedPayload()
  return payload.find({
    collection: 'lexikon-entries',
    locale: locale as never,
    limit: 1000,
    sort: 'term',
    depth: 0,
  })
})

export const getLexikonEntry = cache(async (slug: string, locale: string) => {
  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'lexikon-entries',
    where: { slug: { equals: slug } },
    locale: locale as never,
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
})

// ─────────────────────────────────────────────
// Berater — wyszukiwarka po PLZ
// ─────────────────────────────────────────────
export const getBeraterByPlz = cache(async (plz: string) => {
  const payload = await getCachedPayload()
  return payload.find({
    collection: 'berater',
    where: {
      and: [
        { plz: { like: plz } },
        { aktiv: { equals: true } },
      ],
    },
    depth: 1,
    limit: 50,
  })
})

export const getAllAktivenBerater = cache(async () => {
  const payload = await getCachedPayload()
  return payload.find({
    collection: 'berater',
    where: { aktiv: { equals: true } },
    depth: 1,
    limit: 500,
  })
})

export const getBeraterBySlug = cache(async (slug: string) => {
  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'berater',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
})
