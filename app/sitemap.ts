import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog'
import { LOCALES, localizeHref, type Locale } from '@/lib/locale'
import { SITE } from '@/lib/site'

const publishedOn = (isoDate: string): Date => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(year ?? 2026, (month ?? 1) - 1, day ?? 1))
}

const blogLanguages = (path: string): Record<Locale, string> => ({
  en: `${SITE.url}${path}`,
  ru: `${SITE.url}${localizeHref('ru', path)}`,
  es: `${SITE.url}${localizeHref('es', path)}`,
})

const blogEntries = (latestPost: string): MetadataRoute.Sitemap => {
  const pages = [
    { path: '/blog', lastModified: publishedOn(latestPost), changeFrequency: 'weekly' as const },
    ...BLOG_POSTS.map((post) => ({
      path: `/blog/${post.slug}`,
      lastModified: publishedOn(post.updated ?? post.published),
      changeFrequency: 'monthly' as const,
    })),
  ]
  return LOCALES.flatMap((locale) =>
    pages.map((page) => ({
      url: `${SITE.url}${localizeHref(locale, page.path)}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: 0.6,
      alternates: { languages: blogLanguages(page.path) },
    })),
  )
}

export default function sitemap(): MetadataRoute.Sitemap {
  const contentUpdated = publishedOn('2026-11-10')
  const latestPost = BLOG_POSTS.reduce((latest, post) => {
    const stamp = post.updated ?? post.published
    return stamp > latest ? stamp : latest
  }, '2026-11-07')
  return [
    { url: SITE.url, lastModified: contentUpdated, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/how-to-play`, lastModified: contentUpdated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/daily-challenge`, lastModified: contentUpdated, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE.url}/about`, lastModified: contentUpdated, changeFrequency: 'monthly', priority: 0.5 },
    ...blogEntries(latestPost),
    { url: `${SITE.url}/privacy`, lastModified: contentUpdated, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
