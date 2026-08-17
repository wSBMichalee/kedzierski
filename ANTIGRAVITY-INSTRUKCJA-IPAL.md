# Instrukcja budowy aplikacji Payload CMS z pluginem @intecion/ipal-kit

Dokument dla agenta Antigravity. Opisuje krok po kroku, jak zbudować aplikację
Payload CMS 3 + Next.js (App Router) wykorzystującą plugin `@intecion/ipal-kit`.
Instrukcja jest wyczerpująca — zawiera instalację, konfigurację, wzorce
architektoniczne, pułapki i checklisty. Nie pomijaj żadnego kroku.

> **Zasada nadrzędna:** logika mieszka w pluginie, projekt tylko podłącza i
> styluje. Nigdy nie duplikuj w projekcie tego, co plugin już robi. Nigdy nie
> zaszywaj na sztywno wartości, które plugin przyjmuje jako konfigurację
> (slug kolekcji, kody locale, nazwy globali).

---

## SPIS TREŚCI

1. Czym jest ipal-kit (zakres funkcji)
2. Stack i wymagania wersji
3. Instalacja pluginu z publicznego rejestru Gitea
4. Zależności towarzyszące
5. Konfiguracja `payload.config.ts` — plugin ipalKit
6. Warstwa i18n — `i18n.config.ts`
7. Warstwa frontendu — `lib/` (helpery, jedno źródło prawdy)
8. Proxy (dawniej middleware) — routing locale
9. Strona `[[...slug]]` — routing treści
10. Layout `[locale]` — consent, analytics, header/footer
11. Bloki treści — wzorzec enhanceProps (BEZ cykli importów)
12. Formularze — submitForm, Turnstile, FormRenderer
13. System Pages — homepage, privacy, cookies, terms
14. Consent i cookies — model 4-kategoryjny, locale za zgodą
15. SEO — metadane, sitemap, robots, hreflang
16. Build produkcyjny — Next 16 + Payload (pułapki)
17. Deployment (Coolify/Docker) — zmienne, baza
18. Publikowanie nowych wersji pluginu
19. Checklisty i najczęstsze błędy

---

## 1. Czym jest ipal-kit (zakres funkcji)

`@intecion/ipal-kit` (Intecion Payload Advanced Library) to plugin Payload CMS 3
dostarczający:

- **i18n** — routing per-locale (`/pl`, `/en`), hreflang, negocjacja języka,
  cookie locale za zgodą, helper do przełącznika języka
- **SEO** — metadane locale-aware, canonical, sitemap, robots, tytuły
- **Forms** — form-builder (kolekcje forms + form-submissions), `submitForm`
  z weryfikacją Turnstile, rate-limitingiem, walidacją i wysyłką maila przez SMTP
- **Consent** — model 4-kategoryjny (necessary/functional/analytics/marketing),
  baner, Consent Mode (Google), teksty per język z panelu
- **Analytics** — GA4/GTM z respektowaniem zgody
- **Blog / archiwa** — kolekcje pod stroną-archiwum, listing, paginacja
- **System Pages** — przypisanie stron systemowych (homepage, privacy, cookies,
  terms) w SiteSettings
- **Access control** — role admin > editor > user wstrzykiwane do kolekcji auth
- **Slug** — helper `buildSlugField` / `toSlug`
- **Email** — `panelSmtpAdapter` (SMTP konfigurowany w panelu)

Plugin eksportuje przez **5 punktów wejścia**:

| Import | Zawiera | Kontekst |
|---|---|---|
| `@intecion/ipal-kit` | ipalKit, helpery server-side, createContentHelpers, buildMetadata, getConsentTexts, getAnalyticsConfig, panelSmtpAdapter, buildFormsPlugin, buildSlugField, getSystemPagePath, typy | server / config |
| `@intecion/ipal-kit/client` | ConsentProvider, CookieBanner, CookieButton, Analytics, Turnstile | komponenty `'use client'` |
| `@intecion/ipal-kit/rsc` | RenderBlocks | React Server Component |
| `@intecion/ipal-kit/server` | submitForm, sendEmail, verifyTurnstile | server-only (importuje `server-only`) |
| `@intecion/ipal-kit/next/middleware` | createLocaleMiddleware | proxy.ts / middleware |

> **UWAGA:** nazwa subpath `./next/middleware` jest niezależna od nazwy pliku
> projektu. W Next 16 plik nazywa się `proxy.ts`, ale import z pluginu zostaje
> `@intecion/ipal-kit/next/middleware`.

---

## 2. Stack i wymagania wersji

- **Payload CMS**: 3.x (peer `^3.84.1`, testowane na 3.87.0)
- **Next.js**: 16.x (App Router)
- **React**: 19.x
- **Node**: 22
- **Package manager**: pnpm
- **lucide-react**: `^0.400.0` — MUSI być zgodne z pluginem (patrz pułapka niżej)

