// src/app/(frontend)/[locale]/steuertipps/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ChevronRight, Filter } from 'lucide-react'
import { FadeInSection } from '@/components/shared/FadeInSection'
import { getPosts } from '@/lib/payload'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; kategorie?: string }>
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

function formatDate(date: string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  return `Stand: ${d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Steuertipps & Ratgeber',
    description:
      'Aktuelle Steuertipps für Arbeitnehmer, Rentner und Studenten. Informieren Sie sich über Steuervorteile und sparen Sie Geld.',
  }
}

export default async function SteuertippsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { page = '1', kategorie } = await searchParams
  const pageNum = parseInt(page, 10)

  const result = await getPosts({
    locale,
    page: pageNum,
    limit: 9,
    kategorie: kategorie || undefined,
  })

  const posts = result.docs
  const totalPages = result.totalPages

  return (
    <div>
      {/* Page Header */}
      <div className="gradient-primary section-padding">
        <div className="container-site">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-white/60 text-small-desktop">
              <li><Link href={`/${locale}`} className="hover:text-white transition-colors">Startseite</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li aria-current="page" className="text-white">Steuertipps</li>
            </ol>
          </nav>

          <FadeInSection>
            <h1 className="font-heading text-white mb-4">Steuertipps &amp; Ratgeber</h1>
            <p className="text-white/80 text-body-desktop max-w-2xl">
              Aktuelle Informationen zu Steueränderungen, Tipps für Ihre Steuererklärung
              und Wissenswertes rund um das Thema Lohnsteuer.
            </p>
          </FadeInSection>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white border-b border-border sticky top-16 md:top-20 z-30">
        <div className="container-site py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-muted flex-shrink-0" aria-hidden="true" strokeWidth={1.5} />
            <Link
              href={`/${locale}/steuertipps`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-small-desktop font-body font-500 transition-colors ${
                !kategorie
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-primary hover:bg-surface-DEFAULT'
              }`}
            >
              Alle
            </Link>
            {Object.entries(KATEGORIE_LABELS).map(([key, label]) => (
              <Link
                key={key}
                href={`/${locale}/steuertipps?kategorie=${key}`}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-small-desktop font-body font-500 transition-colors ${
                  kategorie === key
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-primary hover:bg-surface-DEFAULT'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Listing */}
      <section className="section-padding bg-surface-DEFAULT" aria-label="Artikel-Liste">
        <div className="container-site">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted text-body-desktop">Keine Artikel in dieser Kategorie gefunden.</p>
              <Link href={`/${locale}/steuertipps`} className="mt-4 inline-block text-accent hover:underline">
                Alle Artikel anzeigen
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
              {posts.map((post, index) => {
                const heroImage = post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
                return (
                  <FadeInSection key={post.id} delay={index * 0.05} as="li">
                    <article className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200 h-full flex flex-col">
                      <Link
                        href={`/${locale}/steuertipps/${post.slug}`}
                        className="block overflow-hidden aspect-video bg-surface-alt relative"
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
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {post.kategorie && (
                            <span className="text-xs font-body font-500 uppercase tracking-wide text-accent bg-accent/10 px-2 py-1 rounded">
                              {KATEGORIE_LABELS[post.kategorie as string] || post.kategorie}
                            </span>
                          )}
                          {post.standDatum && (
                            <span className="flex items-center gap-1 text-small-desktop text-muted">
                              <Calendar className="w-3 h-3" aria-hidden="true" strokeWidth={1.5} />
                              {formatDate(post.standDatum)}
                            </span>
                          )}
                        </div>
                        <h2 className="font-heading text-primary text-h3-mobile mb-3 line-clamp-2 flex-1">
                          <Link
                            href={`/${locale}/steuertipps/${post.slug}`}
                            className="hover:text-accent transition-colors focus-visible:underline"
                          >
                            {post.title}
                          </Link>
                        </h2>
                        {post.excerpt && (
                          <p className="text-muted-foreground text-small-desktop leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </article>
                  </FadeInSection>
                )
              })}
            </ul>
          )}

          {/* Paginierung */}
          {totalPages > 1 && (
            <nav aria-label="Seitennavigation" className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/${locale}/steuertipps?page=${p}${kategorie ? `&kategorie=${kategorie}` : ''}`}
                  aria-current={p === pageNum ? 'page' : undefined}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-body font-500 text-sm transition-all ${
                    p === pageNum
                      ? 'bg-primary text-white'
                      : 'bg-white border border-border text-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </div>
  )
}
