import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/Layout/ContentPage'
import { JsonLd } from '@/components/Seo/JsonLd'
import { BLOG_POSTS, formatPublished } from '@/lib/blog'
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

const title = 'Puzzle strategies'
const description =
  'Notes on solving Fillomino, playing Crittermino, and how this puzzle differs from Sudoku. Free to read, then play in the browser.'

export const metadata: Metadata = pageMeta({
  title,
  description,
  path: '/blog',
  keywords: ['fillomino strategy', 'logic puzzle', 'crittermino'],
})

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
] as const

export default function BlogIndexPage() {
  return (
    <ContentPage crumbs={crumbs.map((crumb) => ({ href: crumb.path === '/blog' ? undefined : crumb.path, label: crumb.name }))}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Crittermino blog',
          url: `${SITE.url}/blog`,
          description,
          blogPost: BLOG_POSTS.map((post) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            url: `${SITE.url}/blog/${post.slug}`,
            datePublished: post.published,
          })),
        }}
      />
      <h1 className="font-display text-4xl font-bold">Strategies</h1>
      <p className="mt-3 leading-relaxed text-[#8C7468]">
        How to solve a Fillomino board, how the animals in Crittermino behave, and a few other puzzles worth a sitting.
      </p>
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
