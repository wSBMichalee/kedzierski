// src/blocks/SteuertippsPreview/Component.tsx
// Async RSC — pobiera posty przez @payload-config (NIE lib/payload → cykl)
import config from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { FadeInSection } from '@/components/shared/FadeInSection'
import type { SteuertippsPreviewBlock, Post } from '@/payload-types'

type Props = SteuertippsPreviewBlock & { locale: string }

function formatStandDatum(date: string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  return `Stand: ${d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}`
}

const KATEGORIE_LABELS: Record<string, string> = {
  arbeitnehmer: 'Arbeitnehmer',
  rentner: 'Rentner',
  studenten: 'Studenten',
  familie: 'Familie',
  immobilien: 'Immobilien',
  kapitalanlagen: 'Kapitalanlagen',
  krypto: 'Krypto',
  allgemein: 'Allgemein',
}

export async function SteuertippsPreviewComponent({
  ueberschrift = 'Aktuelle Steuertipps',
  anzahl = 3,
  kategorie,
  ctaLabel = 'Alle Steuertipps anzeigen',
  locale,
}: Props) {
  // @payload-config = leniwy alias — NIE tworzy cyklu importów
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    locale: locale as never,
    limit: anzahl,
    sort: '-createdAt',
    depth: 1,
    where: kategorie ? { kategorie: { equals: kategorie } } : undefined,
  })

  const posts = result.docs as Post[]

  return (
    <section className="section-padding bg-white" aria-labelledby="steuertipps-heading">
      <div className="container-site">
        <FadeInSection>
          <div className="flex items-end justify-between mb-10">
            <h2 id="steuertipps-heading" className="font-heading text-primary">
              {ueberschrift}
            </h2>
            <Link
              href={`/${locale}/steuertipps`}
              className="hidden md:inline-flex items-center gap-2 text-accent hover:text-accent-dark font-body font-medium text-body-desktop transition-colors duration-150"
            >
              {ctaLabel}
              <ArrowRight className="w-4 h-4" aria-hidden="true" strokeWidth={1.5} />
            </Link>
          </div>
        </FadeInSection>

        {posts.length === 0 ? (
          <p className="text-muted text-center py-12">Keine Beiträge gefunden.</p>
        ) : (
          <ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
          >
            {posts.map((post, index) => {
              const heroImage =
                post.heroImage && typeof post.heroImage === 'object'
                  ? post.heroImage
                  : null

              return (
                <FadeInSection key={post.id} delay={index * 0.1} as="li">
                  <article className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200 ease-out h-full flex flex-col">
                    {/* Bild */}
                    <Link
                      href={`/${locale}/steuertipps/${post.slug}`}
                      className="block overflow-hidden aspect-video bg-surface-alt relative flex-shrink-0"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      {heroImage ? (
                        <Image
                          src={(heroImage as { url?: string }).url || ''}
                          alt={(heroImage as { alt?: string }).alt || post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 gradient-primary opacity-10" />
                      )}
                    </Link>

                    {/* Inhalt */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Kategorie + Datum */}
                      <div className="flex items-center gap-3 mb-3">
                        {post.kategorie && (
                          <span className="text-xs font-body font-medium uppercase tracking-wide text-accent bg-accent/10 px-2 py-1 rounded">
                            {KATEGORIE_LABELS[post.kategorie] || post.kategorie}
                          </span>
                        )}
                        {post.standDatum && (
                          <span className="flex items-center gap-1 text-small-desktop text-muted">
                            <Calendar className="w-3 h-3" aria-hidden="true" strokeWidth={1.5} />
                            {formatStandDatum(post.standDatum)}
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-primary text-h3-mobile lg:text-h4-desktop mb-3 line-clamp-2 flex-1">
                        <Link
                          href={`/${locale}/steuertipps/${post.slug}`}
                          className="hover:text-accent transition-colors duration-150 focus-visible:underline"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      {post.excerpt && (
                        <p className="text-muted-foreground text-small-desktop leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}

                      <Link
                        href={`/${locale}/steuertipps/${post.slug}`}
                        className="inline-flex items-center gap-1 text-accent hover:text-accent-dark font-body font-medium text-small-desktop transition-colors duration-150 mt-auto"
                        aria-label={`Mehr lesen: ${post.title}`}
                      >
                        Mehr lesen
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </article>
                </FadeInSection>
              )
            })}
          </ul>
        )}

        {/* Mobile CTA */}
        <FadeInSection>
          <div className="mt-8 text-center md:hidden">
            <Link
              href={`/${locale}/steuertipps`}
              className="inline-flex items-center gap-2 text-accent hover:text-accent-dark font-body font-medium transition-colors duration-150"
            >
              {ctaLabel}
              <ArrowRight className="w-4 h-4" aria-hidden="true" strokeWidth={1.5} />
            </Link>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}
