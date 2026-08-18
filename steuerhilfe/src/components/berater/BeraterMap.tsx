'use client'
// src/components/berater/BeraterMap.tsx
// Mapbox GL JS — mapa z markerami, wyszukiwarka po PLZ
// Animacje: markery drop-in, panel boczny spring, AnimatePresence
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Search, MapPin, Phone, ChevronRight, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { buttonVariants } from '@/components/ui/Button'

type BeraterMarker = {
  id: string
  name: string
  slug: string
  plz: string
  ort: string
  telefon?: string | null
  lat?: number | null
  lng?: number | null
}

type Props = {
  berater: BeraterMarker[]
  locale: string
  mapboxToken: string
}

export function BeraterMapClient({ berater, locale, mapboxToken }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBerater, setFilteredBerater] = useState<BeraterMarker[]>(berater)
  const [selectedBerater, setSelectedBerater] = useState<BeraterMarker | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const prefersReduced = useReducedMotion()

  // Filter nach PLZ/Ort
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (!query.trim()) {
        setFilteredBerater(berater)
        return
      }
      const q = query.toLowerCase().trim()
      setFilteredBerater(
        berater.filter(
          (b) =>
            b.plz.startsWith(q) ||
            b.ort.toLowerCase().includes(q) ||
            b.name.toLowerCase().includes(q),
        ),
      )
    },
    [berater],
  )

  // Mapbox initialisieren
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || mapRef.current) return

    let mapboxgl: typeof import('mapbox-gl')
    let map: import('mapbox-gl').Map

    import('mapbox-gl').then((module) => {
      mapboxgl = module.default as unknown as typeof import('mapbox-gl')
      ;(mapboxgl as unknown as { accessToken: string }).accessToken = mapboxToken

      map = new (mapboxgl as unknown as { Map: new (options: object) => import('mapbox-gl').Map }).Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [10.4515, 51.1657], // Deutschland Mitte
        zoom: 6,
      })

      map.on('load', () => {
        setIsMapLoaded(true)
        mapRef.current = map

        // Marker mit Drop-Animation hinzufügen (max 20 animiert)
        const withCoords = filteredBerater.filter((b) => b.lat && b.lng)
        withCoords.slice(0, 20).forEach((b, i) => {
          const el = document.createElement('div')
          el.className = 'berater-marker'
          el.style.cssText = `
            width: 32px; height: 32px;
            background: #1A3A5C; border: 3px solid #E8A020;
            border-radius: 50%; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: transform 0.15s ease-out, background 0.15s ease-out;
          `
          el.innerHTML = `<span style="color:#E8A020;font-size:12px;font-weight:700">${b.name.charAt(0)}</span>`

          if (!prefersReduced) {
            el.style.opacity = '0'
            el.style.transform = 'translateY(-20px)'
            setTimeout(() => {
              el.style.transition = 'all 0.3s ease-out'
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            }, i * 50)
          }

          el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.2)'
            el.style.background = '#E8A020'
          })
          el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)'
            el.style.background = '#1A3A5C'
          })
          el.addEventListener('click', () => setSelectedBerater(b))

          new (mapboxgl as unknown as { Marker: new (options: object) => import('mapbox-gl').Marker }).Marker({ element: el })
            .setLngLat([b.lng!, b.lat!])
            .addTo(map)
        })
      })
    })

    return () => {
      if (map) map.remove()
    }
  }, [mapboxToken, prefersReduced]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col lg:flex-row h-[600px] lg:h-[720px]">
      {/* Sidebar */}
      <div className="w-full lg:w-96 flex-shrink-0 bg-white border-r border-border flex flex-col">
        {/* Suchfeld */}
        <div className="p-4 border-b border-border">
          <label htmlFor="berater-search" className="sr-only">
            Berater suchen (PLZ oder Ort)
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
              aria-hidden="true"
              strokeWidth={1.5}
            />
            <Input
              id="berater-search"
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="PLZ oder Ort eingeben…"
              className="pl-9"
              aria-label="Berater nach PLZ oder Ort suchen"
            />
          </div>
          <p className="mt-2 text-small-desktop text-muted">
            {filteredBerater.length} Beratungsstelle{filteredBerater.length !== 1 ? 'n' : ''} gefunden
          </p>
        </div>

        {/* Ergebnisliste */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredBerater.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 text-center text-muted text-body-desktop"
              >
                Keine Beratungsstelle gefunden.
              </motion.p>
            ) : (
              filteredBerater.map((b, index) => (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, x: prefersReduced ? 0 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedBerater(b)}
                    className={`w-full text-left p-4 border-b border-border hover:bg-surface-DEFAULT transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                      selectedBerater?.id === b.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                    aria-pressed={selectedBerater?.id === b.id}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="w-4 h-4 text-accent flex-shrink-0 mt-1"
                        aria-hidden="true"
                        strokeWidth={1.5}
                      />
                      <div className="min-w-0">
                        <span className="block font-heading text-primary text-h4-mobile truncate">
                          {b.name}
                        </span>
                        <span className="block text-small-desktop text-muted mt-0.5">
                          {b.plz} {b.ort}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted flex-shrink-0 ml-auto" aria-hidden="true" strokeWidth={1.5} />
                    </div>
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Karte */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" aria-label="Karte mit Beratungsstellen" />

        {!isMapLoaded && (
          <div className="absolute inset-0 bg-surface-DEFAULT flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" aria-label="Karte wird geladen…" />
          </div>
        )}

        {/* Berater Detail Panel (spring animation) */}
        <AnimatePresence>
          {selectedBerater && (
            <motion.aside
              key={selectedBerater.id}
              initial={prefersReduced ? { opacity: 0 } : { x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { x: '100%', opacity: 0 }}
              transition={
                prefersReduced
                  ? { duration: 0.2 }
                  : { type: 'spring', stiffness: 300, damping: 30 }
              }
              className="absolute top-4 right-4 bottom-4 w-80 bg-white rounded-xl shadow-2xl border border-border overflow-hidden z-10 flex flex-col"
              aria-label={`Details: ${selectedBerater.name}`}
            >
              {/* Header */}
              <div className="gradient-primary p-4 flex items-start justify-between">
                <div>
                  <p className="font-heading text-white text-h4-mobile">{selectedBerater.name}</p>
                  <p className="text-white/70 text-small-desktop mt-1">
                    {selectedBerater.plz} {selectedBerater.ort}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBerater(null)}
                  aria-label="Detailansicht schließen"
                  className="ml-2 p-1 rounded hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="w-4 h-4 text-white" aria-hidden="true" strokeWidth={1.5} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 flex-1">
                {selectedBerater.telefon && (
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-4 h-4 text-accent" aria-hidden="true" strokeWidth={1.5} />
                    <a
                      href={`tel:${selectedBerater.telefon}`}
                      className="text-foreground hover:text-primary text-body-desktop transition-colors"
                    >
                      {selectedBerater.telefon}
                    </a>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="p-4 border-t border-border">
                <Link
                  href={`/${locale}/berater-finden/${selectedBerater.slug}`}
                  className={buttonVariants({ variant: 'accent', className: 'w-full' })}
                >
                  Zur Beraterseite
                </Link>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
