// src/blocks/USPGrid/config.ts
import type { Block } from 'payload'

export const USPGridBlock: Block = {
  slug: 'uspGrid',
  interfaceName: 'USPGridBlock',
  labels: { singular: 'USP-Raster', plural: 'USP-Raster' },
  fields: [
    {
      name: 'ueberschrift',
      type: 'text',
      label: 'Überschrift (H2)',
    },
    {
      name: 'karten',
      type: 'array',
      label: 'USP-Karten',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'icon', type: 'text', required: true, label: 'Lucide Icon Name', admin: { description: 'z.B. "ShieldCheck", "Euro", "Clock"' } },
        { name: 'titel', type: 'text', required: true, label: 'Titel' },
        { name: 'beschreibung', type: 'textarea', required: true, label: 'Beschreibung' },
      ],
    },
  ],
}
