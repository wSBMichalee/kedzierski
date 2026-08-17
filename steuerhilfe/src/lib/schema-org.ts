// src/lib/schema-org.ts

// TODO: W przyszłości pobieraj dane z Payload CMS globala 'company' (przez enhanceProps lub przekazywanie z layoutu)
const COMPANY_PLACEHOLDER = {
  name: 'steuerlotse',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.steuerlotse.de',
  logoUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.steuerlotse.de'}/logo.png`,
  telephone: '+49 123 456789',
  address: {
    streetAddress: 'Musterstraße 1',
    addressLocality: 'Musterstadt',
    postalCode: '12345',
    addressCountry: 'DE',
  },
  sameAs: [
    'https://www.facebook.com/steuerlotse',
  ],
}

/**
 * Zwraca schemat organizacji (Lohnsteuerhilfeverein -> AccountingService)
 */
export function getOrganizationSchema(companyData?: any) {
  // Jeśli przekażesz prawdziwe dane z CMS, zmapuj je tutaj. Na razie placeholder.
  const data = companyData || COMPANY_PLACEHOLDER

  const streetAddress = data?.address?.streetAddress ?? ''

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: data?.name ?? 'steuerlotse',
    url: data?.url ?? process.env.NEXT_PUBLIC_SITE_URL,
    logo: data?.logo?.url ?? data?.logoUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.steuerlotse.de'}/logo.png`,
    telephone: data?.telephone ?? '',
    sameAs: data?.sameAs ?? [],
  }

  if (streetAddress) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: data?.address?.addressLocality ?? '',
      postalCode: data?.address?.postalCode ?? '',
      addressCountry: data?.address?.addressCountry ?? 'DE',
    }
  }

  return schema
}

/**
 * Zwraca schemat strony głównej (WebSite)
 */
export function getWebsiteSchema(companyData?: any) {
  const data = companyData || COMPANY_PLACEHOLDER

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data?.name ?? 'steuerlotse',
    url: data?.url ?? process.env.NEXT_PUBLIC_SITE_URL,
    inLanguage: 'de-DE',
  }
}

/**
 * Zwraca schemat sekcji FAQ (FAQPage)
 */
export function getFaqSchema(items: { question: string; answer: string }[]) {
  if (!items || items.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
