import type { Metadata } from 'next'
import { SITE } from '@/lib/site'

interface PageMetaInput {
  title: string
  description: string
  path: string
  keywords?: readonly string[]
  published?: string
}

export const HOME_FAQS = [
  {
    question: 'Is Crittermino free?',
    answer:
      'Yes. It is a free logic puzzle online. You play in the browser. There is no download, no account, and no ads.',
  },
  {
    question: 'What kind of puzzle is it?',
    answer:
      'Crittermino is a Fillomino game. Mouse homes are 2 cells, cat 3, dog 4, panda 5, and lion 6. A home is connected edge to edge. Two homes of the same size cannot share a wall.',
  },
  {
    question: 'Do I need to install it?',
    answer:
      'No. This brain puzzle needs no download. You can add it to your home screen later if you want the same game a tap away.',
  },
  {
    question: 'Is there a daily puzzle?',
    answer:
      'Yes. The daily challenge is one grid for every player. It changes at 00:00 UTC. Clearing it does not skip your campaign level.',
  },
  {
    question: 'Where are the rules?',
    answer:
      'The how to play page has the rules, two shape examples, and a tiny board you can fill yourself.',
  },
] as const

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

export const homeJsonLd = () => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
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
    mainEntity: HOME_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  },
]
