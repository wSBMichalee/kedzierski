'use client'
// src/components/shared/FadeInSection.tsx
// Reużywalny wrapper animacji whileInView (Framer Motion)
// Używaj do animowania kart w gridach, sekcji, elementów listy
// ZAWSZE 'use client' — reszta strony zostaje Server Component
import { motion, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

type Props = {
  children: ReactNode
  delay?: number
  as?: ElementType
  className?: string
}

export function FadeInSection({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: Props) {
  const prefersReduced = useReducedMotion()

  const MotionTag = motion(Tag as 'div')

  if (prefersReduced) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1], // custom cubic-bezier (smooth deceleration)
      }}
    >
      {children}
    </MotionTag>
  )
}
