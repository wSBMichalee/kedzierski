// src/app/(frontend)/[locale]/berater-finden/[slug]/page.tsx
// Strona doradcy — LocalBusiness JSON-LD, lokalne SEO
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react'
import { FadeInSection } from '@/components/shared/FadeInSection'
import { getBeraterBySlug } from '@/lib/payload'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

const SPEZIALISIERUNGEN_LABELS: Record<string, string> = {
  arbeitnehmer: 'Arbeitnehmer',
  rentner: 'Rentner & Pensionäre',
  studenten: 'Studenten',
  beamte: 'Beamte',
  selbststaendige: 'Selbstständige (eingeschränkt)',
  grenzpendler: 'Grenzpendler',
  kapitalanleger: 'Kapitalanleger',
  vermieter: 'Vermieter',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const berater = await getBeraterBySlug(slug)
  if (!berater) return {}
  return {
    title: `${berater.name} | Beratungsstelle`,
    description:
      berater.beschreibung ||
      `${berater.name} — Ihre Beratungsstelle für Lohnsteuerhilfe in ${berater.ort || ''}. Kompetente Steuerberatung vor Ort.`,
  }
}

export default async function BeraterDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const berater = await getBeraterBySlug(slug)
  if (!berater) notFound()

  const foto = berater.foto && typeof berater.foto === 'object' ? berater.foto : null
  const adresse = berater.adresse || {}
  const spezialisierungen = berater.spezialisierungen || []

  // JSON-LD LocalBusiness — für lokales SEO entscheidend
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: berater.name,
    description: berater.beschreibung,
    telephone: berater.telefon,
    email: berater.email,
    url: berater.website || `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/berater-finden/${slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: adresse.strasse,
      addressLocality: adresse.ort,
      postalCode: adresse.plz,
      addressCountry: 'DE',
    },
    ...(berater.koordinaten?.lat && berater.koordinaten?.lng
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: berater.koordinaten.lat,
            longitude: berater.koordinaten.lng,
          },
        }
      : {}),
    openingHours: berater.oeffnungszeiten,
    parentOrganization: {
      '@type': 'Organization',
      name: 'Lohnsteuerhilfeverein',
    },
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Page Header */}
      <div className="gradient-primary section-padding">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-white/60 text-small-desktop flex-wrap">
              <li><Link href={`/${locale}`} className="hover:text-white transition-colors">Startseite</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li><Link href={`/${locale}/berater-finden`} className="hover:text-white transition-colors">Berater finden</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li aria-current="page" className="text-white truncate max-w-[200px]">{berater.name}</li>
            </ol>
          </nav>

          <FadeInSection>
            <div className="flex items-center gap-6">
              {foto ? (
                <Image
                  src={(foto as { url?: string }).url || ''}
                  alt={`Foto von ${berater.name}`}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-4 border-accent/40 flex-shrink-0"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center font-heading text-3xl text-white flex-shrink-0"
                  aria-hidden="true"
                >
                  {berater.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="font-heading text-white mb-2">{berater.name}</h1>
                {(adresse.plz || adresse.ort) && (
                  <p className="flex items-center gap-2 text-white/70 text-body-desktop">
                    <MapPin className="w-4 h-4 text-accent" aria-hidden="true" strokeWidth={1.5} />
                    {[adresse.plz, adresse.ort].filter(Boolean).join(' ')}
                  </p>
                )}
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>

      {/* Inhalt */}
      <div className="section-padding bg-surface-DEFAULT">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Kontaktkarte */}
            <FadeInSection className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="font-heading text-primary text-h3-mobile mb-6">Kontakt</h2>

                <address className="not-italic space-y-4">
                  {adresse.strasse && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-accent mt-1 flex-shrink-0" aria-hidden="true" strokeWidth={1.5} />
                      <div className="text-body-desktop text-foreground">
                        <span className="block">{adresse.strasse}</span>
                        <span className="block">{[adresse.plz, adresse.ort].filter(Boolean).join(' ')}</span>
                      </div>
                    </div>
                  )}
                  {berater.telefon && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" strokeWidth={1.5} />
                      <a href={`tel:${berater.telefon}`} className="text-body-desktop text-foreground hover:text-primary transition-colors">
                        {berater.telefon}
                      </a>
                    </div>
                  )}
                  {berater.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" strokeWidth={1.5} />
                      <a href={`mailto:${berater.email}`} className="text-body-desktop text-foreground hover:text-primary transition-colors break-all">
                        {berater.email}
                      </a>
                    </div>
                  )}
                  {berater.oeffnungszeiten && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-accent mt-1 flex-shrink-0" aria-hidden="true" strokeWidth={1.5} />
                      <p className="text-body-desktop text-foreground whitespace-pre-line">
                        {berater.oeffnungszeiten}
                      </p>
                    </div>
                  )}
                </address>

                {/* CTA */}
                <div className="mt-6 pt-6 border-t border-border">
                  <Link
                    href={`/${locale}/kontakt?berater=${slug}`}
                    className="block w-full text-center px-4 py-3 bg-accent hover:bg-accent-dark text-white font-body font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    Termin anfragen
                  </Link>
                </div>
              </div>
            </FadeInSection>

            {/* Hauptinhalt */}
            <div className="lg:col-span-2 space-y-6">
              {/* Beschreibung */}
              {berater.beschreibung && (
                <FadeInSection>
                  <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                    <h2 className="font-heading text-primary text-h3-mobile mb-4">Über die Beratungsstelle</h2>
                    <p className="text-muted-foreground text-body-desktop leading-relaxed">{berater.beschreibung}</p>
                  </div>
                </FadeInSection>
              )}

              {/* Spezialisierungen */}
              {spezialisierungen.length > 0 && (
                <FadeInSection>
                  <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                    <h2 className="font-heading text-primary text-h3-mobile mb-4">Spezialisierungen</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3" role="list">
                      {(spezialisierungen as string[]).map((spec) => (
                        <li key={spec} className="flex items-center gap-2 text-body-desktop text-foreground">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" strokeWidth={1.5} />
                          {SPEZIALISIERUNGEN_LABELS[spec] || spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeInSection>
              )}

              {/* Zurück */}
              <FadeInSection>
                <Link
                  href={`/${locale}/berater-finden`}
                  className="inline-flex items-center gap-2 text-accent hover:text-accent-dark font-body font-medium transition-colors"
                >
                  ← Alle Beratungsstellen
                </Link>
              </FadeInSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
