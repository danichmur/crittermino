import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/Layout/ContentPage'
import { JsonLd } from '@/components/Seo/JsonLd'
import { BLOG_POSTS, formatPublished } from '@/lib/blog'
import { copy } from '@/lib/i18n'
import { getLocale } from '@/lib/locale-server'
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const generateMetadata = async (): Promise<Metadata> => {
  const text = copy[await getLocale()]
  return pageMeta({
    title: text.blogMetaTitle,
    description: text.blogMetaDescription,
    path: '/blog',
    keywords: ['fillomino strategy', 'logic puzzle', 'crittermino'],
  })
}

export default async function BlogIndexPage() {
  const text = copy[await getLocale()]
  const crumbs = [
    { name: text.home, path: '/' },
    { name: text.blog, path: '/blog' },
  ] as const
  return (
    <ContentPage crumbs={crumbs.map((crumb) => ({ href: crumb.path === '/blog' ? undefined : crumb.path, label: crumb.name }))}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: text.blogName,
          url: `${SITE.url}/blog`,
          description: text.blogMetaDescription,
          blogPost: BLOG_POSTS.map((post) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            url: `${SITE.url}/blog/${post.slug}`,
            datePublished: post.published,
          })),
        }}
      />
      <h1 className="font-display text-4xl font-bold">{text.blogHeading}</h1>
      <p className="mt-3 leading-relaxed text-[#8C7468]">{text.blogLead}</p>
      {text.blogEnglishNote ? <p className="mt-2 text-sm font-medium text-[#E84B7F]">{text.blogEnglishNote}</p> : null}
      <ul className="mt-6 grid gap-3">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
            >
              <time dateTime={post.published} className="text-xs font-semibold tracking-wide text-[#E84B7F] uppercase">
                {formatPublished(post.published)}
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
