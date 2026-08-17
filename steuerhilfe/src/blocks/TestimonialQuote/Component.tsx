// src/blocks/TestimonialQuote/Component.tsx
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { FadeInSection } from '@/components/shared/FadeInSection'
import type { TestimonialQuoteBlock } from '@/payload-types'

type Props = TestimonialQuoteBlock & { locale: string }

export function TestimonialQuoteComponent({ zitat, autor, autorFoto, bewertung = 5 }: Props) {
  const foto = autorFoto && typeof autorFoto === 'object' ? autorFoto : null

  return (
    <section className="section-padding gradient-primary">
      <div className="container-site max-w-4xl mx-auto text-center">
        <FadeInSection>
          {/* Quote icon */}
          <Quote
            className="w-12 h-12 text-accent/40 mx-auto mb-6"
            aria-hidden="true"
            strokeWidth={1}
          />

          {/* Bewertung */}
          {bewertung && (
            <div className="flex justify-center gap-1 mb-6" aria-label={`${bewertung} von 5 Sternen`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < bewertung ? 'text-accent fill-accent' : 'text-white/20'}`}
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
              ))}
            </div>
          )}

          {/* Zitat */}
          <blockquote>
            <p className="text-white text-xl md:text-2xl font-body leading-relaxed italic mb-8">
              „{zitat}"
            </p>

            <footer className="flex items-center justify-center gap-4">
              {foto && (
                <Image
                  src={(foto as { url?: string }).url || ''}
                  alt={`Foto von ${autor}`}
                  width={56}
                  height={56}
                  className="rounded-full object-cover border-2 border-accent/40"
                />
              )}
              {!foto && (
                <div
                  className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-white font-heading text-xl"
                  aria-hidden="true"
                >
                  {autor.charAt(0).toUpperCase()}
                </div>
              )}
              <cite className="not-italic text-left">
                <span className="block text-white font-heading text-h4-desktop">{autor}</span>
                <span className="block text-white/60 text-small-desktop">Mitglied</span>
              </cite>
            </footer>
          </blockquote>
        </FadeInSection>
      </div>
    </section>
  )
}
