// src/collections/Pages.ts
import type { CollectionConfig } from 'payload'

// Bloki importowane przez referencję — payload.config je rejestruje
// przez ipal-kit (RenderBlocks). Typ Field wystarczy tutaj.
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
      label: 'Seitentitel',
    },
    // slug + layout + SEO — hinzugefügt durch ipal-kit (buildSlugField, seo tab)
    {
      name: 'layout',
      type: 'blocks',
      label: 'Seiteninhalt',
      blocks: [
        // Registriert in payload.config (ipalKit-Konfiguration oder direkt)
        // Blöcke werden in src/blocks/ definiert
      ],
    },
  ],
}
