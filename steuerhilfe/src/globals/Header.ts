// src/globals/Header.ts
import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: {
    group: 'Einstellungen',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigationspunkte',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Bezeichnung',
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Direktlink', value: 'link' },
            { label: 'Dropdown-Menü', value: 'dropdown' },
          ],
          defaultValue: 'link',
          required: true,
          label: 'Typ',
        },
        // Direktlink
        {
          name: 'href',
          type: 'text',
          label: 'URL',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'link',
          },
        },
        // Dropdown
        {
          name: 'submenu',
          type: 'array',
          label: 'Untermenü-Einträge',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
          },
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Bezeichnung' },
            { name: 'href', type: 'text', required: true, label: 'URL' },
            { name: 'description', type: 'text', label: 'Kurzbeschreibung (optional)' },
          ],
        },
        // CTA Knopf (z.B. "Berater finden" — hervorgehoben)
        {
          name: 'isCTA',
          type: 'checkbox',
          label: 'Als CTA-Button hervorheben',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Haupt-CTA im Header',
      fields: [
        { name: 'label', type: 'text', label: 'Buttontext', defaultValue: 'Berater finden' },
        { name: 'href', type: 'text', label: 'URL', defaultValue: '/berater-finden' },
      ],
    },
  ],
}
