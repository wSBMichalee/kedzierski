// src/globals/Footer.ts
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Fußzeile / Footer',
  admin: {
    group: 'Einstellungen',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'spalten',
      type: 'array',
      label: 'Linkspalten',
      maxRows: 4,
      fields: [
        { name: 'titel', type: 'text', required: true, label: 'Spaltenüberschrift' },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Linktext' },
            { name: 'href', type: 'text', required: true, label: 'URL' },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright-Text',
      defaultValue: '© 2024 Lohnsteuerhilfeverein e.V. Alle Rechte vorbehalten.',
    },
    {
      name: 'rechtlicheLinks',
      type: 'array',
      label: 'Rechtliche Links (Impressum, Datenschutz...)',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
