import type { Metadata } from 'next'
import { copy } from '@/lib/i18n'
import type { Locale } from '@/lib/locale'
import { SITE } from '@/lib/site'

interface PageMetaInput {
  title: string
  description: string
  path: string
  keywords?: readonly string[]
  published?: string
}

/** Title, description, canonical, and social cards for a content URL. */
export const pageMeta = ({ title, description, path, keywords, published }: PageMetaInput): Metadata => ({
  title,
  description,
  ...(keywords ? { keywords: [...keywords] } : {}),
  alternates: { canonical: path },
  openGraph: published
    ? {
        title,
        description,
        url: path,
        type: 'article',
        publishedTime: published,
        images: ['/og-image.png'],
      }
    : {
        title,
        description,
        url: path,
        type: 'website',
        images: ['/og-image.png'],
      },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
  },
})

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
