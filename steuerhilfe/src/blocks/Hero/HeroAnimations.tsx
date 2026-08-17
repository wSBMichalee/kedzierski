'use client'
// src/blocks/Hero/HeroAnimations.tsx
// 'use client' — izoluje Framer Motion od Server Component Hero
// Animacje: stagger entry, respektuje prefers-reduced-motion
import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export function HeroAnimations({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    // Brak animacji — tylko opacity (bez translateY i parallax)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Każdy element z data-animate dostaje własną animację */}
      {/* Wrapper przekazuje children — każdy child (React.Children) dostaje variant */}
      <motion.div variants={itemVariants} transition={{ duration: 0.6, ease: 'easeOut' }}>
        {children}
      </motion.div>
    </motion.div>
  )
}
