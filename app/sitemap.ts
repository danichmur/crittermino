import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog'
import { SITE } from '@/lib/site'

const publishedOn = (isoDate: string): Date => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(year ?? 2026, (month ?? 1) - 1, day ?? 1))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const contentUpdated = publishedOn('2026-11-07')
  return [
    { url: SITE.url, lastModified: contentUpdated, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/how-to-play`, lastModified: contentUpdated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/daily-challenge`, lastModified: contentUpdated, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE.url}/about`, lastModified: contentUpdated, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/blog`, lastModified: contentUpdated, changeFrequency: 'weekly', priority: 0.6 },
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: publishedOn(post.published),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    { url: `${SITE.url}/privacy`, lastModified: contentUpdated, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
