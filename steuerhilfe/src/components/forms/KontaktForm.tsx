'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

type ValidationErrors = {
  name?: string
  email?: string
  nachricht?: string
  datenschutz?: string
}

export function KontaktForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Formularz data
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [telefon, setTelefon] = useState('')
  const [betreff, setBetreff] = useState('Allgemeine Frage')
  const [nachricht, setNachricht] = useState('')
  const [website, setWebsite] = useState('') // Honeypot
  const [datenschutz, setDatenschutz] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const validateField = (field: string, value: string | boolean) => {
    let error = undefined
    if (field === 'name') {
      if (!value) error = 'Bitte geben Sie Ihren Namen ein.'
    } else if (field === 'email') {
      if (!value) error = 'Bitte geben Sie Ihre E-Mail-Adresse ein.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string))
        error = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
    } else if (field === 'nachricht') {
      if (!value) error = 'Bitte geben Sie eine Nachricht ein.'
      else if ((value as string).length < 10)
        error = 'Die Nachricht muss mindestens 10 Zeichen lang sein.'
    } else if (field === 'datenschutz') {
      if (!value) error = 'Sie müssen der Datenschutzerklärung zustimmen.'
    }
    return error
  }

  const handleBlur = (field: string, value: string | boolean) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, value)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const validateAll = () => {
    const newErrors: ValidationErrors = {
      name: validateField('name', name),
      email: validateField('email', email),
      nachricht: validateField('nachricht', nachricht),
      datenschutz: validateField('datenschutz', datenschutz),
    }

    setErrors(newErrors)

    return !Object.values(newErrors).some((err) => err !== undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      nachricht: true,
      datenschutz: true,
    })

    if (!validateAll()) {
      return
    }

    // Honeypot check: jeśli bot wypełnił ukryte pole, udajemy sukces
    if (website !== '') {
      setStatus('success')
      return
    }

    setStatus('loading')

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          telefon,
          betreff,
          nachricht,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Fehler beim Senden')
      }

      setStatus('success')
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div 
        role="status" 
        className="p-8 bg-white border border-border rounded-xl text-center shadow-sm"
      >
        <p className="text-h4-desktop font-heading font-semibold text-primary mb-2">
          Vielen Dank für Ihre Nachricht.
        </p>
        <p className="text-body-desktop text-ink/80">
          Wir melden uns innerhalb von 2 Werktagen bei Ihnen.
        </p>
      </div>
    )
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm max-w-3xl mx-auto"
      noValidate // Wyłączamy natywną walidację, używamy własnej na blur
    >
      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-small-desktop font-medium text-ink mb-1.5">
            Name <span className="text-[#B91C1C]">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (touched.name) handleBlur('name', e.target.value)
            }}
            onBlur={(e) => handleBlur('name', e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className="w-full px-4 py-2.5 bg-white border border-input rounded-lg text-body-desktop text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-sm text-[#B91C1C]" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* E-Mail */}
        <div>
          <label htmlFor="email" className="block text-small-desktop font-medium text-ink mb-1.5">
            E-Mail <span className="text-[#B91C1C]">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (touched.email) handleBlur('email', e.target.value)
            }}
            onBlur={(e) => handleBlur('email', e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="w-full px-4 py-2.5 bg-white border border-input rounded-lg text-body-desktop text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-[#B91C1C]" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="telefon" className="block text-small-desktop font-medium text-ink mb-1.5">
            Telefon <span className="text-ink/60 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            id="telefon"
            name="telefon"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-input rounded-lg text-body-desktop text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </div>

        {/* Betreff */}
        <div>
          <label htmlFor="betreff" className="block text-small-desktop font-medium text-ink mb-1.5">
            Betreff
          </label>
          <div className="relative">
            <select
              id="betreff"
              name="betreff"
              value={betreff}
              onChange={(e) => setBetreff(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 bg-white border border-input rounded-lg text-body-desktop text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            >
              <option value="Allgemeine Frage">Allgemeine Frage</option>
              <option value="Mitgliedschaft">Mitgliedschaft</option>
              <option value="Beratungstermin">Beratungstermin</option>
              <option value="Sonstiges">Sonstiges</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-ink/50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Nachricht */}
      <div className="mb-6">
        <label htmlFor="nachricht" className="block text-small-desktop font-medium text-ink mb-1.5">
          Nachricht <span className="text-[#B91C1C]">*</span>
        </label>
        <textarea
          id="nachricht"
          name="nachricht"
          required
          rows={5}
          value={nachricht}
          onChange={(e) => {
            setNachricht(e.target.value)
            if (touched.nachricht) handleBlur('nachricht', e.target.value)
          }}
          onBlur={(e) => handleBlur('nachricht', e.target.value)}
          aria-invalid={!!errors.nachricht}
          aria-describedby={errors.nachricht ? 'nachricht-error' : undefined}
          className="w-full px-4 py-3 bg-white border border-input rounded-lg text-body-desktop text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary resize-y"
        />
        {errors.nachricht && (
          <p id="nachricht-error" className="mt-1.5 text-sm text-[#B91C1C]" role="alert">
            {errors.nachricht}
          </p>
        )}
      </div>

      {/* RODO */}
      <div className="mb-8">
        <div className="flex items-start gap-3">
          <div className="flex items-center h-6">
            <input
              type="checkbox"
              id="datenschutz-einwilligung"
              name="datenschutz"
              required
              checked={datenschutz}
              onChange={(e) => {
                setDatenschutz(e.target.checked)
                if (touched.datenschutz) handleBlur('datenschutz', e.target.checked)
              }}
              onBlur={(e) => handleBlur('datenschutz', e.target.checked)}
              aria-invalid={!!errors.datenschutz}
              aria-describedby={errors.datenschutz ? 'datenschutz-error' : undefined}
              className="w-5 h-5 border-input rounded text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
          </div>
          <label htmlFor="datenschutz-einwilligung" className="text-small-desktop text-ink/80 leading-relaxed">
            Ich habe die{' '}
            <Link 
              href="/datenschutz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded-sm"
            >
              Datenschutzerklärung
            </Link>{' '}
            gelesen und bin mit der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage einverstanden. <span className="text-[#B91C1C]">*</span>
          </label>
        </div>
        {errors.datenschutz && (
          <p id="datenschutz-error" className="mt-1.5 text-sm text-[#B91C1C]" role="alert">
            {errors.datenschutz}
          </p>
        )}
      </div>

      {/* Komunikat o błędzie serwera */}
      {status === 'error' && (
        <div 
          className="mb-6 p-4 bg-red-50 border border-red-200 text-[#B91C1C] rounded-lg text-sm" 
          aria-live="assertive" 
          role="alert"
        >
          Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@steuerlotse.de.
        </div>
      )}

      {/* Komunikat zbiorczy błędów walidacji (dla screen readerów) */}
      <div aria-live="assertive" className="sr-only">
        {Object.keys(errors).length > 0 && 
         Object.values(errors).some(e => e !== undefined) && 
         "Bitte korrigieren Sie die Fehler im Formular, bevor Sie es absenden."}
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
          className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Wird gesendet…' : 'Nachricht senden'}
        </button>
      </div>
    </form>
  )
}
