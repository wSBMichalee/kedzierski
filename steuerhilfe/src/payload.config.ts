// src/payload.config.ts
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ipalKit, panelSmtpAdapter } from '@intecion/ipal-kit'

import { i18nConfig } from '@/i18n.config'

// Kolekcje
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Posts } from '@/collections/Posts'
import { LexikonEntries } from '@/collections/LexikonEntries'
import { Berater } from '@/collections/Berater'

// Globale
import { Company } from '@/globals/Company'
import { Header } from '@/globals/Header'
import { Footer } from '@/globals/Footer'
import { BeitragsTabelle } from '@/globals/BeitragsTabelle'

// Bloki (konfiguracje dla page buildera)
import { HeroBlock } from '@/blocks/Hero/config'
import { USPGridBlock } from '@/blocks/USPGrid/config'
import { SteuertippsPreviewBlock } from '@/blocks/SteuertippsPreview/config'
import { TextContentBlock } from '@/blocks/TextContent/config'
import { FaqAccordionBlock } from '@/blocks/FaqAccordion/config'
import { TestimonialQuoteBlock } from '@/blocks/TestimonialQuote/config'
import { NewsletterCTABlock } from '@/blocks/NewsletterCTA/config'

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Lohnsteuerhilfe Admin',
    },
    importMap: {
      baseDir: `${process.cwd()}/src`,
    },
  },

  collections: [Pages, Users, Media, Posts, LexikonEntries, Berater],

  globals: [Company, Header, Footer, BeitragsTabelle],

  // Bloki rejestrowane globalnie (dostępne w dowolnej kolekcji z polem blocks)
  // Należy dodać je do kolekcji Pages.layout.blocks
  // (ipal-kit wstrzykuje swoje bloki przez plugin)

  db: sqliteAdapter({
    client: {
      url: 'file:./payload.db',
    },
    push: true,
  }),

  editor: lexicalEditor(),

  // SMTP konfigurowany w panelu (SiteIntegrations)
  email: panelSmtpAdapter(),

  // Lokalizacja treści (zgodna z i18nConfig)
  localization: {
    locales: i18nConfig.locales.map((l) => ({
      code: l.code,
      label: l.label,
    })),
    defaultLocale: i18nConfig.defaultLocale,
    fallback: true,
  },

  plugins: [
    ipalKit({
      i18n: i18nConfig,                       // WYMAGANE
      access: { authCollection: 'users' },         // role admin > editor > user
      pages: { slug: 'pages' },          // System Pages (homepage, privacy, cookies, terms)
      content: {                               // archiwa (blog Steuertipps)
        collections: [
          { slug: 'posts' },
        ],
      },
      seo: {
        collections: ['pages', 'posts', 'lexikon-entries'],
      },
      forms: {},                               // form-builder (kontakt, newsletter)
    }),
  ],

  // Typy generowane do src/payload-types.ts
  typescript: {
    outputFile: `${process.cwd()}/src/payload-types.ts`,
  },

  secret: process.env.PAYLOAD_SECRET || '',

  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
})
