# Zasady dla Antigravity — budowa aplikacji Payload + ipal-kit

Dokument definiuje ŚCISŁE zasady, których agent Antigravity MUSI przestrzegać
przy budowie aplikacji Payload CMS z pluginem `@intecion/ipal-kit`, oraz podaje
implementację krok po kroku.

**Nadrzędna zasada projektu: NIC NA SZTYWNO.** Żaden tekst, żadne zdjęcie, żadna
etykieta, żaden link widoczny na stronie nie może być zakodowany w komponencie.
WSZYSTKO idzie przez panel administracyjny i bazę danych, lokalizowane per język.
Redaktor treści musi móc zmienić każdy widoczny element bez dotykania kodu.

Ten dokument uzupełnia `ANTIGRAVITY-INSTRUKCJA-IPAL.md` (architektura, setup).
Tamten mówi CO zbudować. Ten mówi JAK się zachowywać i czego NIGDY nie robić.

---

## CZĘŚĆ A — ZASADY ZACHOWANIA AGENTA (ściśle przestrzegać)

### A1. Nic na sztywno — treść

**ZAKAZANE:**
- Tekst widoczny dla użytkownika zaszyty w JSX (`<h1>Witaj</h1>`, `<button>Wyślij</button>`)
- Etykiety, nagłówki, opisy, komunikaty, teksty przycisków zakodowane w komponencie
- Teksty warunkowe zależne od języka przez `if (locale === 'pl') ... else ...`
- Tablice/obiekty z tekstami w plikach kodu (`const texts = { pl: {...}, en: {...} }`)

**WYMAGANE:**
- Każdy widoczny tekst pochodzi z pola Payload z `localized: true`
- Tekst pobierany server-side z globala/kolekcji i przekazywany do komponentu
- Fallback (gdy pole puste) dozwolony TYLKO jako wartość domyślna w kodzie
  pluginu/helpera, nigdy jako podstawowe źródło treści

### A2. Nic na sztywno — obrazy

**ZAKAZANE:**
- `import logo from '@/assets/logo.png'` i użycie w komponencie
- Ścieżki do obrazów zaszyte w kodzie (`src="/images/hero.jpg"`)
- Obrazy w `public/` używane jako treść strony (dozwolone tylko favicon-fallback,
  ikony techniczne, placeholdery systemowe)

**WYMAGANE:**
- Każdy obraz treściowy to pole `type: 'upload', relationTo: 'media'` w Payload
- Obraz pobierany jako relacja (z `depth >= 1`), renderowany z `media.url`
- Warianty rozmiarów przez konfigurację Media w Payload, nie ręczne pliki

### A3. Nic na sztywno — linki i nawigacja

**ZAKAZANE:**
- `<a href="/pl/kontakt">` — ścieżka zaszyta
- Menu/nawigacja jako tablica w kodzie
- Linki do stron systemowych budowane ręcznie

**WYMAGANE:**
- Ścieżki stron systemowych przez `getSystemPagePath({ page, locale, config })`
- Nawigacja z globala/kolekcji w panelu (np. global `header` z polami linków)
- Linki wewnętrzne jako relacje do stron (relationship → pages), nie stringi

### A4. Nic na sztywno — konfiguracja

**ZAKAZANE:**
- Kody locale zaszyte (`locale as 'pl' | 'en'`, `if (locale === 'pl')`)
- Slug kolekcji zaszyty (`collection: 'pages'` gdy plugin przyjmuje `pagesSlug`)
- Nazwy globali/pól rozsiane po kodzie jako magic strings
- Kolory, breakpointy, teksty marki w wielu miejscach

**WYMAGANE:**
- Locale zawsze `as never` (agnostyczne) albo z `getConfiguredLocales()`
- Slug kolekcji z konfiguracji pluginu
- Dane firmy (nazwa, NIP, adres, kontakt) z globala `company`, nie z kodu

### A5. Zasady architektoniczne (z pluginu)

