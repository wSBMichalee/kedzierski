// src/blocks/NewsletterCTA/config.ts
import type { Block } from 'payload'

export const NewsletterCTABlock: Block = {
  slug: 'newsletterCTA',
  interfaceName: 'NewsletterCTABlock',
  labels: { singular: 'Newsletter CTA', plural: 'Newsletter CTAs' },
  fields: [
    {
      name: 'ueberschrift',
      type: 'text',
      label: 'Überschrift',
      defaultValue: 'Steuer-Neuigkeiten direkt in Ihr Postfach',
    },
    {
      name: 'beschreibung',
      type: 'textarea',
      label: 'Beschreibung',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Button-Text',
      defaultValue: 'Jetzt anmelden',
    },
    {
      name: 'datenschutzHinweis',
      type: 'text',
      label: 'Datenschutzhinweis (unter dem Formular)',
      defaultValue: 'Kein Spam. Abmeldung jederzeit möglich.',
    },
  ],
}
