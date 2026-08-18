// src/globals/BeitragsTabelle.ts
// Progi dochodowe → składka dla kalkulatora BeitragsRechner.tsx
// Struktura: tablice progów, każdy z zakresem dochodów i kwotą składki rocznej
import type { GlobalConfig } from 'payload'

export const BeitragsTabelle: GlobalConfig = {
  slug: 'beitrags-tabelle',
  label: 'Membership Fee Table',
  admin: {
    group: 'Einstellungen',
    description: 'Beitragssätze für den Beitragsrechner auf der Webseite.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'einfuehrungstext',
      type: 'textarea',
      label: 'Einleitungstext (über dem Rechner)',
      defaultValue:
        'Der Mitgliedsbeitrag richtet sich nach Ihren positiven Einkünften im Jahr der Beratung.',
    },
    {
      name: 'stufen',
      type: 'array',
      label: 'Beitragsstufen',
      minRows: 1,
      admin: {
        description: 'Sortiert nach Einkommenshöhe (aufsteigend)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Bezeichnung der Stufe',
          admin: { description: 'z.B. "bis 10.000 €" oder "ab 60.001 €"' },
        },
        {
          name: 'einkommenBis',
          type: 'number',
          label: 'Einkommen bis (€) — leer = unbegrenzt',
          admin: {
            description: 'Obergrenze der Stufe. Leer lassen für letzte/offene Stufe.',
            step: 100,
          },
        },
        {
          name: 'beitragJaehrlich',
          type: 'number',
          required: true,
          label: 'Jahresbeitrag (€)',
          admin: { step: 1 },
        },
        {
          name: 'beitragMonatlich',
          type: 'number',
          label: 'Monatsbeitrag (€, optional — für Anzeige)',
          admin: { step: 0.01 },
        },
        {
          name: 'hinweis',
          type: 'text',
          label: 'Hinweis (optional)',
          admin: { description: 'z.B. "inkl. gesetzlicher Mehrwertsteuer"' },
        },
      ],
    },
    {
      name: 'hinweisText',
      type: 'textarea',
      label: 'Allgemeiner Hinweis (unter der Tabelle)',
      defaultValue:
        'Alle Angaben ohne Gewähr. Der endgültige Beitrag wird durch unsere Beratungsstelle festgelegt.',
    },
  ],
}
