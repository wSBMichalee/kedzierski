// src/app/(frontend)/[locale]/steuerlexikon/page.tsx
// A-Z listing — kluczowy silnik SEO long-tail
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { FadeInSection } from '@/components/shared/FadeInSection'
import { getLexikonEntries } from '@/lib/payload'
import type { LexikonEntry } from '@/payload-types'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Steuerlexikon A-Z',
    description:
      'Erklärungen zu Steuerbegriffen von A bis Z. Werbungskosten, Riesterrente, Kindergeld und mehr — verständlich erklärt.',
  }
}

export default async function SteuerlexikonPage({ params }: Props) {
  const { locale } = await params
  const result = await getLexikonEntries(locale)
  const entries = result.docs as LexikonEntry[]

  // Gruppierung nach Anfangsbuchstabe
  const byLetter = entries.reduce<Record<string, LexikonEntry[]>>((acc, entry) => {
    const letter = entry.buchstabe || entry.term.charAt(0).toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(entry)
    return acc
  }, {})

  const letters = Object.keys(byLetter).sort()
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div>
      {/* Page Header */}
      <div className="gradient-primary section-padding">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-white/60 text-small-desktop">
              <li><Link href={`/${locale}`} className="hover:text-white transition-colors">Startseite</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li aria-current="page" className="text-white">Steuerlexikon</li>
            </ol>
          </nav>
          <FadeInSection>
            <h1 className="font-heading text-white mb-4">Steuerlexikon A-Z</h1>
            <p className="text-white/80 text-body-desktop max-w-2xl">
              Alle wichtigen Steuerbegriffe verständlich erklärt.
              Von Werbungskosten bis Riesterrente — unser Lexikon gibt Ihnen Antworten.
            </p>
          </FadeInSection>
        </div>
      </div>

      {/* Alphabet-Navigation */}
      <div className="bg-white border-b border-border sticky top-16 md:top-20 z-30">
        <div className="container-site py-3">
          <nav aria-label="Alphabetische Navigation">
            <ul className="flex flex-wrap gap-1">
              {alphabet.map((letter) => {
                const hasEntries = letters.includes(letter)
                return (
                  <li key={letter}>
                    {hasEntries ? (
                      <a
                        href={`#buchstabe-${letter}`}
                        className="w-8 h-8 flex items-center justify-center rounded font-heading text-primary hover:bg-accent hover:text-white transition-colors text-sm focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {letter}
                      </a>
                    ) : (
                      <span className="w-8 h-8 flex items-center justify-center text-muted/30 text-sm cursor-not-allowed">
                        {letter}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Lexikon Inhalt */}
      <section className="section-padding bg-surface-DEFAULT" aria-label="Lexikon-Einträge">
        <div className="container-site">
          {letters.length === 0 ? (
            <p className="text-center text-muted py-16">
              Noch keine Lexikon-Einträge vorhanden.
            </p>
          ) : (
            <div className="space-y-12">
              {letters.map((letter) => (
                <div key={letter} id={`buchstabe-${letter}`}>
                  <FadeInSection>
                    <h2 className="font-heading text-primary text-h2-mobile md:text-h2-tablet lg:text-h2-desktop mb-6 pb-3 border-b-2 border-accent">
                      {letter}
                    </h2>
                    <ul
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      role="list"
                    >
                      {byLetter[letter].map((entry, index) => (
                        <li key={entry.id}>
                          <Link
                            href={`/${locale}/steuerlexikon/${entry.slug}`}
                            className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <span
                              className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center font-heading text-primary text-sm group-hover:bg-accent group-hover:text-white transition-colors"
                              aria-hidden="true"
                            >
                              {entry.term.charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <span className="block font-heading text-primary text-h4-mobile group-hover:text-accent transition-colors truncate">
                                {entry.term}
                              </span>
                              {entry.kurzDefinition && (
                                <span className="block text-muted-foreground text-small-desktop mt-1 line-clamp-2">
                                  {entry.kurzDefinition}
                                </span>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </FadeInSection>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
