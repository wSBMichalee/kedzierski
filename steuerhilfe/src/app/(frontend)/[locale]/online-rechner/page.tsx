import { BeitragsRechner } from '@/components/rechner/BeitragsRechner'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function generateMetadata() {
  return {
    title: 'Beitragsrechner',
    description: 'Berechnen Sie schnell und einfach Ihren Mitgliedsbeitrag.',
  }
}

export default async function OnlineRechnerPage() {
  // In the future, fetch BeitragsTabelle globals here to pass into the component if needed.
  // const payload = await getPayload({ config: configPromise })
  // const beitragsTabelle = await payload.findGlobal({ slug: 'beitrags-tabelle' })

  return (
    <main className="flex-1 py-12 md:py-24 bg-surface min-h-[70vh]">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-h1-desktop font-heading font-semibold text-foreground mb-4">
            Beitrag berechnen
          </h1>
          <p className="text-body-desktop text-foreground/70">
            Wählen Sie Ihre Jahreseinnahmen aus, um Ihren jährlichen Mitgliedsbeitrag und die einmalige Aufnahmegebühr zu ermitteln.
          </p>
        </div>
        
        <BeitragsRechner />
      </div>
    </main>
  )
}
