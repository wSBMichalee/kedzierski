// src/lib/content.ts
// JEDYNE źródło getCachedPayload w całym projekcie.
// Nie twórz osobnych instancji getCachedPayload w innych plikach.
import { createContentHelpers } from '@intecion/ipal-kit'
import config from '@/payload.config'       // PAYLOAD config (default export) — NIE i18nConfig
import { i18nConfig } from '@/i18n.config'  // i18n idzie do OSOBNEGO pola

const contentConfig = {
  collections: [
    // blog archiwum — musi odpowiadać ipalKit({ content.collections })
    { slug: 'posts' as const },
  ],
}

export const {
  getCachedPayload,
  getSettings,
  getConfiguredLocales,
  resolveRoute,
  getEntries,
  robots,
} = createContentHelpers({
  config,               // payload config (SanitizedConfig) — NIE i18n
  content: contentConfig,
  i18n: i18nConfig,     // i18n osobno (I18nConfig)
})
