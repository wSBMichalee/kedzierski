// src/app/(frontend)/[locale]/berater-finden/page.tsx
// Wyszukiwarka doradców — Mapbox mapa + wyszukiwanie po PLZ
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { FadeInSection } from '@/components/shared/FadeInSection'
import { getAllAktivenBerater } from '@/lib/payload'
import { BeraterMapClient } from '@/components/berater/BeraterMap'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Berater finden',
    description:
      'Finden Sie Ihren persönlichen Steuerberater in Ihrer Nähe. Über 50 Beratungsstellen bundesweit.',
  }
}

export default async function BeraterFindenPage({ params }: Props) {
  const { locale } = await params

  // Alle aktiven Berater für die Karte laden (SSR)
  const result = await getAllAktivenBerater()
  const berater = result.docs

  // Nur für Mapbox benötigte Daten (kein volles Objekt an Client senden)
  const mapBerater = berater.map((b) => ({
    id: String(b.id),
    name: b.name,
    slug: b.slug || String(b.id),
    plz: b.plz || '',
    ort: b.ort || '',
    telefon: b.telefon,
    lat: b.koordinaten?.lat,
    lng: b.koordinaten?.lng,
  }))

  return (
    <div>
      {/* Page Header */}
      <div className="gradient-primary" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-white/60 text-small-desktop">
              <li><Link href={`/${locale}`} className="hover:text-white transition-colors">Startseite</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li aria-current="page" className="text-white">Berater finden</li>
            </ol>
          </nav>
          <FadeInSection>
            <h1 className="font-heading text-white mb-4">Berater in Ihrer Nähe finden</h1>
            <p className="text-white/80 text-body-desktop max-w-2xl">
              Geben Sie Ihre Postleitzahl ein und finden Sie die nächste Beratungsstelle in Ihrer Nähe.
              Unsere zertifizierten Berater helfen Ihnen persönlich bei Ihrer Steuererklärung.
            </p>
          </FadeInSection>
        </div>
      </div>

      {/* Karte + Suche */}
      <section aria-label="Beratersuche" className="bg-surface-DEFAULT">
        <BeraterMapClient
          berater={mapBerater}
          locale={locale}
          mapboxToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''}
        />
      </section>
    </div>
  )
}
