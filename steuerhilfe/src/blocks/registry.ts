// src/blocks/registry.ts
// Mapa blockType → komponent React
// KRYTYCZNE: bloki NIE importują z @/lib/payload ani @/lib/content
// (tworzyłoby cykl: payload.config → bloki → lib → content → payload.config)
// Dane przez enhanceProps w page.tsx.

import { HeroComponent } from './Hero/Component'
import { USPGridComponent } from './USPGrid/Component'
import { SteuertippsPreviewComponent } from './SteuertippsPreview/Component'
import { TextContentComponent } from './TextContent/Component'
import { FaqAccordionComponent } from './FaqAccordion/Component'
import { TestimonialQuoteComponent } from './TestimonialQuote/Component'
import { NewsletterCTAComponent } from './NewsletterCTA/Component'

export const blockRegistry = {
  hero: HeroComponent,
  uspGrid: USPGridComponent,
  steuertippsPreview: SteuertippsPreviewComponent,
  textContent: TextContentComponent,
  faqAccordion: FaqAccordionComponent,
  testimonialQuote: TestimonialQuoteComponent,
  newsletterCTA: NewsletterCTAComponent,
} as const
