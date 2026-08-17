// src/proxy.ts
// Next.js 16: plik nazywa się proxy.ts (nie middleware.ts), funkcja proxy (nie middleware)
// Migracja: npx @next/codemod@canary middleware-to-proxy .
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createLocaleMiddleware } from '@intecion/ipal-kit/next/middleware'
import { i18nConfig } from '@/i18n.config'

const localeMiddleware = createLocaleMiddleware({ config: i18nConfig })

export function proxy(request: NextRequest) {
  const result = localeMiddleware(request)

  // OBA typy ('redirect' i 'next') mogą nieść cookie:
  // - 'redirect' — wejście na '/', negocjacja locale
  // - 'next'     — przełączenie języka (URL różny od cookie), za zgodą
  const response =
    result.type === 'next'
      ? NextResponse.next()
      : NextResponse.redirect(result.location)

  // KRYTYCZNE — guard: cookie jest OPCJONALNE (undefined gdy brak zgody functional)
  // Bez guardu set(undefined.name) rzuci błąd przy pierwszej wizycie bez zgody
  if (result.cookie) {
    response.cookies.set(result.cookie.name, result.cookie.value)
  }

  return response
}

// KRYTYCZNE — matcher MUSI być INLINE (nie importuj stałej!)
// Next analizuje ten obiekt statycznie — import stałej byłby zignorowany
// → proxy złapałby /admin /_next /api → 500
export const config = {
  matcher: ['/((?!api|admin|_next|.*\\..*).*)', '/'],
}