- Logika w pluginie — projekt podłącza i styluje, nie duplikuje
- Jedno źródło `getCachedPayload` (`lib/content.ts`)
- Bloki NIE importują `lib/*` — dane wstrzykiwane przez `enhanceProps`
- Generyki `getSiteIntegrations<T>` / `getSiteSettings<T>` przy WYWOŁANIU
- Helpery pluginu z JEDNEGO miejsca (`lib/content.ts`), nie rozproszone

### A6. Zasady procesu (jak agent ma pracować)

1. **Nie zgaduj sygnatur pluginu.** Sprawdź typ/eksport w
   `node_modules/@intecion/ipal-kit/dist/*.d.ts` przed użyciem funkcji.
2. **Weryfikuj po każdej zmianie pluginu**, że projekt wciągnął nową wersję
   (grep funkcji w `node_modules/.../dist`). Zmiana w źródłach nie działa,
   dopóki nie: zbudowana → opublikowana → wciągnięta.
3. **Buduj lokalnie przed deployem** (`next build --webpack`). Jeśli lokalnie
   przechodzi a serwer nie — problem środowiskowy (zmienne/RAM/wersje).
4. **Nie twórz plików-duplikatów** logiki pluginu (`resolvePage`,
   własne `getConfiguredLocales`). Użyj tego, co plugin daje.
5. **Przy błędzie typu — napraw u ŹRÓDŁA**, nie łataj `as any` / `@ts-ignore`.
6. **Commituj `pnpm-lock.yaml` i `.npmrc`** — deployment ich potrzebuje.
7. **Nie hardkoduj sekretów** w kodzie ani `.npmrc` (rejestr publiczny — token
   tylko do publikacji, w `~/.npmrc`, nigdy w repo).

---

## CZĘŚĆ B — MECHANIZMY „WSZYSTKO PRZEZ PANEL" (jak realizować A1–A3)

Plugin sam stosuje te wzorce (consent texts, favicon, logo) — naśladuj je.

### B1. Tekst lokalizowany → pole `localized: true`

Każdy tekst = pole z `localized: true`. Payload przechowuje osobną wartość per
język. Przykład pola w globalu/bloku:

```ts
{
  name: 'heading',
  type: 'text',
  localized: true,           // ← osobna wartość per locale
}
// dłuższy tekst:
{ name: 'intro', type: 'textarea', localized: true }
// treść bogata (formatowanie):
{ name: 'body', type: 'richText', localized: true }
```

Pobranie i render (server component):
```ts
const settings = await getSettings(locale)   // locale wybiera wersję językową
// <h1>{settings.heading}</h1>  ← tekst z panelu, nie z kodu
```

RichText renderujesz komponentem `RichText` (projekt) — treść z pola, nie z kodu.

### B2. Obraz → pole `upload` + relationTo media

```ts
{
  name: 'heroImage',
  type: 'upload',
  relationTo: 'media',
}
```

Pobranie (z `depth >= 1`, żeby dostać obiekt, nie ID) i render:
```ts
const settings = await getSettings(locale)   // getSettings ma depth: 2
const hero = settings.heroImage
if (hero && typeof hero === 'object' && hero.url) {
  // <img src={hero.url} alt={hero.alt} />  ← obraz z panelu
}
```

> Warianty rozmiarów (AVIF/WebP, thumbnaile) konfiguruj w kolekcji Media
> (`imageSizes`), nie generuj ręcznie plików.

### B3. Link → relationship do strony albo getSystemPagePath

Link wewnętrzny jako relacja (redaktor wybiera stronę w panelu):
```ts
{
  name: 'ctaTarget',
  type: 'relationship',
  relationTo: 'pages',
}
```
Render — zbuduj ścieżkę z wybranej strony (locale-aware), nie hardkoduj:
```ts
// dla stron systemowych:
const href = getSystemPagePath({ page: settings.privacyPolicy, locale, config: i18nConfig })
```

