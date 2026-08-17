'use client'
// src/blocks/Hero/HeroInteractive.tsx
import { useState, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import dynamic from 'next/dynamic'

// Leniwe ładowanie sceny, żeby nie blokować głównego wątku
const HeroScene = dynamic(() => import('@/components/shared/HeroScene').then(mod => mod.HeroScene), {
  ssr: false,
})

export function HeroInteractive({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()
  const [motionPref, setMotionPref] = useState<boolean | null>(null) // null = not hydrated

  useEffect(() => {
    // Sprawdzamy ustawienia przy montowaniu klienta
    const saved = localStorage.getItem('motion-preference')
    if (saved !== null) {
      setMotionPref(saved === 'true')
    } else {
      // Domyślnie włączone tylko dla desktopu i jeśli nie ma prefers-reduced-motion
      const isDesktop = window.innerWidth >= 768
      setMotionPref(!prefersReduced && isDesktop)
    }
  }, [prefersReduced])

  const toggleMotion = () => {
    const newVal = !motionPref
    setMotionPref(newVal)
    localStorage.setItem('motion-preference', String(newVal))
  }

  return (
    <section className="relative overflow-hidden bg-surface-DEFAULT flex items-center" aria-label="Hero">
      {/* Warstwa tła (za treścią) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-surface-DEFAULT">
        {motionPref === true ? (
          <HeroScene />
        ) : null}
      </div>

      {/* Warstwa treści (z-10 ustawiony w dzieciach) */}
      {children}

      {/* Przełącznik animacji */}
      {motionPref !== null && (
        <button
          onClick={toggleMotion}
          aria-pressed={motionPref}
          aria-label="Hintergrundanimation ein-/ausschalten"
          title={motionPref ? "Animation pausieren" : "Animation abspielen"}
          className="absolute bottom-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-border shadow-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {motionPref ? (
            <Pause className="w-4 h-4" aria-hidden="true" strokeWidth={1.5} />
          ) : (
            <Play className="w-4 h-4 ml-0.5" aria-hidden="true" strokeWidth={1.5} />
          )}
        </button>
      )}
    </section>
  )
}
