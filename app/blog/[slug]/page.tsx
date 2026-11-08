import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleBody } from '@/components/Content/ArticleBody'
import { BlogLanguages } from '@/components/Content/BlogLanguages'
import { prefixRichText, richText, stripRichText } from '@/components/Content/RichText'
import { ContentPage } from '@/components/Layout/ContentPage'
import { PlayLink } from '@/components/Layout/PlayLink'
import { JsonLd } from '@/components/Seo/JsonLd'
import { BLOG_POSTS, formatPublished, getLocalizedPost, localizePosts } from '@/lib/blog'
import { copy } from '@/lib/i18n'
import { localizeHref } from '@/lib/locale'
import { getLocale, getPathLocale } from '@/lib/locale-server'
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = (): Array<{ slug: string }> => BLOG_POSTS.map((post) => ({ slug: post.slug }))

export const generateMetadata = async ({ params }: ArticlePageProps): Promise<Metadata> => {
  const { slug } = await params
  const articleLocale = (await getPathLocale()) ?? 'en'
  const post = getLocalizedPost(slug, articleLocale)
  const text = copy[articleLocale]
  if (!post) return { title: text.articleNotFound }
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    locale: articleLocale,
    keywords: post.keywords,
    published: post.published,
    modified: post.updated ?? post.published,
  })
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const articleLocale = (await getPathLocale()) ?? 'en'
  const post = getLocalizedPost(slug, articleLocale)
  if (!post) notFound()
  const ui = copy[await getLocale()]
  const text = copy[articleLocale]
  const homePath = localizeHref(articleLocale, '/')
  const blogPath = localizeHref(articleLocale, '/blog')
  const postPath = localizeHref(articleLocale, `/blog/${post.slug}`)
  const crumbs = [
    { name: text.home, path: homePath },
    { name: text.blog, path: blogPath },
    { name: post.title, path: postPath },
  ] as const
  const related = localizePosts(articleLocale).filter((item) => item.slug !== post.slug).slice(0, 3)
  return (
    <ContentPage
      crumbs={crumbs.map((crumb) => ({
        href: crumb.path === postPath ? undefined : crumb.path,
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
          inLanguage: articleLocale,
          datePublished: post.published,
          dateModified: post.updated ?? post.published,
          mainEntityOfPage: `${SITE.url}${postPath}`,
          image: [`${SITE.url}/og-image.png`],
          author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
        }}
      />
      <time dateTime={post.updated ?? post.published} className="text-xs font-semibold tracking-wide text-[#E84B7F] uppercase">
        {formatPublished(post.updated ?? post.published, articleLocale)}
      </time>
      <h1 className="mt-2 font-display text-4xl font-bold">{post.title}</h1>
      <p className="mt-3 leading-relaxed text-[#8C7468]">{post.description}</p>
      {articleLocale === 'en' && ui.blogEnglishNote ? (
        <p className="mt-2 text-sm font-medium text-[#E84B7F]">{ui.blogEnglishNote}</p>
      ) : null}
      <BlogLanguages path={`/blog/${post.slug}`} locale={articleLocale} />
      <ArticleBody sections={post.sections} locale={articleLocale} />
      {post.faqs && post.faqs.length > 0 ? (
        <section className="mt-10" aria-labelledby="article-faq">
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              inLanguage: articleLocale,
              mainEntity: post.faqs.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: stripRichText(item.answer) },
              })),
            }}
          />
          <h2 id="article-faq" className="font-display text-2xl font-bold">
            {text.questions}
          </h2>
          <dl className="mt-3 grid gap-3">
            {post.faqs.map((item) => (
              <div key={item.question} className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
                <dt className="font-display text-lg font-bold">{item.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-[#8C7468]">{richText(prefixRichText(item.answer, articleLocale))}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      <div className="mt-10">
        <PlayLink href={homePath}>{text.playALevel}</PlayLink>
        <Link
          href={localizeHref(articleLocale, '/daily-challenge')}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center font-display font-semibold text-[#3D2C29] underline-offset-4 hover:underline"
        >
          {text.playToday}
        </Link>
      </div>
      <section className="mt-10" aria-labelledby="more-notes">
        <h2 id="more-notes" className="font-display text-2xl font-bold">
          {text.moreNotes}
        </h2>
        <ul className="mt-3 grid gap-2">
          {related.map((item) => (
            <li key={item.slug}>
              <Link
                href={localizeHref(articleLocale, `/blog/${item.slug}`)}
                className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ContentPage>
  )
}