> **PUŁAPKA — dwie wersje lucide-react.** Plugin używa `lucide-react@^0.400.0`.
> Jeśli projekt zaciągnie inną major (np. `1.x`), powstają DWIE kopie w
> node_modules i mylące błędy typów na świeżym środowisku (serwer buildu).
> ZAWSZE przypnij projekt do `^0.400.0` i zsynchronizuj lockfile
> (`pnpm install` po zmianie), commitując `pnpm-lock.yaml`.

---

## 3. Instalacja pluginu z publicznego rejestru Gitea

Rejestr `@intecion` jest **publiczny do odczytu** — instalacja NIE wymaga tokenu.

**Krok 1.** Utwórz/uzupełnij `.npmrc` w katalogu projektu:

```
legacy-peer-deps=true
@intecion:registry=https://git.intecion.net/api/packages/IntecionSoftware/npm/
```

Ta linia to **scoped override**: tylko pakiety `@intecion/*` idą do Gitea, cała
reszta (`react`, `next`, `@payloadcms/*`, `lucide-react`) z publicznego npm.
NIE zmienia domyślnego rejestru. Plik nie zawiera sekretu — commituj go do repo
(deployment też go potrzebuje).

**Krok 2.** Zainstaluj:

```bash
pnpm add @intecion/ipal-kit
```

**Krok 3.** Zweryfikuj CZYSTĄ ścieżkę instalacji:

```bash
ls node_modules/@intecion/ipal-kit/dist/exports/client.js
```

Ścieżka MUSI być `node_modules/@intecion/ipal-kit/...` — bez hasha commita.

> **DLACZEGO REJESTR, NIE GIT.** Instalacja z gita
> (`pnpm add git+https://...`) rozpakowuje pakiet do ścieżki z hashem commita
> (`.pnpm/@intecion+ipal-kit@git+https...#hash/`), co ŁAMIE React Client
> Manifest w Next.js — komponenty `'use client'` (CookieBanner, Analytics,
> Turnstile) padają w runtime z „Could not find the module ... in the React
> Client Manifest". Rejestr daje czystą ścieżkę i ten błąd nie występuje.
> Instalacji z gita używaj TYLKO do testowania nieopublikowanego commita.

**Deployment (Coolify/serwer):** ponieważ rejestr jest publiczny, serwer NIE
potrzebuje tokenu. `.npmrc` w repo wystarcza.

---

## 4. Zależności towarzyszące

Plugin nie wciąga zależności współdzielonych z Payloadem — dodaj je w wersji
zgodnej z Twoim Payloadem:

```bash
pnpm add @payloadcms/plugin-seo @payloadcms/plugin-form-builder \
         nodemailer lucide-react@^0.400.0 slugify server-only
```

- `server-only` — wymagane, bo moduły email/turnstile/forms je importują dla
  ochrony przed wyciekiem do bundla klienta
- `lucide-react@^0.400.0` — zgodność z pluginem (patrz pułapka wyżej)

Adapter bazy i richtext wg wyboru (np. `@payloadcms/db-postgres`,
`@payloadcms/richtext-lexical`).

---

## 5. Konfiguracja `payload.config.ts` — plugin ipalKit

Plugin podłącza się w tablicy `plugins`. Przyjmuje `IpalOptions`:

```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ipalKit, panelSmtpAdapter } from '@intecion/ipal-kit'
import { i18nConfig } from '@/i18n.config'

// kolekcje/globale projektu
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'

export default buildConfig({
  admin: { user: 'users' },
  collections: [Pages, Users, Media /* ... */],
  globals: [/* Company, Header, Footer, ... */],

  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } }),
  editor: lexicalEditor(),

  // SMTP konfigurowany w panelu (SiteIntegrations)
  email: panelSmtpAdapter(),

  plugins: [
    ipalKit({
      i18n: i18nConfig,                    // WYMAGANE
      access: { collection: 'users' },     // wstrzykuje role admin>editor>user
      pages: { collection: 'pages' },      // System Pages w SiteSettings
      content: {                           // archiwa (blog) — wymaga pages
        collections: [
          { collection: 'posts', archiveRole: 'blog' },
        ],
      },
      seo: { collections: ['pages', 'posts'] },
      forms: { /* opcje form-buildera */ },
      // siteSettingsFields / integrationsFields — dodatkowe pola do globali
    }),
  ],
})
```

**Opcje `IpalOptions`:**

| Opcja | Typ | Rola |
|---|---|---|
| `enabled` | `boolean` | wyłącza plugin bez odinstalowania (schemat DB zostaje) |
| `i18n` | `I18nConfig` | **wymagane** — locale, default, fallback |
| `access` | `AccessOption` | role wstrzykiwane do kolekcji auth |
| `pages` | `PagesOption` | System Pages, podaj slug kolekcji stron |
| `content` | `ContentOption` | kolekcje-archiwa, wymaga `pages` |
| `seo` | `SeoOption` | meta pola + helpery metadanych |
| `forms` | `FormsOption` | form-builder + submitForm |
| `siteSettingsFields` | `Field[]` | dodatkowe pola do SiteSettings |
| `integrationsFields` | `Field[]` | dodatkowe pola do SiteIntegrations |

