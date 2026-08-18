import { KontaktForm } from '@/components/forms/KontaktForm'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Kontakt',
    description: 'Nehmen Sie Kontakt mit uns auf. Wir helfen Ihnen gerne bei Fragen zur Mitgliedschaft oder Steuererklärung.',
  }
}

export default function KontaktPage() {
  return (
    <main className="flex-1 py-12 md:py-24 bg-surface min-h-[70vh]">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-h1-desktop font-heading font-semibold text-foreground mb-4">
            Kontakt
          </h1>
          <p className="text-body-desktop text-foreground/70">
            Haben Sie Fragen zur Mitgliedschaft oder möchten Sie einen Beratungstermin vereinbaren? Schreiben Sie uns eine Nachricht.
          </p>
        </div>
        
        <KontaktForm />
      </div>
    </main>
  )
}
