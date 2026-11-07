import type { Metadata } from 'next'
import Link from 'next/link'
import { DailyStatus } from '@/components/Game/DailyStatus'
import { ContentPage } from '@/components/Layout/ContentPage'
import { PlayLink } from '@/components/Layout/PlayLink'
import { JsonLd } from '@/components/Seo/JsonLd'
import { dailyLevelNumber, formatDailyDate, utcDateString } from '@/lib/daily'
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const dynamic = 'force-dynamic'

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Daily challenge', path: '/daily-challenge' },
] as const

export const generateMetadata = (): Metadata => {
  const label = formatDailyDate()
  return pageMeta({
    title: 'Daily logic puzzle',
    description: `The Crittermino daily for ${label}. One Fillomino grid for every player, free in the browser. The board changes at midnight UTC.`,
    path: '/daily-challenge',
    keywords: ['daily logic puzzle', 'fillomino daily', 'free logic puzzle online'],
  })
}

export default function DailyChallengePage() {
  const now = new Date()
  const label = formatDailyDate(now)
  const utcDate = utcDateString(now)
  const levelNumber = dailyLevelNumber(now)
  return (
    <ContentPage crumbs={crumbs.map((crumb) => ({ href: crumb.path === '/daily-challenge' ? undefined : crumb.path, label: crumb.name }))}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Crittermino daily challenge',
          url: `${SITE.url}/daily-challenge`,
          description: `One shared Fillomino grid for ${label} UTC.`,
          dateModified: utcDate,
        }}
      />
      <p className="text-sm font-semibold tracking-wide text-[#E84B7F] uppercase">Same grid for everyone</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Daily challenge</h1>
      <p className="mt-3 leading-relaxed text-[#8C7468]">
        One Fillomino board for {label}. It changes at midnight UTC. You play it in the browser, with no download and no account.
      </p>
      <DailyStatus utcDate={utcDate} />
      <ul className="mt-6 grid gap-3">
        <li className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
          <h2 className="font-display text-xl font-bold">Today’s grid</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#8C7468]">
            Today uses campaign level {levelNumber}. The animals and the walls are the real puzzle. Clearing it on this device does not move your campaign level, and it does not mark that level done. You can meet it again later in the path.
          </p>
        </li>
        <li className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
          <h2 className="font-display text-xl font-bold">The rules, in one breath</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#8C7468]">
            Fill every cell. Mouse is 2, cat 3, dog 4, panda 5, lion 6. Homes connect edge to edge. Two homes of the same size cannot share a wall. The{' '}
            <Link href="/how-to-play" className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
              how to play page
            </Link>{' '}
            has examples if you want them first.
          </p>
        </li>
      </ul>
      <div className="mt-8">
        <PlayLink href="/?play=daily">Play today’s puzzle</PlayLink>
      </div>
    </ContentPage>
  )
}
