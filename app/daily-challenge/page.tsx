import type { Metadata } from 'next'
import Link from 'next/link'
import { DailyStatus } from '@/components/Game/DailyStatus'
import { ContentPage } from '@/components/Layout/ContentPage'
import { PlayLink } from '@/components/Layout/PlayLink'
import { JsonLd } from '@/components/Seo/JsonLd'
import { dailyLevelNumber, formatDailyDate, utcDateString } from '@/lib/daily'
import { copy, fill } from '@/lib/i18n'
import { getLocale } from '@/lib/locale-server'
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const dynamic = 'force-dynamic'

const linkClass = 'font-semibold text-[#3D2C29] underline-offset-4 hover:underline'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  const text = copy[locale]
  const date = formatDailyDate(new Date(), locale)
  return pageMeta({
    title: text.dailyMetaTitle,
    description: fill(text.dailyMetaDescription, { date }),
    path: '/daily-challenge',
    keywords: ['daily logic puzzle', 'fillomino daily', 'free logic puzzle online'],
  })
}

export default async function DailyChallengePage() {
  const locale = await getLocale()
  const text = copy[locale]
  const now = new Date()
  const date = formatDailyDate(now, locale)
  const utcDate = utcDateString(now)
  const levelNumber = dailyLevelNumber(now)
  const crumbs = [
    { name: text.home, path: '/' },
    { name: text.dailyHeading, path: '/daily-challenge' },
  ] as const
  return (
    <ContentPage crumbs={crumbs.map((crumb) => ({ href: crumb.path === '/daily-challenge' ? undefined : crumb.path, label: crumb.name }))}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: text.dailyJsonName,
          url: `${SITE.url}/daily-challenge`,
          description: fill(text.dailyJsonDescription, { date }),
          dateModified: utcDate,
        }}
      />
      <p className="text-sm font-semibold tracking-wide text-[#E84B7F] uppercase">{text.dailyEyebrow}</p>
      <h1 className="mt-2 font-display text-4xl font-bold">{text.dailyHeading}</h1>
      <p className="mt-3 leading-relaxed text-[#8C7468]">{fill(text.dailyLead, { date })}</p>
      <DailyStatus utcDate={utcDate} />
      <ul className="mt-6 grid gap-3">
        {text.dailyCards.map((card) => (
          <li key={card.title} className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
            <h2 className="font-display text-xl font-bold">{card.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-[#8C7468]">{fill(card.body, { level: levelNumber })}</p>
          </li>
        ))}
        <li className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
          <h2 className="font-display text-xl font-bold">{text.howToPlay}</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#8C7468]">
            {text.dailyRulesBefore}
            <Link href="/how-to-play" className={linkClass}>
              {text.dailyHowLink}
            </Link>
            {text.dailyRulesAfter}
          </p>
        </li>
      </ul>
      <div className="mt-8">
        <PlayLink href="/?play=daily">{text.dailyPlay}</PlayLink>
      </div>
    </ContentPage>
  )
}
