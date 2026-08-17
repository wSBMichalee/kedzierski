// src/blocks/SteuertippsPreview/config.ts
import type { Block } from 'payload'

export const SteuertippsPreviewBlock: Block = {
  slug: 'steuertippsPreview',
  interfaceName: 'SteuertippsPreviewBlock',
  labels: { singular: 'Steuertipps-Vorschau', plural: 'Steuertipps-Vorschauen' },
  fields: [
    {
      name: 'ueberschrift',
      type: 'text',
      label: 'Überschrift',
      defaultValue: 'Aktuelle Steuertipps',
    },
    {
      name: 'anzahl',
      type: 'number',
      label: 'Anzahl der Artikel (max. 6)',
      defaultValue: 3,
      min: 1,
      max: 6,
    },
    {
      name: 'kategorie',
      type: 'select',
      label: 'Nur diese Kategorie anzeigen (optional)',
      options: [
        { label: 'Alle', value: '' },
        { label: 'Arbeitnehmer', value: 'arbeitnehmer' },
        { label: 'Rentner', value: 'rentner' },
        { label: 'Studenten', value: 'studenten' },
        { label: 'Familie', value: 'familie' },
        { label: 'Krypto', value: 'krypto' },
        { label: 'Allgemein', value: 'allgemein' },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'Link-Text "Alle anzeigen"',
      defaultValue: 'Alle Steuertipps anzeigen',
    },
  ],
}
