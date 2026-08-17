'use client'
// src/components/forms/NewsletterForm.tsx
// FormRenderer klienta — walidacja błędów animowana, sukces z animacją
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Loader2, Mail } from 'lucide-react'

type Props = {
  buttonLabel: string
  datenschutzHinweis?: string | null
  locale: string
  turnstileSiteKey?: string
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function NewsletterFormClient({ buttonLabel, datenschutzHinweis, locale }: Props) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const prefersReduced = useReducedMotion()
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setErrorMsg('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
      return
    }
    setState('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
      if (res.ok) {
        setState('success')
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.error?.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
        setState('error')
      }
    } catch {
      setErrorMsg('Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung.')
      setState('error')
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {state === 'success' ? (
          // Erfolgszustand
          <motion.div
            key="success"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4 py-8"
            role="status"
            aria-live="polite"
          >
            <motion.div
              initial={prefersReduced ? {} : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
            >
              <CheckCircle2 className="w-16 h-16 text-accent" strokeWidth={1.5} aria-hidden="true" />
            </motion.div>
            <p className="font-heading text-primary text-h3-mobile">Vielen Dank!</p>
            <p className="text-muted-foreground text-body-desktop">
              Sie erhalten in Kürze eine Bestätigungsmail.
            </p>
          </motion.div>
        ) : (
          // Formular
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            noValidate
            aria-label="Newsletter-Anmeldung"
          >
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  E-Mail-Adresse
                </label>
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre.email@beispiel.de"
                  required
                  autoComplete="email"
                  disabled={state === 'submitting'}
                  className="w-full pl-10 pr-4 py-3.5 border border-input rounded-lg bg-white text-foreground text-body-desktop placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-colors disabled:opacity-60"
                  aria-describedby={errorMsg ? 'newsletter-error' : undefined}
                />
              </div>
              <button
                type="submit"
                disabled={state === 'submitting'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent-dark text-white font-body font-500 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 whitespace-nowrap"
              >
                {state === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Wird gesendet…</span>
                  </>
                ) : (
                  buttonLabel
                )}
              </button>
            </div>

            {/* Fehlermeldung — animiert */}
            <AnimatePresence>
              {errorMsg && (
                <motion.p
                  id="newsletter-error"
                  role="alert"
                  aria-live="polite"
                  key="error"
                  initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden text-destructive text-small-desktop mt-2"
                >
                  {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>

            {datenschutzHinweis && (
              <p className="text-muted text-small-desktop mt-3 text-center">
                {datenschutzHinweis}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
