import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleBody } from '@/components/Content/ArticleBody'
import { ContentPage } from '@/components/Layout/ContentPage'
import { PlayLink } from '@/components/Layout/PlayLink'
import { JsonLd } from '@/components/Seo/JsonLd'
import { BLOG_POSTS, formatPublished, getPost } from '@/lib/blog'
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = (): Array<{ slug: string }> => BLOG_POSTS.map((post) => ({ slug: post.slug }))

export const generateMetadata = async ({ params }: ArticlePageProps): Promise<Metadata> => {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Article not found' }
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    published: post.published,
  })
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ] as const
  const related = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3)
  return (
    <ContentPage
      crumbs={crumbs.map((crumb) => ({
        href: crumb.path === `/blog/${post.slug}` ? undefined : crumb.path,
        label: crumb.name,
      }))}
    >
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          datePublished: post.published,
          dateModified: post.published,
          mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
          image: [`${SITE.url}/og-image.png`],
          author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
        }}
      />
      <time dateTime={post.published} className="text-xs font-semibold tracking-wide text-[#E84B7F] uppercase">
        {formatPublished(post.published)}
      </time>
      <h1 className="mt-2 font-display text-4xl font-bold">{post.title}</h1>
      <p className="mt-3 leading-relaxed text-[#8C7468]">{post.description}</p>
      <ArticleBody sections={post.sections} />
      <div className="mt-10">
        <PlayLink>Play a level</PlayLink>
        <Link
          href="/daily-challenge"
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center font-display font-semibold text-[#3D2C29] underline-offset-4 hover:underline"
        >
          Play today’s puzzle
        </Link>
      </div>
      <section className="mt-10" aria-labelledby="more-notes">
        <h2 id="more-notes" className="font-display text-2xl font-bold">
          More notes
        </h2>
        <ul className="mt-3 grid gap-2">
          {related.map((item) => (
            <li key={item.slug}>
              <Link href={`/blog/${item.slug}`} className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ContentPage>
  )
}
