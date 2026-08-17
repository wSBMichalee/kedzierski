// src/blocks/USPGrid/Component.tsx
import * as LucideIcons from 'lucide-react'
import { FadeInSection } from '@/components/shared/FadeInSection'
import type { USPGridBlock } from '@/payload-types'

type IconName = keyof typeof LucideIcons
type Props = USPGridBlock & { locale: string }

function getIcon(name: string): React.ElementType | null {
  const Icon = (LucideIcons as Record<string, unknown>)[name] as React.ElementType | undefined
  return Icon ?? null
}

const DEFAULT_USPS = [
  {
    icon: 'Euro',
    titel: 'Günstige Mitgliedsbeiträge',
    beschreibung:
      'Bezahlbar für jeden Arbeitnehmer. Unser Beitrag richtet sich nach Ihrem Einkommen.',
  },
  {
    icon: 'ShieldCheck',
    titel: 'Geprüfte Fachkräfte',
    beschreibung:
      'Alle Berater sind zertifiziert und nach §4 Nr. 11 StBerG zugelassen.',
  },
  {
    icon: 'MapPin',
    titel: 'Beratung vor Ort',
    beschreibung:
      'Über 50 Beratungsstellen bundesweit — Ihren persönlichen Berater finden Sie in der Nähe.',
  },
  {
    icon: 'Clock',
    titel: 'Schnelle Bearbeitung',
    beschreibung:
      'Wir kümmern uns um alles — von der Belegersammlung bis zur Einreichung beim Finanzamt.',
  },
]

export function USPGridComponent({
  ueberschrift,
  karten,
}: Props) {
  const items = karten && karten.length > 0 ? karten : DEFAULT_USPS

  return (
    <section className="section-padding bg-surface-DEFAULT" aria-labelledby="usp-heading">
      <div className="container-site">
        {ueberschrift && (
          <FadeInSection>
            <h2
              id="usp-heading"
              className="font-heading text-center text-primary mb-12"
            >
              {ueberschrift}
            </h2>
          </FadeInSection>
        )}

        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
        >
          {items.map((item: any, index: number) => {
            const Icon = getIcon(item.icon || '')
            return (
              <FadeInSection key={index} delay={index * 0.1} as="li">
                <article className="bg-white rounded-xl p-8 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200 ease-out h-full group">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors duration-200"
                    aria-hidden="true"
                  >
                    {Icon && (
                      <Icon
                        className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-200"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <h3 className="font-heading text-primary text-h3-mobile lg:text-h4-desktop mb-3">
                    {item.titel}
                  </h3>

                  <p className="text-muted-foreground text-body-desktop leading-relaxed">
                    {item.beschreibung}
                  </p>
                </article>
              </FadeInSection>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