Plugin sam tworzy globale `site-settings`, `site-integrations`, `cookie-settings`
oraz (przy forms) kolekcje `forms`, `form-submissions`.

---

## 6. Warstwa i18n — `i18n.config.ts`

```ts
// src/i18n.config.ts
import type { I18nConfig } from '@intecion/ipal-kit'

export const i18nConfig = {
  defaultLocale: 'pl',
  locales: [
    { code: 'pl', label: 'Polski' },
    { code: 'en', label: 'English' },
  ],
} as const satisfies I18nConfig
```

> **PUŁAPKA — `as const` i readonly.** `as const` czyni obiekt readonly. To
> DOBRE dla configu tylko do odczytu (jak i18nConfig — plugin go czyta). Ale
> ZŁE dla danych przekazywanych do `payload.create`/`update`, które wymagają
> mutable. Dla i18nConfig `as const satisfies I18nConfig` jest poprawne.

Localization w `payload.config.ts` musi odpowiadać `i18nConfig` (te same kody).

---

## 7. Warstwa frontendu — `lib/` (helpery, JEDNO źródło prawdy)

To najważniejsza sekcja architektury projektu. Plugin dostarcza
`createContentHelpers` — fabrykę, która tworzy CACHE'OWANĄ instancję Payload
i helpery współdzielące ją. Wszystkie helpery MUSZĄ pochodzić z JEDNEGO miejsca.

**`src/lib/content.ts`** — jedyne źródło helperów pluginu:

```ts
import { createContentHelpers } from '@intecion/ipal-kit'
import config from '@/payload.config'        // PAYLOAD config (default export)
import { i18nConfig } from '@/i18n.config'    // i18n OSOBNO

const contentConfig = { collections: [] }     // { collections: [] } jeśli brak archiwów

export const {
  getCachedPayload,
  getSettings,
  getConfiguredLocales,
  resolveRoute,
  getEntries,
  robots,
} = createContentHelpers({
  config,               // payload config, NIE i18nConfig
  content: contentConfig,
  i18n: i18nConfig,     // i18n do osobnego pola
})
```

