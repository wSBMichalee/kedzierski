// src/collections/LexikonEntries.ts
// Steuerlexikon A-Z — silnik SEO long-tail (setki fraz "was ist X steuerlich")
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const BUCHSTABEN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((b) => ({
  label: b,
  value: b,
}))

export const LexikonEntries: CollectionConfig = {
  slug: 'lexikon-entries',
  admin: {
    useAsTitle: 'term',
    defaultColumns: ['term', 'buchstabe', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'term',
      type: 'text',
      required: true,
      label: 'Fachbegriff',
      admin: {
        description: 'z.B. "Werbungskosten", "Riesterrente", "Kryptowährung"',
      },
    },
    // slug — hinzugefügt durch ipal-kit buildSlugField
    {
      name: 'buchstabe',
      type: 'select',
      options: BUCHSTABEN,
      required: true,
      label: 'Buchstabe (A-Z)',
      admin: {
        description: 'Für die A-Z Übersicht automatisch ausfüllen',
      },
    },
    {
      name: 'kurzDefinition',
      type: 'textarea',
      label: 'Kurzdefinition (max. 160 Zeichen)',
      maxLength: 160,
      admin: {
        description: 'Für Vorschaukarten und Meta-Description',
      },
    },
    {
      name: 'definition',
      type: 'richText',
      editor: lexicalEditor(),
      label: 'Ausführliche Definition',
      required: true,
    },
    {
      name: 'verwandteBegriffe',
      type: 'relationship',
      relationTo: 'lexikon-entries',
      hasMany: true,
      label: 'Verwandte Begriffe',
    },
    {
      name: 'verwandteArtikel',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Verwandte Steuertipps',
    },
  ],
}
