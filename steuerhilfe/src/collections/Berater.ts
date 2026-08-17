// src/collections/Berater.ts
// Beratungsstellen — lokalny wyszukiwacz doradców (NAP + geolokalizacja)
// Model "hub & spoke": /berater-finden → /berater-finden/[slug]
// Każda placówka = strona z schema.org LocalBusiness (lokalne SEO)
import type { CollectionConfig } from 'payload'

const SPEZIALISIERUNGEN = [
  { label: 'Arbeitnehmer', value: 'arbeitnehmer' },
  { label: 'Rentner & Pensionäre', value: 'rentner' },
  { label: 'Studenten', value: 'studenten' },
  { label: 'Beamte', value: 'beamte' },
  { label: 'Selbstständige (eingeschränkt)', value: 'selbststaendige' },
  { label: 'Grenzpendler', value: 'grenzpendler' },
  { label: 'Kapitalanleger', value: 'kapitalanleger' },
  { label: 'Vermieter', value: 'vermieter' },
]

export const Berater: CollectionConfig = {
  slug: 'berater',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'plz', 'ort', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    // ── Persönliche Daten ──
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name des Beraters / der Beratungsstelle',
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
    },

    // ── Adresse (NAP — Name/Address/Phone für lokales SEO) ──
    {
      name: 'adresse',
      type: 'group',
      label: 'Adresse',
      fields: [
        { name: 'strasse', type: 'text', required: true, label: 'Straße + Hausnummer' },
        { name: 'plz', type: 'text', required: true, label: 'PLZ', maxLength: 5 },
        { name: 'ort', type: 'text', required: true, label: 'Ort' },
        { name: 'bundesland', type: 'text', label: 'Bundesland' },
      ],
    },

    // ── Shortcut-Felder für Suche/Filter (denormalisiert) ──
    {
      name: 'plz',
      type: 'text',
      label: 'PLZ (für Suche)',
      maxLength: 5,
      admin: {
        description: 'Kopie der PLZ für schnelle Suche/Filterung nach Postleitzahl',
      },
    },
    {
      name: 'ort',
      type: 'text',
      label: 'Ort (für Suche)',
    },

    // ── Geolokalizacja ──
    {
      name: 'koordinaten',
      type: 'group',
      label: 'Koordinaten (für Mapbox)',
      fields: [
        {
          name: 'lat',
          type: 'number',
          label: 'Breitengrad (Latitude)',
          admin: { step: 0.000001 },
        },
        {
          name: 'lng',
          type: 'number',
          label: 'Längengrad (Longitude)',
          admin: { step: 0.000001 },
        },
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
      label: 'E-Mail',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website (optional)',
    },

    // ── Öffnungszeiten ──
    {
      name: 'oeffnungszeiten',
      type: 'textarea',
      label: 'Öffnungszeiten',
      admin: {
        description: 'z.B. "Mo-Fr 9:00-18:00, Sa nach Vereinbarung"',
      },
    },

    // ── Spezialisierungen ──
    {
      name: 'spezialisierungen',
      type: 'select',
      options: SPEZIALISIERUNGEN,
      hasMany: true,
      label: 'Spezialisierungen',
    },

    // ── Freitext für die Detailseite ──
    {
      name: 'beschreibung',
      type: 'textarea',
      label: 'Kurzbeschreibung der Beratungsstelle',
      maxLength: 300,
    },

    // ── slug ── (durch ipal-kit oder manuell)
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'URL-Slug',
      admin: {
        description: 'Automatisch: nachname-ort, z.B. "mueller-muenchen"',
      },
    },

    // ── Sichtbarkeit ──
    {
      name: 'aktiv',
      type: 'checkbox',
      label: 'Aktiv (in Suche anzeigen)',
      defaultValue: true,
    },
  ],
}
