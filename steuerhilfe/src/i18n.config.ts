// src/i18n.config.ts
import type { I18nConfig } from '@intecion/ipal-kit'

export const i18nConfig = {
  defaultLocale: 'de',
  locales: [
    { code: 'de', label: 'Deutsch' },
  ],
} as const satisfies I18nConfig