Nawigacja (menu) = pole `array` linków w globalu `header`, każdy link to
relationship do strony + opcjonalna etykieta (localized). Redaktor układa menu
w panelu.

### B4. Dane firmy → global `company`

Nazwa, NIP, REGON, adres, telefon, email, godziny — WSZYSTKO w globalu `company`
(pola, część localized jeśli trzeba). Stopka, sekcja kontakt, schema.org czytają
z tego globala. NIGDY nie wpisuj danych firmy w kodzie.

### B5. Teksty UI (komunikaty, etykquiety) → global z fallbackiem

Wzorzec z `getConsentTexts`: global w panelu z tekstami per język + fallback w
helperze. Dla własnych tekstów UI (np. komunikaty formularza) stwórz analogiczny
global i helper. NIE zaszywaj komunikatów w komponencie.

---

## CZĘŚĆ C — IMPLEMENTACJA KROK PO KROKU

Kolejność ma znaczenie — każdy krok zależy od poprzednich.

### KROK 1 — Fundament projektu
1. Utwórz projekt Payload 3 + Next 16 (App Router), pnpm, Node 22.
2. `.npmrc`: `legacy-peer-deps=true` + `@intecion:registry=https://git.intecion.net/api/packages/IntecionSoftware/npm/`
3. `pnpm add @intecion/ipal-kit` — zweryfikuj czystą ścieżkę.
4. Zależności: `@payloadcms/plugin-seo @payloadcms/plugin-form-builder nodemailer lucide-react@^0.400.0 slugify server-only` + adapter Postgres + richtext.
5. `build` script z `--webpack` i `max-old-space-size` < RAM serwera.

### KROK 2 — i18n
1. `src/i18n.config.ts` — `i18nConfig` z `as const satisfies I18nConfig`.
2. `localization` w `payload.config.ts` zgodne z i18nConfig (te same kody).

### KROK 3 — Plugin w configu
1. `ipalKit({ i18n, access, pages, content, seo, forms })` w `plugins`.
2. `email: panelSmtpAdapter()`.
3. `db: postgresAdapter(...)` — NIE SQLite plik na produkcji.

### KROK 4 — Kolekcje i globale projektu (WSZYSTKO localized/upload)
1. Kolekcja `pages` — pola treści jako bloki (layout), każde pole tekstowe
   `localized: true`, każdy obraz `upload → media`.
2. Kolekcja `media` z `imageSizes` (warianty).
3. Global `company` — dane firmy (część localized).
4. Globale `header`, `footer` — nawigacja jako array relationship→pages +
   etykiety localized.
5. Bloki treści (`blocks/`) — każdy blok ma pola w panelu, komponent tylko
   renderuje przekazane dane. ZERO tekstu/obrazu na sztywno.

### KROK 5 — Warstwa lib (jedno źródło)
1. `lib/content.ts` — `createContentHelpers({ config: payloadConfig, content, i18n: i18nConfig })`.
2. `lib/payload.ts` — funkcje projektu (getCompany, getHeader, getFooter,
   getSettings typowane, getTurnstileSiteKey), import getCachedPayload z content.
3. NIE twórz `lib/pages.ts` ani `lib/locales.ts` (duplikaty).

### KROK 6 — Routing
1. `src/proxy.ts` — createLocaleMiddleware, guard `if (result.cookie)`, cookie
   w obu gałęziach, matcher inline.
2. `[[...slug]]/page.tsx` — resolveRoute(3 args), enhanceProps wstrzykuje
   turnstile/locale, render RenderBlocks z blockRegistry.
3. `[locale]/layout.tsx` — ConsentProvider + komponenty consent, header/footer
   z danymi z panelu.

### KROK 7 — Bloki (bez cykli, dane z panelu)
1. Każdy blok: `getPayload({ config })` przez `@payload-config` (leniwy alias).
2. Blok pobiera swoje globale/pola z panelu, renderuje.
3. Dane z helperów lib (turnstile) — przez enhanceProps, NIE import lib.
4. Teksty/obrazy bloku — z pól panelu, localized/upload.

