// src/blocks/TextContent/Component.tsx
import { FadeInSection } from '@/components/shared/FadeInSection'
import type { TextContentBlock } from '@/payload-types'

type Props = TextContentBlock & { locale: string }

const BG_CLASSES: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-surface-DEFAULT',
  primary: 'gradient-primary text-white',
}

const LAYOUT_CLASSES: Record<string, string> = {
  full: 'max-w-none',
  narrow: 'max-w-2xl mx-auto',
  twoColumn: 'max-w-none columns-1 md:columns-2 gap-8',
}

export function TextContentComponent({ ueberschrift, inhalt, layout = 'full', hintergrund = 'white' }: Props) {
  const bgClass = BG_CLASSES[hintergrund] ?? BG_CLASSES.white
  const layoutClass = LAYOUT_CLASSES[layout] ?? LAYOUT_CLASSES.full
  const isDark = hintergrund === 'primary'

  return (
    <section className={`section-padding ${bgClass}`}>
      <div className={`container-site ${layoutClass}`}>
        {ueberschrift && (
          <FadeInSection>
            <h2 className={`font-heading mb-8 ${isDark ? 'text-white' : 'text-primary'}`}>
              {ueberschrift}
            </h2>
          </FadeInSection>
        )}
        <FadeInSection>
          {/* Payload RichText wyrenederowany przez lexical — tu placeholder */}
          {/* W pełnej implementacji: <RichText content={inhalt} /> */}
          <div
            className={`prose prose-lg max-w-none ${isDark ? 'prose-invert' : 'prose-slate'}`}
          >
            {/* Rich text content rendered here */}
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}
