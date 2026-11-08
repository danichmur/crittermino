import type { Metadata } from 'next'
import Link from 'next/link'
import { BlogLanguages } from '@/components/Content/BlogLanguages'
import { ContentPage } from '@/components/Layout/ContentPage'
import { JsonLd } from '@/components/Seo/JsonLd'
import { formatPublished, localizePosts } from '@/lib/blog'
import { copy } from '@/lib/i18n'
import { localizeHref, type Locale } from '@/lib/locale'
import { getLocale, getPathLocale } from '@/lib/locale-server'
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

const INDEX_KEYWORDS: Record<Locale, readonly string[]> = {
  en: ['fillomino tutorial', 'how to solve fillomino', 'free logic puzzle games', 'crittermino'],
  ru: ['как решать филломино', 'филломино и судоку', 'бесплатные логические игры', 'crittermino'],
  es: ['cómo resolver fillomino', 'fillomino y sudoku', 'juegos de lógica gratis', 'crittermino'],
}

export const generateMetadata = async (): Promise<Metadata> => {
  const articleLocale = (await getPathLocale()) ?? 'en'
  const text = copy[articleLocale]
  return pageMeta({
    title: text.blogMetaTitle,
    description: text.blogMetaDescription,
    path: '/blog',
    locale: articleLocale,
    keywords: INDEX_KEYWORDS[articleLocale],
  })
}

export default async function BlogIndexPage() {
  const articleLocale = (await getPathLocale()) ?? 'en'
  const ui = copy[await getLocale()]
  const text = copy[articleLocale]
  const posts = localizePosts(articleLocale)
  const homePath = localizeHref(articleLocale, '/')
  const blogPath = localizeHref(articleLocale, '/blog')
  const crumbs = [
    { name: text.home, path: homePath },
    { name: text.blog, path: blogPath },
  ] as const
  return (
    <ContentPage crumbs={crumbs.map((crumb) => ({ href: crumb.path === blogPath ? undefined : crumb.path, label: crumb.name }))}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: text.blogName,
          url: `${SITE.url}${blogPath}`,
          inLanguage: articleLocale,
          description: text.blogMetaDescription,
          blogPost: posts.map((post) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            url: `${SITE.url}${localizeHref(articleLocale, `/blog/${post.slug}`)}`,
            datePublished: post.published,
            inLanguage: articleLocale,
          })),
        }}
      />
      <h1 className="font-display text-4xl font-bold">{text.blogHeading}</h1>
      <p className="mt-3 leading-relaxed text-[#8C7468]">{text.blogLead}</p>
      {articleLocale === 'en' && ui.blogEnglishNote ? (
        <p className="mt-2 text-sm font-medium text-[#E84B7F]">{ui.blogEnglishNote}</p>
      ) : null}
      <BlogLanguages path="/blog" locale={articleLocale} />
      <ul className="mt-6 grid gap-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={localizeHref(articleLocale, `/blog/${post.slug}`)}
              className="block rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
            >
              <time dateTime={post.published} className="text-xs font-semibold tracking-wide text-[#E84B7F] uppercase">
                {formatPublished(post.published, articleLocale)}
              </time>
              <h2 className="mt-1 font-display text-xl font-bold">{post.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-[#8C7468]">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </ContentPage>
  )
}
