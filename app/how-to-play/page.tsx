import type { Metadata } from 'next'
import Link from 'next/link'
import { ExampleBoard } from '@/components/Content/ExampleBoard'
import { ContentPage } from '@/components/Layout/ContentPage'
import { PlayLink } from '@/components/Layout/PlayLink'
import { JsonLd } from '@/components/Seo/JsonLd'
import { DemoPuzzle } from '@/components/Tutorial/DemoPuzzle'
import { ANIMALS } from '@/lib/animals'
import { cellCountLabel, copy } from '@/lib/i18n'
import { localizeHref } from '@/lib/locale'
import { getLocale } from '@/lib/locale-server'
import { breadcrumbJsonLd, pageMeta, pageQueryKeywords } from '@/lib/seo'
import { SITE } from '@/lib/site'

const mouse = { glyph: '🐭', fill: '#E8ECF1' }
const empty = { glyph: '', fill: '#FFFFFF' }
const ruleIds = ['fill', 'size', 'apart'] as const

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  const text = copy[locale]
  return pageMeta({
    title: text.howToMetaTitle,
    description: text.howToMetaDescription,
    path: '/how-to-play',
    keywords: pageQueryKeywords.howTo[locale],
  })
}

export default async function HowToPlayPage() {
  const locale = await getLocale()
  const text = copy[locale]
  const crumbs = [
    { name: text.home, path: '/' },
    { name: text.howToPlay, path: '/how-to-play' },
  ] as const
  return (
    <ContentPage crumbs={crumbs.map((crumb) => ({ href: crumb.path === '/how-to-play' ? undefined : crumb.path, label: crumb.name }))}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: text.howToMetaTitle,
          description: text.howToMetaDescription,
          totalTime: 'PT2M',
          step: [
            ...text.howToRules.map((rule, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              name: rule.title,
              text: rule.body,
              url: `${SITE.url}/how-to-play#${ruleIds[index]}`,
            })),
            {
              '@type': 'HowToStep',
              position: text.howToRules.length + 1,
              name: text.howToLegalName,
              text: text.howToLegalText,
            },
          ],
        }}
      />
      <h1 className="font-display text-4xl font-bold">{text.howToMetaTitle}</h1>
      <p className="mt-3 leading-relaxed text-[#8C7468]">{text.howToLead}</p>
      <ul className="mt-6 grid gap-3">
        {text.howToRules.map((rule, index) => (
          <li key={ruleIds[index]} id={ruleIds[index]} className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
            <h2 className="font-display text-xl font-bold">{rule.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-[#8C7468]">{rule.body}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-display text-2xl font-bold">{text.howToNeighbors}</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {ANIMALS.map((animal) => (
          <li key={animal.emoji} className="rounded-2xl p-3 text-center ring-1 ring-[#E5D5C0]" style={{ background: animal.fill }}>
            <span className="text-3xl" aria-hidden="true">
              {animal.emoji}
            </span>
            <p className="mt-1 font-display font-bold">{text.animals[animal.emoji]}</p>
            <p className="text-sm tabular-nums" style={{ color: animal.ink }}>
              {cellCountLabel(locale, animal.size)}
            </p>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-display text-2xl font-bold">{text.howToCompare}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#8C7468]">{text.howToCompareNote}</p>
      <div className="mt-4 grid gap-3">
        <ExampleBoard label={text.howToCorner.title} caption={text.howToCorner.body} rows={[
          [mouse, mouse, empty, empty],
          [empty, empty, mouse, mouse],
        ]} />
        <ExampleBoard label={text.howToFour.title} caption={text.howToFour.body} rows={[
          [{ ...mouse, bad: true }, { ...mouse, bad: true }, empty],
          [empty, { ...mouse, bad: true }, { ...mouse, bad: true }],
        ]} />
        <ExampleBoard
          label={text.howToThree.title}
          caption={text.howToThree.body}
          rows={[[{ ...mouse, bad: true }, { ...mouse, bad: true }, { ...mouse, bad: true }]]}
        />
      </div>
      <h2 className="mt-8 font-display text-2xl font-bold">{text.howToTry}</h2>
      <p className="mt-2 mb-4 text-sm text-[#8C7468]">{text.howToTryNote}</p>
      <DemoPuzzle />
      <p className="mt-6 text-sm leading-relaxed text-[#8C7468]">
        {text.howToLongerBefore}
        <Link href={localizeHref(locale, '/blog/how-to-solve-fillomino-puzzles')} className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
          {text.howToSolveLink}
        </Link>
        {text.howToLongerMiddle}
        <Link href="/daily-challenge" className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
          {text.howToDailyLink}
        </Link>
        {text.howToLongerAfter}
      </p>
      <div className="mt-8">
        <PlayLink>{text.howToPlayCta}</PlayLink>
      </div>
    </ContentPage>
  )
}