> **KRYTYCZNE — `config` to PAYLOAD config, nie i18n.** `createContentHelpers`
> ma pole `config` typu `SanitizedConfig` (cała konfiguracja Payloada, default
> export z payload.config). i18n idzie do OSOBNEGO pola `i18n`. Pomylenie daje
> błąd TS2322 („JsonObject is not assignable to SanitizedConfig").

**`src/lib/payload.ts`** — funkcje specyficzne dla projektu (globale, których
plugin nie zna). Importują `getCachedPayload` z `./content`:

```ts
import { cache } from 'react'
import { getSiteIntegrations, getSiteSettings } from '@intecion/ipal-kit'
import type { SiteSetting } from '@/payload-types'
import { getCachedPayload } from './content'

// Typowane getSettings — plugin jest agnostyczny, klient podaje swój typ
export const getSettings = cache(async (locale: string) =>
  getSiteSettings<SiteSetting>(await getCachedPayload(), {
    locale: locale as never,   // locale as never — agnostyczne, NIE 'pl' | 'en'
    depth: 2,
  }),
)

export const getCompany = cache(async () =>
  (await getCachedPayload()).findGlobal({ slug: 'company', depth: 2 }),
)
export const getHeader = cache(async (locale: string) =>
  (await getCachedPayload()).findGlobal({ slug: 'header', locale: locale as never, depth: 2 }),
)
export const getFooter = cache(async (locale: string) =>
  (await getCachedPayload()).findGlobal({ slug: 'footer', locale: locale as never, depth: 2 }),
)
export const getTurnstileSiteKey = cache(async (): Promise<string | undefined> => {
  const payload = await getCachedPayload()
  // getSiteIntegrations jest generyczne — podaj swój typ przy WYWOŁANIU
  const { turnstileSiteKey } = await getSiteIntegrations<{ turnstileSiteKey?: string }>(payload)
  return turnstileSiteKey
})
```

> **WZORZEC — generyki przy wywołaniu.** `getSiteIntegrations` i `getSiteSettings`
> są CELOWO generyczne — plugin nie może importować `payload-types` klienta.
> Klient podaje swój typ PRZY WYWOŁANIU: `getSiteIntegrations<{...}>(payload)`,
> `getSiteSettings<SiteSetting>(payload, {...})`. NIGDY nie próbuj otypować
> zwrotu tych funkcji w pluginie — to złamie jego niezależność od projektu.

> **PUŁAPKA — `locale as never`, nie `locale as 'pl' | 'en'`.** Nigdy nie
> hardkoduj unii kodów locale. `locale as never` jest agnostyczne — działa dla
> dowolnej liczby języków. Hardkodowanie łamie się przy dodaniu trzeciego.

> **NIE TWÓRZ osobnego `getCachedPayload` w wielu plikach.** Jedno źródło:
> `content.ts` (przez createContentHelpers). `payload.ts` importuje stamtąd.
> Duplikacja daje dwie instancje cache.

**Pliki do USUNIĘCIA (jeśli powstały ze starych wzorców):**
- `lib/pages.ts` z własnym `resolvePage` — DUPLIKAT `resolveRoute`. Usuń.
- `lib/locales.ts` z własnym `getConfiguredLocales` — DUPLIKAT. Usuń, bierz z content.

---

## 8. Proxy (dawniej middleware) — routing locale

W Next 16 plik nazywa się `proxy.ts` (nie `middleware.ts`), funkcja `proxy`
(nie `middleware`). Migracja starego pliku: `npx @next/codemod@canary middleware-to-proxy .`

```ts
// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createLocaleMiddleware } from '@intecion/ipal-kit/next/middleware'
import { i18nConfig } from '@/i18n.config'

const localeMiddleware = createLocaleMiddleware({ config: i18nConfig })

export function proxy(request: NextRequest) {
  const result = localeMiddleware(request)

  // OBA wyniki mogą nieść cookie:
  //  - 'redirect' — wejście na goły '/', negocjacja locale
  //  - 'next'     — przełączenie języka (URL /en różny od cookie), za zgodą
  // Cookie pojawia się TYLKO za zgodą functional. Ustaw je, gdy jest.
  const response =
    result.type === 'next'
      ? NextResponse.next()
      : NextResponse.redirect(result.location)

  if (result.cookie) {
    response.cookies.set(result.cookie.name, result.cookie.value)
  }

  return response
}

// matcher MUSI być INLINE — Next analizuje ten obiekt statycznie i nie wykonuje
// importów. Import stałej matchera zostałby zignorowany → proxy złapie
// /admin /_next /api → 500.
export const config = {
  matcher: ['/((?!api|admin|_next|.*\\..*).*)'],
}
```

> **KRYTYCZNE — guard `if (result.cookie)`.** `cookie` jest OPCJONALNE (undefined
> gdy brak zgody functional). Bez guardu `set(undefined.name)` rzuci błąd przy
> pierwszej wizycie bez zgody. ZAWSZE `if (result.cookie)`.

> **KRYTYCZNE — cookie w OBU gałęziach.** `type: 'next'` też może nieść cookie
> (gdy użytkownik przełącza język za zgodą). Nie rób `if (type==='next') return
> next()` bez obsługi cookie — zgubisz zapis przy przełączaniu.

> **KRYTYCZNE — matcher inline.** Nie importuj matchera ze stałej. Next czyta
> `config.matcher` statycznie.

---

## 9. Strona `[[...slug]]` — routing treści

```ts
// src/app/(frontend)/[locale]/[[...slug]]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RenderBlocks } from '@intecion/ipal-kit/rsc'
import { createPageMetadata } from '@intecion/ipal-kit'
import { i18nConfig } from '@/i18n.config'
import { blockRegistry } from '@/blocks/registry'
import { getCachedPayload, resolveRoute } from '@/lib/content'
import { getTurnstileSiteKey } from '@/lib/payload'

const pageMetadata = createPageMetadata({
  config: i18nConfig,
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  return pageMetadata({ payload: await getCachedPayload(), locale, slug })
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug?: string[] }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale, slug } = await params
  const { page } = await searchParams
  const pageNum = page ? parseInt(page, 10) : 1

  // resolveRoute(locale, segments, page) — TRZY argumenty
  const route = await resolveRoute(locale, slug ?? [], pageNum)
  if (!route) notFound()

  // Turnstile pobrany RAZ, wstrzyknięty do bloków przez enhanceProps
  const turnstileSiteKey = await getTurnstileSiteKey()

  return (
    <RenderBlocks
      blocks={route.doc.layout as never}
      components={blockRegistry}
      enhanceProps={({ block }) => {
        if (block.blockType === 'freeQuote' || block.blockType === 'contact') {
          return { locale, turnstileSiteKey }
        }
        return { locale }
      }}
    />
  )
}
```

> **`resolveRoute` przyjmuje TRZY argumenty:** `(locale, segments: string[], page: number)`.
> `segments` to tablica (przekaż `slug ?? []`), NIE string złączony przez `join`.
> `page` to numer strony paginacji (z `searchParams.page`, domyślnie 1).

> **`resolveRoute` z pluginu, NIE własny `resolvePage`.** Bierz z `@/lib/content`
> (skonfigurowany). Zwraca `{ type, doc, ... }` — używaj `route.doc.layout`.
> Obsługuje homepage (poprawny depth), zwykłe strony I archiwa. Własny
> `resolvePage` to duplikat ze sztywnym kodowaniem — nie pisz go.

> **`enhanceProps({ block, allBlocks, index })`** wstrzykuje propsy do bloków.
> Używaj go do przekazywania danych W DÓŁ (locale, turnstileSiteKey) zamiast
> importować je w blokach (co tworzy cykle — patrz sekcja 11).

---

## 10. Layout `[locale]` — consent, analytics, header/footer

```ts
// src/app/(frontend)/[locale]/layout.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAnalyticsConfig, getConsentTexts } from '@intecion/ipal-kit'
import { Analytics, ConsentProvider, CookieBanner, CookieButton } from '@intecion/ipal-kit/client'
import { i18nConfig } from '@/i18n.config'
import { getCachedPayload, getConfiguredLocales, getSettings } from '@/lib/content'
import { getCompany, getFooter, getHeader } from '@/lib/payload'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import '../styles.css'

export default async function LocaleLayout({
  children, params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const locales = await getConfiguredLocales()
  if (!locales.includes(locale)) notFound()

  const payload = await getCachedPayload()

  const [settings, header, footer, company] = await Promise.all([
    getSettings(locale), getHeader(locale), getFooter(locale), getCompany(),
  ])

  const privacyPage = (settings as { privacyPolicy?: unknown }).privacyPolicy

  const [texts, analytics] = await Promise.all([
    getConsentTexts({
      config: i18nConfig,        // tu config to I18nConfig (inaczej niż w createContentHelpers!)
      locale,
      payload,
      privacyPolicy:
        privacyPage && typeof privacyPage === 'object'
          ? { page: privacyPage, label: 'Polityka prywatności' }
          : undefined,
    }),
    getAnalyticsConfig(payload),
  ])

  return (
    <html lang={locale}>
      <body>
        <ConsentProvider texts={texts}>
          <Header header={header} settings={settings} locale={locale} />
          <main>{children}</main>
          <Footer footer={footer} settings={settings} locale={locale} company={company} />
          <CookieBanner classNames={{ root: '...', primaryButton: '...', secondaryButton: '...' }} />
          <CookieButton className="..." />
          <Analytics {...analytics} />
        </ConsentProvider>
      </body>
    </html>
  )
}

export async function generateStaticParams() {
  const locales = await getConfiguredLocales()
  return locales.map((locale) => ({ locale }))
}
```

> **UWAGA — dwa różne `config`.** W `getConsentTexts` pole `config` to
> `I18nConfig` (przekaż `i18nConfig`). W `createContentHelpers` pole `config` to
> payload config. To DWA różne kontrakty — nie myl ich.

> **Kolejność komponentów consent:** `ConsentProvider` owija wszystko,
> `CookieBanner` + `CookieButton` + `Analytics` w środku. Analytics respektuje
> zgodę przez Consent Mode.

---

## 11. Bloki treści — wzorzec enhanceProps (BEZ cykli importów)

Bloki to komponenty renderujące sekcje strony. Mogą pobierać dane (globale),
ale NIE MOGĄ importować z `@/lib/payload`/`@/lib/content`, jeśli te (przez
łańcuch) wracają do `payload.config`, który importuje bloki. To tworzy CYKL.

**Wzorzec poprawny — blok dostaje dane przez propsy (enhanceProps):**

```ts
// src/blocks/FreeQuote/Component.tsx
import config from '@payload-config'
import { getPayload } from 'payload'
import { RichText } from '@/components/RichText'
import { FormRenderer } from '@/components/Form'
import type { FreeQuote1 as FreeQuoteGlobal } from '@/payload-types'

// turnstileSiteKey przychodzi z page.tsx przez enhanceProps — NIE importuj
// getTurnstileSiteKey z @/lib/payload (tworzy cykl).
type Props = { turnstileSiteKey?: string }

export const FreeQuote = async ({ turnstileSiteKey }: Props) => {
  const payload = await getPayload({ config })   // @payload-config = leniwy alias, OK
  const freeQuote = await payload.findGlobal({ slug: 'freeQuote', depth: 1 })
  const data = freeQuote as FreeQuoteGlobal
  // ... render, przekazuje turnstileSiteKey do FormRenderer
}
```

> **KRYTYCZNE — cykl importów.** Jeśli blok importuje `getTurnstileSiteKey` z
> `@/lib/payload`, powstaje cykl:
> `payload.config → globals → blok → lib/payload → lib/content → payload.config`.
> Objaw: `ReferenceError: Cannot access '{default export}' before initialization`.
> ROZWIĄZANIE: blok NIE importuje z lib. Dane, które pochodzą z helperów lib
> (turnstileSiteKey), wstrzykuj przez `enhanceProps` w page.tsx. `getPayload({
> config })` przez `@payload-config` (leniwy alias) jest OK — nie cykliuje.

> **`FreeQuote1` vs `FreeQuote`.** Payload generuje DWA typy przy kolizji nazw:
> `FreeQuote` (blok, ma blockType) i `FreeQuote1` (global, bez blockType). Global
> `findGlobal({ slug: 'freeQuote' })` zwraca `FreeQuote1`. Importuj właściwy.
> Lepiej: nadaj globalowi `typescript.interfaceName: 'FreeQuoteGlobal'` w jego
> definicji — Payload wygeneruje stabilną nazwę zamiast krucheg `FreeQuote1`.

**blockRegistry** — mapa blockType → komponent:

```ts
// src/blocks/registry.ts
import { FreeQuote } from './FreeQuote/Component'
import { Contact } from './Contact/Component'
// ...
export const blockRegistry = {
  freeQuote: FreeQuote,
  contact: Contact,
  // ...
}
```

---

## 12. Formularze — submitForm, Turnstile, FormRenderer

**Server Action** wywołuje `submitForm` z pluginu (`/server` entry point):

```ts
// src/components/Form/actions.ts
'use server'
import { submitForm } from '@intecion/ipal-kit/server'
import { getCachedPayload } from '@/lib/content'   // z content, nie payload

export async function submitFormAction(formId: string, data: Record<string, unknown>, turnstileToken?: string) {
  const payload = await getCachedPayload()
  return submitForm({ payload, formId, data, turnstileToken })
}
```

**`submitForm` zwraca KOD wyniku, nie tekst** — front decyduje o komunikacie:

```ts
type SubmitFormResult =
  | { success: true; submissionId: string | number }
  | { success: false; reason: 'rate_limited' }
  | { success: false; reason: 'turnstile' }
  | { success: false; reason: 'validation'; field?: string; kind?: ... }
  | { success: false; reason: 'not_found' }
  | { success: false; reason: 'error' }
```

- `turnstileToken?: string` — gdy `undefined`, weryfikacja jest POMIJANA. Gdy
  string, weryfikowana. NIE `null` — przekazuj `token ?? undefined`.

**FormRenderer (komponent klienta) — kluczowe punkty:**

```ts
const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

// Turnstile z pluginu przyjmuje onToken: (token: string | null) => void
<Turnstile siteKey={turnstileSiteKey} onToken={setTurnstileToken} />

// Guard captcha PRZED submitem (z komunikatem, nie ciche return):
if (!turnstileToken) {
  setError('Rozwiąż captchę przed wysłaniem.')
  setIsSubmitting(false)
  return
}
const result = await submitFormAction(String(form.id), data, turnstileToken)

// Po sukcesie: reset tokenu (Turnstile zużywa token jednorazowo)
if (result.success) {
  formElement.reset()
  setTurnstileToken(null)   // token zużyty
  // ...
}
```

> **`useState<string | null>(null)`** — nie `useState<string>('')`. Turnstile
> resetuje token do `null` (wygaśnięcie), więc state musi przyjąć `null`.

---

## 13. System Pages — homepage, privacy, cookies, terms

Plugin dodaje do SiteSettings pola przypisania stron systemowych. Role:
`homepage`, `privacyPolicy`, `cookiePolicy`, `termsOfService`.

Włącz przez `pages: { collection: 'pages' }` w ipalKit. Pola generują się
automatycznie z listy ról (`ALL_SYSTEM_PAGE_ROLES`).

**Linkowanie na froncie** — `getSystemPagePath` (generyczne, bez switcha po rolach):

```ts
import { getSystemPagePath } from '@intecion/ipal-kit'

const termsPage = (settings as { termsOfService?: unknown }).termsOfService
const href = getSystemPagePath({ page: termsPage, locale, config: i18nConfig })
// <a href={href}>Regulamin</a> w stopce
```

> **Rozróżnienie prawne (ważne dla klienta):** `privacyPolicy` (RODO) +
> `cookiePolicy` (ePrivacy) wymagane. `termsOfService` (regulamin) to wymóg
> ustawy o świadczeniu usług elektronicznych, NIE RODO. Regulamin linkuje się w
> STOPCE, nie w banerze cookies (baner linkuje tylko do polityki prywatności).

---

## 14. Consent i cookies — model 4-kategoryjny, locale za zgodą

Cztery kategorie: `necessary`, `functional`, `analytics`, `marketing`. Tylko
`necessary` nie wymaga zgody.

**Cookie locale (`ipal-locale`) jest FUNKCJONALNE** — zapisuje się TYLKO za
zgodą functional. To skonfigurowane w `createLocaleMiddleware` (domyślnie
`consentCategory: 'functional'`). Zachowanie:

- **wejście / zmiana URL / przełącznik** → locale zawsze wykryte (routing działa)
- **cookie zapisane TYLKO za zgodą functional** — bez zgody wybór nie jest pamiętany
- **cofnięcie zgody functional** → `useConsent` usuwa `ipal-locale` automatycznie

> Aby zmienić kategorię (np. traktować locale jako niezbędne):
> `createLocaleMiddleware({ config, consentCategory: 'necessary' })` — wtedy
> zapisuje zawsze.

Teksty banera konfigurowane w panelu (global `cookie-settings`) per język,
z fallbackiem angielskim. `getConsentTexts` je resolwuje.

---

## 15. SEO — metadane, sitemap, robots, hreflang

- `createPageMetadata({ config, baseUrl })` → funkcja generująca `Metadata` per
  strona (patrz page.tsx). Ustaw `NEXT_PUBLIC_SERVER_URL`, inaczej canonical
  będzie względny.
- `robots` z `createContentHelpers` → eksportuj jako default z `app/robots.ts`.
- Sitemap: helper `buildSitemapEntries` (patrz seo.md).
- Hreflang, canonical — generowane automatycznie z i18nConfig w metadanych.
- Tytuły: `titleOrder`/`titleSeparator`/`titleOverride` w SEO tab.

---

## 16. Build produkcyjny — Next 16 + Payload (pułapki)

**Build script w package.json:**

```json
"build": "cross-env NODE_OPTIONS=\"--no-deprecation --max-old-space-size=3072\" next build --webpack"
```

> **KRYTYCZNE — `--webpack`.** Next 16 domyślnie używa Turbopacka. `withPayload`
> wstrzykuje własny webpack config, co powoduje KONFLIKT z Turbopackiem (build
> pada cicho, długo miele, exit 1 bez błędu). Flaga `--webpack` wymusza webpack
> i rozwiązuje konflikt. Log ma pokazać `(webpack)`, nie `(Turbopack)`.

> **PUŁAPKA — OOM.** Payload+Next build jest pamięciożerny. `max-old-space-size`
> MUSI być mniejszy niż fizyczny RAM serwera (zostaw ~1GB systemowi). Na 2GB
> serwerze build padnie (za mało). Minimum praktyczne: 4GB RAM, `size=3072`.
> Objaw OOM: build miele 100+s, potem cichy exit bez błędu.

> **next.config.ts** — jeśli masz webpack config (np. extensionAlias),
> `withPayload` i tak doda swój. Blok `turbopack: { root }` może zostać (jest
> ignorowany przy `--webpack`).

**Weryfikacja lokalna przed deployem:**

```bash
rm -rf .next
cross-env NODE_OPTIONS="--no-deprecation --max-old-space-size=3072" next build --webpack
```

Jeśli lokalnie przechodzi a serwer nie — problem środowiskowy (zmienne, RAM,
wersje). Odtwórz środowisko serwera: `rm -rf node_modules && pnpm i --frozen-lockfile`.

---

## 17. Deployment (Coolify/Docker) — zmienne, baza

**Zmienne środowiskowe (Coolify):**

- `PAYLOAD_SECRET` — WYMAGANE w RUNTIME (nie tylko build). Bez niego panel
  /admin pada z „missing secret key" (digest 4030070955).
- `DATABASE_URL` — connection string bazy.
- `NEXT_PUBLIC_SERVER_URL` — dla canonical/sitemap. WYMAGANE w BUILD (bo
  `NEXT_PUBLIC_*` wstrzykiwane przy budowaniu).

> **KRYTYCZNE — sekcja zmiennych.** W Coolify zmienne runtime MUSZĄ być w
> głównej sekcji „Environment Variables" z zaznaczonym „Available at Runtime".
> NIE w „Preview Deployments Environment Variables" (osobna sekcja dla
> podglądowych). Sekret w złej sekcji = panel dalej pada.

