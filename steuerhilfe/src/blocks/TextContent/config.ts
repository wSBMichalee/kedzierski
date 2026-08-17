// src/blocks/TextContent/config.ts
import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const TextContentBlock: Block = {
  slug: 'textContent',
  interfaceName: 'TextContentBlock',
  labels: { singular: 'Textinhalt', plural: 'Textinhalte' },
  fields: [
    {
      name: 'ueberschrift',
      type: 'text',
      label: 'Überschrift (H2)',
    },
    {
      name: 'inhalt',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
      label: 'Inhalt',
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      options: [
        { label: 'Volle Breite', value: 'full' },
        { label: 'Schmal (für Rechtstexte)', value: 'narrow' },
        { label: '2 Spalten', value: 'twoColumn' },
      ],
      defaultValue: 'full',
    },
    {
      name: 'hintergrund',
      type: 'select',
      label: 'Hintergrund',
      options: [
        { label: 'Weiß', value: 'white' },
        { label: 'Hellgrau', value: 'gray' },
        { label: 'Dunkelblau (Primärfarbe)', value: 'primary' },
      ],
      defaultValue: 'white',
    },
  ],
}
