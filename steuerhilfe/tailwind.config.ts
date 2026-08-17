import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/blocks/**/*.{ts,tsx}',
  ],
  theme: {
    // ─────────────────────────────────────────────
    // Breakpointy (zgodne z Global Rules)
    // mobile: <768px  |  tablet: 768-1023px  |  desktop: >=1024px
    // ─────────────────────────────────────────────
    screens: {
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },

    // ─────────────────────────────────────────────
    // Spacing (baza 8px, tylko wielokrotności)
    // ─────────────────────────────────────────────
    spacing: {
      '0': '0px',
      '0.5': '4px',
      '1': '8px',
      '1.5': '12px',
      '2': '16px',
      '3': '24px',
      '4': '32px',
      '6': '48px',
      '8': '64px',
      '12': '96px',
      '16': '128px',
      // Extra dla wewnętrznych potrzeb komponentów
      px: '1px',
      '2px': '2px',
      '3px': '3px',
    },

    extend: {
      // ─────────────────────────────────────────────
      // Paleta kolorów (urzędowo-premium)
      // ─────────────────────────────────────────────
      colors: {
        // Główna paleta
        primary: {
          DEFAULT: '#1A3A5C',   // granat — zaufanie, finanse
          light: '#234E7A',
          dark: '#0F2236',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#E8A020',   // bursztynowy — CTA, akcenty
          light: '#F0B840',
          dark: '#C07818',
          foreground: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#F4F6F9',   // chłodna biel
          alt: '#EAECF0',
          dark: '#1C2B3A',      // ciemne tło sekcji
        },
        muted: {
          DEFAULT: '#6B7E8F',
          foreground: '#4A5668',
        },
        // Tokeny shadcn/ui
        background: '#F4F6F9',
        foreground: '#1C2B3A',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1C2B3A',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#1C2B3A',
        },
        border: '#D4DAE2',
        input: '#D4DAE2',
        ring: '#1A3A5C',
        destructive: {
          DEFAULT: '#CC3333',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#EAF0F6',
          foreground: '#1A3A5C',
        },
      },

      // ─────────────────────────────────────────────
      // Typografia (Oswald + Inter)
      // ─────────────────────────────────────────────
      fontFamily: {
        heading: ['var(--font-oswald)', ...fontFamily.sans],
        body: ['var(--font-inter)', ...fontFamily.sans],
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },

      // Skala typografii per Global Rules (tokens, nie ad-hoc)
      fontSize: {
        // H1
        'h1-mobile': ['32px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1-tablet': ['40px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1-desktop': ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        // H2
        'h2-mobile': ['26px', { lineHeight: '1.15', fontWeight: '600' }],
        'h2-tablet': ['32px', { lineHeight: '1.15', fontWeight: '600' }],
        'h2-desktop': ['40px', { lineHeight: '1.15', fontWeight: '600' }],
        // H3
        'h3-mobile': ['20px', { lineHeight: '1.2', fontWeight: '600' }],
        'h3-tablet': ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        'h3-desktop': ['28px', { lineHeight: '1.2', fontWeight: '600' }],
        // H4
        'h4-mobile': ['18px', { lineHeight: '1.3', fontWeight: '600' }],
        'h4-desktop': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        // Body
        'body-mobile': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-desktop': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        // Small
        'small-mobile': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
        'small-desktop': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },

      // ─────────────────────────────────────────────
      // Border radius (shadcn token)
      // ─────────────────────────────────────────────
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },

      // ─────────────────────────────────────────────
      // Min-heights sekcji Hero (Global Rules)
      // ─────────────────────────────────────────────
      minHeight: {
        'hero-mobile': '400px',
        'hero-tablet': '480px',
        'hero-desktop': '640px',
      },

      // ─────────────────────────────────────────────
      // Animacje
      // ─────────────────────────────────────────────
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },

      // Transition timing
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