> **KRYTYCZNE — baza produkcyjna.** SQLite plik (`file:./x.db`) to ZŁA baza w
> Dockerze: kontener efemeryczny, plik znika przy redeploy; commitowanie bazy do
> repo NADPISUJE dane produkcyjne przy każdym deploy. Użyj Postgres
> (`@payloadcms/db-postgres`, Coolify stawia go jednym kliknięciem).

**Node na serwerze:** 22 (nixpacks `NIXPACKS_NODE_VERSION=22`).

**Rejestr:** publiczny, serwer NIE potrzebuje tokenu. `.npmrc` w repo wystarcza.

---

## 18. Publikowanie nowych wersji pluginu

Dotyczy tylko developmentu pluginu. Publikacja WYMAGA tokenu `write:package`.

```bash
# ~/.npmrc (nie npm adduser — prowadzi do npmjs.com):
# //git.intecion.net/api/packages/IntecionSoftware/npm/:_authToken=TOKEN

cd ~/payload-cms/ipal-kit
git add -A && git commit -m "..."     # commit PRZED version (inaczej "working directory not clean")
pnpm clean && pnpm build
# potwierdź, że dist ma zmiany, np:
grep -c "nowaFunkcja" dist/modules/.../plik.js
npm version patch                      # 1.0.1 → 1.0.2
npm publish
git push && git push --tags
```

