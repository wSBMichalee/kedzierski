// src/app/(frontend)/[locale]/steuerlexikon/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, ArrowRight, BookOpen } from 'lucide-react'
import { FadeInSection } from '@/components/shared/FadeInSection'
import { getLexikonEntry, getPosts } from '@/lib/payload'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const entry = await getLexikonEntry(slug, locale)
  if (!entry) return {}
  return {
    title: `${entry.term} | Steuerlexikon`,
    description:
      entry.kurzDefinition ||
      `Was ist ${entry.term}? Erklärung im Steuerlexikon der Lohnsteuerhilfe.`,
  }
}

export default async function LexikonEntryPage({ params }: Props) {
  const { locale, slug } = await params
  const entry = await getLexikonEntry(slug, locale)
  if (!entry) notFound()

  // JSON-LD Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.term,
    description: entry.kurzDefinition,
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/steuerlexikon/${slug}`,
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Page Header */}
      <div className="gradient-primary section-padding">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-white/60 text-small-desktop flex-wrap">
              <li><Link href={`/${locale}`} className="hover:text-white transition-colors">Startseite</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li><Link href={`/${locale}/steuerlexikon`} className="hover:text-white transition-colors">Steuerlexikon</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li aria-current="page" className="text-white truncate max-w-[200px]">{entry.term}</li>
            </ol>
          </nav>

          <FadeInSection>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center font-heading text-accent text-xl">
                {entry.term.charAt(0).toUpperCase()}
              </span>
              <span className="text-white/60 text-small-desktop uppercase tracking-wide">Steuerlexikon</span>
            </div>
            <h1 className="font-heading text-white mb-4">{entry.term}</h1>
            {entry.kurzDefinition && (
              <p className="text-white/80 text-body-desktop max-w-2xl leading-relaxed">
                {entry.kurzDefinition}
              </p>
            )}
          </FadeInSection>
        </div>
      </div>

      {/* Inhalt */}
      <article className="section-padding bg-surface-DEFAULT">
        <div className="container-site max-w-3xl mx-auto">
          <FadeInSection>
            <div className="bg-white rounded-2xl border border-border p-6 md:p-10 shadow-sm">
              {/* Rich text wird hier gerendert */}
              <div className="prose prose-lg prose-slate max-w-none">
                {/* entry.definition — Lexical RichText renderer hier */}
              </div>
            </div>
          </FadeInSection>

          {/* Verwandte Begriffe */}
          {entry.verwandteBegriffe && Array.isArray(entry.verwandteBegriffe) && entry.verwandteBegriffe.length > 0 && (
            <FadeInSection>
              <div className="mt-8">
                <h2 className="font-heading text-primary text-h3-mobile md:text-h3-desktop mb-4">
                  Verwandte Begriffe
                </h2>
                <ul className="flex flex-wrap gap-3" role="list">
                  {entry.verwandteBegriffe.map((rel) => {
                    if (typeof rel === 'string') return null
                    return (
                      <li key={rel.id}>
                        <Link
                          href={`/${locale}/steuerlexikon/${rel.slug}`}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-border rounded-full text-small-desktop text-foreground hover:border-primary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <BookOpen className="w-3 h-3" aria-hidden="true" strokeWidth={1.5} />
                          {rel.term}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </FadeInSection>
          )}

          {/* Verwandte Artikel */}
          {entry.verwandteArtikel && Array.isArray(entry.verwandteArtikel) && entry.verwandteArtikel.length > 0 && (
            <FadeInSection>
              <div className="mt-8">
                <h2 className="font-heading text-primary text-h3-mobile md:text-h3-desktop mb-4">
                  Verwandte Steuertipps
                </h2>
                <ul className="space-y-3" role="list">
                  {entry.verwandteArtikel.map((post) => {
                    if (typeof post === 'string') return null
                    return (
                      <li key={post.id}>
                        <Link
                          href={`/${locale}/steuertipps/${post.slug}`}
                          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" aria-hidden="true" strokeWidth={1.5} />
                          <span className="font-body font-500 text-foreground group-hover:text-primary transition-colors">
                            {post.title}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </FadeInSection>
          )}

          {/* Zurück zum Lexikon */}
          <FadeInSection>
            <div className="mt-10 pt-8 border-t border-border">
              <Link
                href={`/${locale}/steuerlexikon`}
                className="inline-flex items-center gap-2 text-accent hover:text-accent-dark font-body font-500 transition-colors"
              >
                ← Zurück zum Steuerlexikon
              </Link>
            </div>
          </FadeInSection>
        </div>
      </article>
    </div>
  )
}
