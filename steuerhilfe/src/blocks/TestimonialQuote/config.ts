// src/blocks/TestimonialQuote/config.ts
import type { Block } from 'payload'

export const TestimonialQuoteBlock: Block = {
  slug: 'testimonialQuote',
  interfaceName: 'TestimonialQuoteBlock',
  labels: { singular: 'Testimonial / Zitat', plural: 'Testimonials' },
  fields: [
    {
      name: 'zitat',
      type: 'textarea',
      required: true,
      label: 'Zitat',
    },
    {
      name: 'autor',
      type: 'text',
      required: true,
      label: 'Autor (Name, Berufsbezeichnung)',
    },
    {
      name: 'autorFoto',
      type: 'upload',
      relationTo: 'media',
      label: 'Autorfoto',
    },
    {
      name: 'bewertung',
      type: 'number',
      label: 'Bewertung (1-5 Sterne)',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
  ],
}