Token generujesz w Gitea → Settings → Applications → scope `write:package`.

**W projekcie po publikacji:**

```bash
pnpm add @intecion/ipal-kit@1.0.2      # jawna wersja, pewniejsze niż @latest
# potwierdź:
cat node_modules/@intecion/ipal-kit/package.json | grep version
```

> **PUŁAPKA — pnpm cache.** `pnpm add @latest` czasem bierze z cache. Jeśli
> projekt ma starą wersję po instalacji:
> `pnpm store prune && rm -rf node_modules pnpm-lock.yaml && pnpm install`.

> **ZAWSZE weryfikuj, że projekt wciągnął nową wersję** — grep konkretnej
> funkcji w `node_modules/@intecion/ipal-kit/dist/...`. Zmiana w źródłach
> pluginu nie działa, dopóki nie jest: zbudowana → opublikowana → wciągnięta.

---

## 19. Checklisty i najczęstsze błędy

**Checklist nowego projektu:**

1. [ ] `.npmrc` z `@intecion:registry` (publiczny, bez tokenu)
2. [ ] `pnpm add @intecion/ipal-kit` + weryfikacja czystej ścieżki
3. [ ] Zależności: seo, form-builder, nodemailer, lucide-react@^0.400.0, server-only
4. [ ] `i18n.config.ts` z `as const satisfies I18nConfig`
5. [ ] `payload.config.ts` z `ipalKit({ i18n, access, pages, content, seo, forms })`
6. [ ] `lib/content.ts` — createContentHelpers (config=payload, i18n osobno)
7. [ ] `lib/payload.ts` — funkcje projektu, import getCachedPayload z content
8. [ ] `proxy.ts` — guard `if (result.cookie)`, cookie w obu gałęziach, matcher inline
9. [ ] `[[...slug]]/page.tsx` — resolveRoute(3 args), enhanceProps wstrzykuje turnstile
10. [ ] `[locale]/layout.tsx` — ConsentProvider, komponenty consent, getConsentTexts(config=i18n)
11. [ ] Bloki — NIE importują lib (enhanceProps), getPayload przez @payload-config
12. [ ] build script z `--webpack`, max-old-space-size < RAM serwera
13. [ ] Coolify: PAYLOAD_SECRET + DATABASE_URL w RUNTIME (główna sekcja)
14. [ ] Baza: Postgres (nie SQLite plik)

