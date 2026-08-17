'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

// TODO: Platzhalterwerte — durch echte Beträge aus dem BeitragsTabelle-Global ersetzen.
const BEITRAGSSTUFEN = [
  { bis: 10000, beitrag: 56 },
  { bis: 14000, beitrag: 74 },
  { bis: 20000, beitrag: 92 },
  { bis: 25000, beitrag: 110 },
  { bis: 30000, beitrag: 128 },
  { bis: 35000, beitrag: 146 },
  { bis: 40000, beitrag: 164 },
  { bis: 45000, beitrag: 182 },
  { bis: 50000, beitrag: 200 },
  { bis: 55000, beitrag: 218 },
  { bis: 60000, beitrag: 236 },
  { bis: 70000, beitrag: 260 },
  { bis: 80000, beitrag: 284 },
  { bis: 100000, beitrag: 320 },
  { bis: 120000, beitrag: 350 },
  { bis: 150000, beitrag: 375 },
  { bis: Infinity, beitrag: 389 },
]

const AUFNAHMEGEBUEHR = 15

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

const formatIncomeBracket = (bis: number, isLast: boolean, index: number) => {
  if (isLast && index > 0) {
    const prev = BEITRAGSSTUFEN[index - 1].bis
    return `über ${currencyFormatter.format(prev + 1)}`
  }
  return `bis ${currencyFormatter.format(bis)}`
}

export function BeitragsRechner() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const prefersReduced = useReducedMotion()

  const selected = BEITRAGSSTUFEN[selectedIndex]

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-border p-6 md:p-8">
      {/* Formularz */}
      <noscript>
        <div className="mb-4 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm">
          Bitte aktivieren Sie JavaScript für die automatische Berechnung.
        </div>
      </noscript>

      <div className="mb-8">
        <label htmlFor="einkommen" className="block text-h4-desktop font-heading font-semibold text-ink mb-3">
          Ihre Jahreseinnahmen
        </label>
        <div className="relative">
          <select
            id="einkommen"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className="w-full appearance-none bg-white border border-input rounded-lg px-4 py-3 text-body-desktop text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            {BEITRAGSSTUFEN.map((stufe, i) => (
              <option key={i} value={i}>
                {formatIncomeBracket(stufe.bis, i === BEITRAGSSTUFEN.length - 1, i)}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-ink/50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Karta wyniku */}
      <div 
        className="bg-white border border-border rounded-lg p-6 mb-4"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 pb-4 border-b border-border">
          <span className="text-body-desktop font-medium text-ink/80">Ihr Jahresbeitrag</span>
          <motion.span 
            key={`beitrag-${selected.beitrag}`}
            initial={!prefersReduced ? { opacity: 0.5, y: -4 } : false}
            animate={{ opacity: 1, y: 0 }}
            className="text-h2-desktop font-heading font-semibold text-primary"
          >
            {currencyFormatter.format(selected.beitrag)}
          </motion.span>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <span className="text-body-desktop font-medium text-ink/80">Aufnahmegebühr (einmalig)</span>
          <span className="text-h4-desktop font-heading font-semibold text-ink">
            {currencyFormatter.format(AUFNAHMEGEBUEHR)}
          </span>
        </div>
      </div>

      <p className="text-small-desktop text-ink/70 mb-8 text-center sm:text-left">
        Alle Leistungen sind im Mitgliedsbeitrag enthalten. Es entstehen keine Zusatzkosten.
      </p>

      {/* CTA */}
      <div className="flex justify-center sm:justify-start">
        <Link
          href="/mitglied-werden"
          className="inline-flex items-center justify-center h-[48px] px-6 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Jetzt Mitglied werden
        </Link>
      </div>
    </div>
  )
}
