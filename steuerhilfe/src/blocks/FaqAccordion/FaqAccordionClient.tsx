'use client'
// src/blocks/FaqAccordion/FaqAccordionClient.tsx
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

type Frage = { frage: string; antwort: string }

export function FaqAccordionClient({ fragen }: { fragen: Frage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const prefersReduced = useReducedMotion()

  return (
    <dl className="space-y-3">
      {fragen.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={index}
            className={`border rounded-xl overflow-hidden transition-colors duration-150 ${
              isOpen ? 'border-primary/40 bg-white' : 'border-border bg-white hover:border-primary/20'
            }`}
          >
            <dt>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-heading text-primary text-h4-mobile focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              >
                <span>{item.frage}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.2,
                    ease: 'easeOut',
                  }}
                  aria-hidden="true"
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown
                    className="w-5 h-5 text-accent"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </motion.span>
              </button>
            </dt>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.dd
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  key="content"
                  initial={prefersReduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={prefersReduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-muted-foreground text-body-desktop leading-relaxed">
                    {item.antwort}
                  </p>
                </motion.dd>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </dl>
  )
}
