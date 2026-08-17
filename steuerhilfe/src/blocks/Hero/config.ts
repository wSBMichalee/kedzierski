// src/blocks/Hero/config.ts
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero-Bereich', plural: 'Hero-Bereiche' },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      label: 'Hauptüberschrift (H1)',
    },
    {
      name: 'subheadline',
      type: 'text',
      label: 'Unterüberschrift',
    },
    {
      name: 'beschreibung',
      type: 'textarea',
      label: 'Beschreibungstext',
    },
    {
      name: 'primaryCta',
      type: 'group',
      label: 'Primärer Button',
      fields: [
        { name: 'label', type: 'text', label: 'Buttontext', defaultValue: 'Berater finden' },
        { name: 'href', type: 'text', label: 'URL', defaultValue: '/berater-finden' },
      ],
    },
    {
      name: 'secondaryCta',
      type: 'group',
      label: 'Sekundärer Button (optional)',
      fields: [
        { name: 'label', type: 'text', label: 'Buttontext' },
        { name: 'href', type: 'text', label: 'URL' },
      ],
    },
    {
      name: 'hintergrundBild',
      type: 'upload',
      relationTo: 'media',
      label: 'Hintergrundbild',
    },
    {
      name: 'vertrauensBadges',
      type: 'array',
      label: 'Vertrauensbadges (unter CTA)',
      fields: [
        { name: 'text', type: 'text', required: true, label: 'Text' },
        { name: 'icon', type: 'text', label: 'Lucide Icon Name' },
      ],
    },
  ],
}
