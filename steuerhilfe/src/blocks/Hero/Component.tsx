// src/blocks/Hero/Component.tsx
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { HeroInteractive } from './HeroInteractive'
import { buttonVariants } from '@/components/ui/Button'
import type { HeroBlock } from '@/payload-types'

type Props = HeroBlock & { locale: string }

const DEFAULT_STATS = [
  { value: 'Über 50', label: 'Beratungsstellen' },
  { value: '10.000+', label: 'Zufriedene Mitglieder' },
  { value: '§ 4 Nr. 11', label: 'StBerG zugelassen' },
  { value: '100%', label: 'Persönliche Beratung' },
]

export async function HeroComponent({
  headline,
  subheadline,
  beschreibung,
  primaryCta,
  secondaryCta,
}: Props) {
  const heroHeadline = headline || 'Holen Sie sich Ihr Geld zurück.'
  const formattedHeadline = heroHeadline.includes('Geld zurück') ? (
    <>
      {heroHeadline.split('Geld zurück')[0]}
      <span className="text-primary">Geld zurück</span>
      {heroHeadline.split('Geld zurück')[1]}
    </>
  ) : (
    heroHeadline
  )

  const heroBadge = subheadline || 'Zugelassen nach § 4 Nr. 11 StBerG'
  const heroDesc = beschreibung || 'Kompetente Lohnsteuerhilfe für Arbeitnehmer, Rentner und Studenten. Wir erstellen Ihre Steuererklärung und holen das Maximum für Sie heraus.'

  return (
    <>
      <HeroInteractive>
        <div className="container-site py-16 md:py-24 relative z-10 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <p
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary font-body font-medium text-sm px-4 py-1.5 rounded-full mb-6"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" strokeWidth={2} />
              {heroBadge}
            </p>

            {/* H1 - jedyne H1 na stronie! */}
            <h1
              className="font-heading font-semibold text-foreground mb-6"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                lineHeight: 1.15,
                textTransform: 'none',
              }}
            >
              {formattedHeadline}
            </h1>

            {/* Beschreibung */}
            <p
              className="text-foreground/75 font-body mb-10 max-w-2xl"
              style={{
                fontSize: '17px',
                lineHeight: 1.65,
              }}
            >
              {heroDesc}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={primaryCta?.href || '/berater-finden'}
                className={buttonVariants({ variant: 'default', size: 'lg' })}
              >
                {primaryCta?.label || 'Berater finden'}
              </Link>
              <Link
                href={secondaryCta?.href || '/online-rechner'}
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                {secondaryCta?.label || 'Beitrag berechnen'}
              </Link>
            </div>
          </div>
        </div>
      </HeroInteractive>

      {/* Stats Section PONIŻEJ hero */}
      <section className="bg-surface-DEFAULT pb-16 md:pb-24 pt-4 md:pt-8" aria-label="Statistiken">
        <div className="container-site">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
            {DEFAULT_STATS.map((stat, i) => (
              <li key={i} className="bg-white border border-border rounded-xl p-6 flex flex-col items-center text-center">
                <span className="font-heading text-primary text-3xl md:text-4xl mb-2">
                  {stat.value}
                </span>
                <span className="font-body text-foreground/60 text-sm font-medium">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