### KROK 8 — Formularze
1. `actions.ts` — Server Action woła submitForm z `/server`.
2. FormRenderer — useState<string|null> dla tokenu, guard captcha z komunikatem
   (komunikat z panelu, nie na sztywno), reset tokenu po sukcesie.
3. Etykiety pól, przyciski, komunikaty — z konfiguracji formularza w panelu.

### KROK 9 — System Pages + linki
1. Utwórz strony (privacy, cookies, terms, homepage) w kolekcji pages.
2. Przypisz w panelu (SiteSettings → System Pages).
3. Linkuj w stopce przez getSystemPagePath — NIE hardkoduj ścieżek.

### KROK 10 — SEO
1. `createPageMetadata` w page.tsx, `NEXT_PUBLIC_SERVER_URL` ustawione.
2. `robots` z content helpers → `app/robots.ts`.
3. Metadane (title/description) z pól SEO w panelu, per język.

### KROK 11 — Weryfikacja „nic na sztywno"
Przejdź przez KAŻDY komponent i sprawdź:
- [ ] Zero tekstu widocznego dla użytkownika w JSX (wszystko z pól)
- [ ] Zero `import img from ...` obrazów treściowych (wszystko upload→media)
- [ ] Zero ścieżek `href="/..."` (relationship albo getSystemPagePath)
- [ ] Zero `if (locale === ...)` (localized fields robią to za Ciebie)
- [ ] Zero danych firmy w kodzie (global company)
- [ ] Zero magic strings slug/locale (konfiguracja/getConfiguredLocales)

### KROK 12 — Build i deployment
1. `rm -rf .next && next build --webpack` lokalnie — musi przejść.
2. Coolify: PAYLOAD_SECRET + DATABASE_URL w RUNTIME (główna sekcja),
   NEXT_PUBLIC_SERVER_URL w BUILD.
3. Postgres, nie SQLite plik.
4. Redeploy, sprawdź /admin i front.

---

## CZĘŚĆ D — TEST AKCEPTACYJNY „WSZYSTKO PRZEZ PANEL"

Aplikacja jest poprawna, jeśli redaktor może przez SAM panel (bez dotykania kodu):

1. Zmienić KAŻDY nagłówek, akapit, etykietę przycisku — per język
2. Podmienić KAŻDY obraz treściowy
3. Zmienić dane firmy (widoczne w stopce, kontakcie, schema.org)
4. Ułożyć nawigację (dodać/usunąć/przestawić linki)
5. Zmienić teksty banera cookies per język
6. Utworzyć nową stronę z bloków i opublikować
7. Zmienić metadane SEO (title/description) per strona, per język
8. Przypisać strony systemowe (privacy, cookies, terms)

Jeśli COKOLWIEK z powyższego wymaga zmiany w kodzie — zasada „nic na sztywno"
jest złamana i trzeba to naprawić: przenieść do pola panelu (localized/upload).

---

## PODSUMOWANIE ZASAD (kompas dla agenta)

1. **Nic na sztywno** — tekst, obraz, link, dane firmy: wszystko z panelu/DB
2. **Localized** — każdy tekst per język przez `localized: true`
3. **Upload → media** — każdy obraz jako relacja, nie import
4. **Logika w pluginie** — projekt podłącza i styluje
5. **Jedno źródło** — getCachedPayload z lib/content
6. **Bez cykli** — bloki nie importują lib (enhanceProps)
7. **Generyki przy wywołaniu** — getSiteIntegrations<T>, getSiteSettings<T>
8. **Bez hardkodu locale/slug** — as never, konfiguracja
9. **Napraw u źródła** — nie as any / ts-ignore
10. **Weryfikuj wersje** — grep w node_modules po każdej publikacji pluginu
11. **--webpack + Postgres + sekret w runtime** — na produkcji
12. **Test akceptacyjny** — redaktor zmienia wszystko przez panel
