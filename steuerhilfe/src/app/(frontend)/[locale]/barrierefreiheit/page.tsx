import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Barrierefreiheitserklärung',
  description: 'Erklärung zur Barrierefreiheit (BITV 2.0) der Lohnsteuerhilfe-Website.',
}

export default async function BarrierefreiheitPage({ params }: Props) {
  const { locale } = await params

  return (
    <div className="bg-surface-DEFAULT min-h-screen">
      {/* Header */}
      <div className="bg-primary section-padding">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-white/60 text-small-desktop flex-wrap">
              <li><Link href={`/${locale}`} className="hover:text-white transition-colors focus-visible:underline">Startseite</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li aria-current="page" className="text-white truncate">Barrierefreiheit</li>
            </ol>
          </nav>
          <h1 className="font-heading text-white text-h2-desktop md:text-h1-desktop">
            Erklärung zur Barrierefreiheit
          </h1>
        </div>
      </div>

      {/* Content */}
      <main id="main-content" className="section-padding container-site">
        <div className="max-w-3xl bg-white p-8 md:p-12 rounded-2xl border border-border shadow-sm">
          <div className="prose prose-slate prose-lg max-w-none">
            <p className="lead">
              Wir bemühen uns, unsere Website im Einklang mit den nationalen Rechtsvorschriften zur Umsetzung der Richtlinie (EU) 2016/2102 des Europäischen Parlaments und des Rates barrierefrei zugänglich zu machen.
            </p>

            <h2>Stand der Vereinbarkeit mit den Anforderungen</h2>
            <p>
              Diese Website ist mit der Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) weitestgehend vereinbar. Wir arbeiten kontinuierlich an der Verbesserung der Barrierefreiheit und orientieren uns dabei an den Web Content Accessibility Guidelines (WCAG) 2.1 auf Level AA.
            </p>

            <h2>Erstellung dieser Erklärung zur Barrierefreiheit</h2>
            <p>
              Diese Erklärung wurde am {new Date().toLocaleDateString('de-DE')} erstellt bzw. zuletzt überprüft.
            </p>

            <h2>Feedback und Kontaktangaben</h2>
            <p>
              Sind Ihnen Mängel beim barrierefreien Zugang zu Inhalten von unserer Website aufgefallen? Dann können Sie sich gerne bei uns melden. Bitte kontaktieren Sie uns unter:
            </p>
            <ul>
              <li>
                <strong>E-Mail:</strong> <a href="mailto:kontakt@lohnsteuerhilfe.de" className="text-primary hover:underline focus-visible:underline">kontakt@lohnsteuerhilfe.de</a>
              </li>
              <li>
                <strong>Telefon:</strong> <a href="tel:+49123456789" className="text-primary hover:underline focus-visible:underline">+49 (0) 123 456789</a>
              </li>
            </ul>

            <h2>Schlichtungsverfahren</h2>
            <p>
              Beim Beauftragten der Bundesregierung für die Belange von Menschen mit Behinderungen gibt es eine Schlichtungsstelle gemäß § 16 BGG. Die Schlichtungsstelle hat die Aufgabe, Konflikte zwischen Menschen mit Behinderungen und öffentlichen Stellen des Bundes zu lösen. 
              Sie können die Schlichtungsstelle einschalten, wenn Sie mit den Antworten aus der oben genannten Kontaktmöglichkeit nicht zufrieden sind.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
