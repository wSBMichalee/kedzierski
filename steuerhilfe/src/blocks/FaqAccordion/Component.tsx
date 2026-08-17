// src/blocks/FaqAccordion/Component.tsx
// RSC — dane z CMS, accordion renderowany przez Client Component
import { FaqAccordionClient } from './FaqAccordionClient'
import { FadeInSection } from '@/components/shared/FadeInSection'
import type { FaqAccordionBlock } from '@/payload-types'

type Props = FaqAccordionBlock & { locale: string }

export function FaqAccordionComponent({ ueberschrift, fragen }: Props) {
  if (!fragen || fragen.length === 0) return null

  // JSON-LD FAQPage schema — generowany po stronie serwera
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: fragen.map((f: any, index: number) => ({
      '@type': 'Question',
      name: f.frage,
      acceptedAnswer: { '@type': 'Answer', text: f.antwort },
    })),
  }

  return (
    <section className="section-padding bg-surface-DEFAULT" aria-labelledby="faq-heading">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container-site max-w-3xl mx-auto">
        {ueberschrift && (
          <FadeInSection>
            <h2
              id="faq-heading"
              className="font-heading text-primary text-center mb-10"
            >
              {ueberschrift}
            </h2>
          </FadeInSection>
        )}

        <FadeInSection>
          <FaqAccordionClient fragen={fragen} />
        </FadeInSection>
      </div>
    </section>
  )
}
