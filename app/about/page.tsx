import type { Metadata } from 'next'
import { ContentPage } from '@/components/Layout/ContentPage'
import { PlayLink } from '@/components/Layout/PlayLink'
import { JsonLd } from '@/components/Seo/JsonLd'
import { copy } from '@/lib/i18n'
import { getLocale } from '@/lib/locale-server'
import { breadcrumbJsonLd, pageMeta, pageQueryKeywords } from '@/lib/seo'
import { SITE } from '@/lib/site'

const linkClass = 'font-semibold text-[#3D2C29] underline-offset-4 hover:underline'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  const text = copy[locale]
  return pageMeta({
    title: text.aboutMetaTitle,
    description: text.aboutMetaDescription,
    path: '/about',
    keywords: pageQueryKeywords.about[locale],
  })
}

export default async function AboutPage() {
  const text = copy[await getLocale()]
  const crumbs = [
    { name: text.home, path: '/' },
    { name: text.about, path: '/about' },
  ] as const
  return (
    <ContentPage crumbs={crumbs.map((crumb) => ({ href: crumb.path === '/about' ? undefined : crumb.path, label: crumb.name }))}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: text.aboutMetaTitle,
          url: `${SITE.url}/about`,
          description: text.aboutMetaDescription,
          isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
        }}
      />
      <h1 className="font-display text-4xl font-bold">{text.aboutMetaTitle}</h1>
      <p className="mt-3 leading-relaxed text-[#8C7468]">{text.aboutLead}</p>
      <section className="mt-8" aria-labelledby="fillomino-history">
        <h2 id="fillomino-history" className="font-display text-2xl font-bold">
          {text.aboutHistoryTitle}
        </h2>
        {text.aboutHistory.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="mt-3 leading-relaxed text-[#3D2C29]">
            {paragraph}
          </p>
        ))}
        <p className="mt-3 text-sm leading-relaxed text-[#8C7468]">
          {text.aboutSourceBefore}
          <a href="https://www.gmpuzzles.com/blog/fillomino-rules-and-info/" className={linkClass} rel="noreferrer">
            Grandmaster Puzzles
          </a>
          {text.aboutSourceAnd}
          <a href="https://wpcunofficial.miraheze.org/wiki/Fillomino" className={linkClass} rel="noreferrer">
            World Puzzle Championship wiki
          </a>
          {text.aboutSourceAlso}
          <a href="https://www.puzzles.wiki/wiki/Fillomino" className={linkClass} rel="noreferrer">
            Puzzles Wiki
          </a>
          {text.aboutSourceAfter}
        </p>
      </section>
      <section className="mt-8" aria-labelledby="why-animals">
        <h2 id="why-animals" className="font-display text-2xl font-bold">
          {text.aboutWhyTitle}
        </h2>
        <p className="mt-3 leading-relaxed text-[#3D2C29]">{text.aboutWhyBody}</p>
        <p className="mt-3 leading-relaxed text-[#3D2C29]">
          {text.aboutCampaignBefore}
          <a href="/daily-challenge" className={linkClass}>
            {text.aboutDailyLink}
          </a>
          {text.aboutCampaignAfter}
        </p>
      </section>
      <div className="mt-8">
        <PlayLink>{text.aboutPlay}</PlayLink>
      </div>
    </ContentPage>
  )
}
