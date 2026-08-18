// src/globals/Company.ts
// Dane firmy/stowarzyszenia — NAP, social, kontakt
// Używane w JSON-LD (Organization), stopce, Impressum
import type { GlobalConfig } from 'payload'

export const Company: GlobalConfig = {
  slug: 'company',
  label: 'Company',
  admin: {
    group: 'Einstellungen',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Vereinsname (vollständig)',
      defaultValue: 'Lohnsteuerhilfeverein [VEREINSNAME] e.V.',
    },
    {
      name: 'kurzname',
      type: 'text',
      label: 'Kurzname / Marke',
      admin: {
        description: 'Für Logo und Kurztitel, z.B. "BBH Lohnsteuerhilfe"',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'logoLight',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (hell, für dunkle Hintergründe)',
    },

    // ── Adresse ──
    {
      name: 'adresse',
      type: 'group',
      label: 'Hauptgeschäftsstelle',
      fields: [
        { name: 'strasse', type: 'text', label: 'Straße + Nr.' },
        { name: 'plz', type: 'text', label: 'PLZ' },
        { name: 'ort', type: 'text', label: 'Ort' },
      ],
    },

    // ── Kontakt ──
    {
      name: 'telefon',
      type: 'text',
      label: 'Telefon',
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-Mail (allgemein)',
    },

    // ── Rechtliche Angaben (Impressum) ──
    {
      name: 'rechtlich',
      type: 'group',
      label: 'Rechtliche Angaben',
      fields: [
        {
          name: 'vereinsregister',
          type: 'text',
          label: 'Vereinsregisternummer',
          admin: { description: 'z.B. VR 12345 AG München' },
        },
        {
          name: 'steuernummer',
          type: 'text',
          label: 'Steuernummer',
        },
        {
          name: 'aufsichtsbehoerde',
          type: 'text',
          label: 'Aufsichtsbehörde',
          admin: { description: 'Steuerberaterkammer zuständig nach StBerG §4 Nr. 11' },
        },
        {
          name: 'verantwortlicher',
          type: 'text',
          label: 'Inhaltlich Verantwortlicher (§ 18 Abs. 2 MStV)',
        },
      ],
    },

    // ── Social Media ──
    {
      name: 'social',
      type: 'group',
      label: 'Social Media',
      fields: [
        { name: 'facebook', type: 'text', label: 'Facebook URL' },
        { name: 'youtube', type: 'text', label: 'YouTube URL' },
        { name: 'instagram', type: 'text', label: 'Instagram URL' },
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
      ],
    },

    // ── Trust-Signale ──
    {
      name: 'trustSignale',
      type: 'array',
      label: 'Trust-Signale (Stopka)',
      admin: {
        description: 'z.B. "Verschlüsselte Verbindung", "Server in Deutschland"',
      },
      fields: [
        { name: 'text', type: 'text', required: true, label: 'Text' },
        { name: 'icon', type: 'text', label: 'Lucide Icon Name', admin: { description: 'z.B. "ShieldCheck", "Server", "Lock"' } },
      ],
    },
  ],
}
