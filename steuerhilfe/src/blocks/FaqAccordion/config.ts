// src/blocks/FaqAccordion/config.ts
import type { Block } from 'payload'

export const FaqAccordionBlock: Block = {
  slug: 'faqAccordion',
  interfaceName: 'FaqAccordionBlock',
  labels: { singular: 'FAQ (Accordion)', plural: 'FAQ-Bereiche' },
  fields: [
    {
      name: 'ueberschrift',
      type: 'text',
      label: 'Überschrift',
      defaultValue: 'Häufige Fragen',
    },
    {
      name: 'fragen',
      type: 'array',
      label: 'Fragen & Antworten',
      minRows: 1,
      fields: [
        {
          name: 'frage',
          type: 'text',
          required: true,
          label: 'Frage',
        },
        {
          name: 'antwort',
          type: 'textarea',
          required: true,
          label: 'Antwort',
        },
      ],
      admin: {
        description: 'Wird als JSON-LD FAQPage Schema ausgegeben (SEO)',
      },
    },
  ],
}
