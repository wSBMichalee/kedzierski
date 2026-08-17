// src/blocks/NewsletterCTA/Component.tsx
// Newsletter CTA wstrzykuje turnstileSiteKey przez enhanceProps z page.tsx
import { FadeInSection } from '@/components/shared/FadeInSection'
import { NewsletterFormClient } from '@/components/forms/NewsletterForm'
import type { NewsletterCTABlock } from '@/payload-types'

type Props = NewsletterCTABlock & { locale: string; turnstileSiteKey?: string }

export function NewsletterCTAComponent({
  ueberschrift,
  beschreibung,
  buttonLabel,
  datenschutzHinweis,
  locale,
  turnstileSiteKey,
}: Props) {
  return (
    <section className="section-padding bg-surface-DEFAULT" aria-labelledby="newsletter-heading">
      <div className="container-site max-w-2xl mx-auto text-center">
        <FadeInSection>
          {ueberschrift && (
            <h2 id="newsletter-heading" className="font-heading text-primary mb-4">
              {ueberschrift}
            </h2>
          )}
          {beschreibung && (
            <p className="text-muted-foreground text-body-desktop mb-8">{beschreibung}</p>
          )}

          <NewsletterFormClient
            buttonLabel={buttonLabel || 'Jetzt anmelden'}
            datenschutzHinweis={datenschutzHinweis}
            locale={locale}
            turnstileSiteKey={turnstileSiteKey}
          />
        </FadeInSection>
      </div>
    </section>
  )
}