**Najczęstsze błędy → przyczyna:**

| Błąd | Przyczyna |
|---|---|
| `404` na `pnpm add @intecion/...` | brak `@intecion:registry` w `.npmrc` |
| `Could not find module ... React Client Manifest` | instalacja z gita, nie rejestru |
| dwie wersje `lucide-react` | projekt pinuje inną major niż `^0.400.0` |
| `missing secret key` (4030070955) | `PAYLOAD_SECRET` nie w runtime (albo zła sekcja Coolify) |
| build cichy exit po 100+s | OOM (max-old-space-size > RAM) LUB Turbopack (brak --webpack) |
| `Cannot access '{default export}' before initialization` | cykl: blok importuje lib → content → config → blok |
| `TS2322 JsonObject not assignable to SanitizedConfig` | config=i18n zamiast payload w createContentHelpers |
| `Expected 3 arguments, got 2` (resolveRoute) | brak `page` (3. arg) |
| `JsonObject missing id, siteName...` (Header settings) | getSettings nietypowane — użyj getSiteSettings<SiteSetting> |
| `readonly cannot be assigned to mutable` | `as const` na danych do payload.create (użyj jawnego typu) |
| `FreeQuote1 not assignable to FreeQuote` | import bloku zamiast globala (użyj FreeQuote1 / interfaceName) |
| Turnstile `string \| null` błąd | useState<string> zamiast <string \| null> |
| middleware deprecated warning | migruj middleware.ts → proxy.ts (codemod) |

**Zasady, których NIGDY nie łam:**

- Logika w pluginie, projekt podłącza i styluje
- Jedno źródło `getCachedPayload` (content.ts)
- Nigdy nie hardkoduj locale (`as never`, nie `as 'pl'|'en'`) ani slug kolekcji
- Generyki `getSiteIntegrations<T>` / `getSiteSettings<T>` przy WYWOŁANIU
- Bloki NIE importują lib (enhanceProps wstrzykuje dane)
- `--webpack` w buildzie, Postgres na produkcji, sekret w runtime
- Instalacja z rejestru (czysta ścieżka), nie z gita
- Zawsze weryfikuj, że projekt wciągnął nową wersję pluginu (grep w node_modules)

---

**Koniec instrukcji.** W razie wątpliwości co do konkretnego modułu, zajrzyj do
`docs/` w repo pluginu (access, analytics, blocks, consent, content, email,
forms, i18n, pages, seo, slug, turnstile — każdy moduł ma osobny plik).
