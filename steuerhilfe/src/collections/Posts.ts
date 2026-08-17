// src/collections/Posts.ts
// Steuertipps — blog podatkowy (archiwum przez ipal-kit content.collections)
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const KATEGORIE = [
  { label: 'Arbeitnehmer', value: 'arbeitnehmer' },
  { label: 'Rentner', value: 'rentner' },
  { label: 'Studenten', value: 'studenten' },
  { label: 'Familie', value: 'familie' },
  { label: 'Immobilien', value: 'immobilien' },
  { label: 'Kapitalanlagen', value: 'kapitalanlagen' },
  { label: 'Krypto', value: 'krypto' },
  { label: 'Allgemein', value: 'allgemein' },
]

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kategorie', 'standDatum', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    // slug + SEO tab — hinzugefügt durch ipal-kit
    {
      name: 'kategorie',
      type: 'select',
      options: KATEGORIE,
      required: true,
      label: 'Kategorie',
    },
    {
      name: 'standDatum',
      type: 'date',
      label: 'Stand: (Datum der letzten Aktualisierung)',
      admin: {
        description: 'Wird als "Stand: MM.YYYY" angezeigt — wichtig für Steuerinhalte',
        date: {
          pickerAppearance: 'monthOnly',
        },
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Kurzbeschreibung (Meta-Description, Vorschaukarte)',
      maxLength: 160,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Titelbild',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      label: 'Inhalt',
      required: true,
    },
    {
      name: 'verwandteEintraege',
      type: 'relationship',
      relationTo: 'lexikon-entries',
      hasMany: true,
      label: 'Verwandte Lexikon-Einträge',
      admin: {
        description: 'Für interne Verlinkung Blog ↔ Lexikon',
      },
    },
  ],
}
