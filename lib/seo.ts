import type { Metadata } from 'next'
import { copy } from '@/lib/i18n'
import { localizeHref, type Locale } from '@/lib/locale'
import { SITE } from '@/lib/site'

interface PageMetaInput {
  title: string
  description: string
  path: string
  keywords?: readonly string[]
  published?: string
  modified?: string
  locale?: Locale
}

const languageAlternates = (path: string): Record<string, string> => ({
  en: path,
  ru: localizeHref('ru', path),
  es: localizeHref('es', path),
  'x-default': path,
})

/** Title, description, canonical, and social cards for a content URL. */
export const pageMeta = ({ title, description, path, keywords, published, modified, locale }: PageMetaInput): Metadata => {
  const canonical = locale ? localizeHref(locale, path) : path
  return {
  title,
  description,
  ...(keywords ? { keywords: [...keywords] } : {}),
  alternates: locale ? { canonical, languages: languageAlternates(path) } : { canonical },
  openGraph: published
    ? {
        title,
        description,
        url: canonical,
        type: 'article',
        publishedTime: published,
        ...(modified ? { modifiedTime: modified } : {}),
        images: ['/og-image.png'],
      }
    : {
        title,
        description,
        url: canonical,
        type: 'website',
        images: ['/og-image.png'],
      },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
  },
  }
}

export const breadcrumbJsonLd = (crumbs: ReadonlyArray<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.path === '/' ? SITE.url : `${SITE.url}${crumb.path}`,
  })),
})

export const homeJsonLd = (locale: Locale) => {
  const text = copy[locale]
  return [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: text.metaDescription,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: SITE.name,
    url: SITE.url,
    description: text.metaDescription,
    genre: 'Puzzle',
    playMode: 'SinglePlayer',
    gamePlatform: 'Web Browser',
    applicationCategory: 'Game',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: text.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  },
]
}
