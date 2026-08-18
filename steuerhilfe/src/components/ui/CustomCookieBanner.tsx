'use client'

import { useEffect, useRef, useState } from 'react'
import { Cookie } from 'lucide-react'
import Link from 'next/link'
import { useConsentContext } from '@intecion/ipal-kit/client'

// Categories standard in ipal-kit
const CONSENT_CATEGORIES = ['necessary', 'functional', 'analytics', 'marketing'] as const
type ConsentCategory = typeof CONSENT_CATEGORIES[number]

export function CustomCookieBanner() {
  const { acceptAll, decided, rejectAll, savePreferences, state, texts } = useConsentContext()
  const [showSettings, setShowSettings] = useState(false)
  const [choices, setChoices] = useState<Record<string, boolean>>(state)

  const bannerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setChoices(state)
  }, [state])

  // Save previous focus when opening, trap focus inside (basic implementation), and restore on close
  useEffect(() => {
    if (!decided) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // Optional: slight delay to ensure render
      setTimeout(() => {
        bannerRef.current?.focus()
      }, 50)
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [decided])

  // Escape key handler
  useEffect(() => {
    if (decided) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        rejectAll()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [decided, rejectAll])

  if (decided) return null

  const toggle = (cat: string) => {
    if (cat === 'necessary') return
    setChoices((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  // Extract categories from texts or fallback to default
  const categories = Object.keys(texts?.categories || {})

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/40 pointer-events-auto"
      aria-label="Cookie consent overlay"
      // Nie blokujemy scrolla pod spodem (brak pointer-events:none na body, a sam overlay pozwala na scroll z powodu braku overflow:hidden na body, 
      // jednak w wielu przeglądarkach fixed overlay przechwytuje zdarzenia kółka, więc dajemy pointer-events-auto żeby blokował interakcje pod spodem).
    >
      <div 
        ref={bannerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="fixed bottom-0 left-0 w-full md:bottom-6 md:left-6 md:w-[480px] bg-white rounded-t-[16px] md:rounded-[16px] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col outline-none pb-[calc(env(safe-area-inset-bottom,0)+1.75rem)] md:pb-8"
      >
        {!showSettings ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-7 h-7 text-primary shrink-0" strokeWidth={1.5} />
              <h2 className="font-heading font-semibold text-[19px] text-foreground m-0 leading-tight">
                Diese Website verwendet Cookies
              </h2>
            </div>
            
            <p className="text-[13.5px] leading-[1.6] text-foreground/70 mb-6">
              Wir verwenden Cookies, um die Website zu betreiben, den Verkehr zu analysieren und Ihre Erfahrung zu verbessern. Weitere Informationen finden Sie in unserer <Link href="/datenschutz" className="text-primary underline hover:no-underline">Datenschutzerklärung</Link>.
            </p>

            <div className="flex flex-col md:flex-row gap-2 md:gap-2 w-full">
              <button 
                onClick={() => setShowSettings(true)}
                className="w-full md:flex-1 py-[11px] px-5 rounded-lg border border-foreground/20 text-foreground text-[13.5px] font-medium hover:bg-surface transition-colors"
              >
                Einstellungen
              </button>
              <button 
                onClick={rejectAll}
                className="w-full md:flex-1 py-[11px] px-5 rounded-lg border border-foreground/20 text-foreground text-[13.5px] font-medium hover:bg-surface transition-colors"
              >
                Ablehnen
              </button>
              <button 
                onClick={acceptAll}
                className="w-full md:flex-1 py-[11px] px-5 rounded-lg bg-primary text-white text-[13.5px] font-medium hover:bg-primary-dark transition-colors"
              >
                Alle akzeptieren
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-6 h-6 text-primary shrink-0" strokeWidth={1.5} />
              <h2 className="font-heading font-semibold text-[19px] text-foreground m-0 leading-tight">
                {texts?.settingsTitle || 'Cookie-Einstellungen'}
              </h2>
            </div>
            
            <ul className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {categories.map((cat) => {
                const isNecessary = cat === 'necessary'
                return (
                  <li key={cat} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {texts?.categories?.[cat as ConsentCategory]?.title || cat}
                      </p>
                      <p className="text-xs text-foreground/70 mt-1">
                        {texts?.categories?.[cat as ConsentCategory]?.description || ''}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isNecessary ? true : choices[cat]}
                        disabled={isNecessary}
                        onChange={() => toggle(cat)}
                      />
                      <div className="w-9 h-5 bg-foreground/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-disabled:opacity-50"></div>
                    </label>
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-col md:flex-row justify-end gap-2 w-full">
              <button 
                onClick={() => setShowSettings(false)}
                className="w-full md:w-auto py-[11px] px-5 rounded-lg border border-foreground/20 text-foreground text-[13.5px] font-medium hover:bg-surface transition-colors"
              >
                {texts?.buttons?.back || 'Zurück'}
              </button>
              <button 
                onClick={() => savePreferences(choices)}
                className="w-full md:w-auto py-[11px] px-5 rounded-lg bg-primary text-white text-[13.5px] font-medium hover:bg-primary-dark transition-colors"
              >
                {texts?.buttons?.save || 'Speichern'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
