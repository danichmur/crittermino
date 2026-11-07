import type { Metadata } from 'next'
import Link from 'next/link'
import { ExampleBoard } from '@/components/Content/ExampleBoard'
import { ContentPage } from '@/components/Layout/ContentPage'
import { PlayLink } from '@/components/Layout/PlayLink'
import { JsonLd } from '@/components/Seo/JsonLd'
import { DemoPuzzle } from '@/components/Tutorial/DemoPuzzle'
import { ANIMALS } from '@/lib/animals'
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

const title = 'How to play Fillomino'
const description =
  'How to play Fillomino in Crittermino: animal homes, region sizes, and why same-size regions cannot touch. Includes two shape examples.'

export const metadata: Metadata = pageMeta({
  title,
  description,
  path: '/how-to-play',
  keywords: ['how to play fillomino', 'fillomino rules', 'crittermino rules'],
})

const rules = [
  {
    title: 'Fill the whole grid',
    body: 'Every cell becomes part of an animal home. Empty cells are still waiting for a critter.',
  },
  {
    title: 'Match the size',
    body: 'Mouse homes are 2 cells, Cat 3, Dog 4, Panda 5, and Lion 6. The home can bend, but it must be connected edge to edge.',
  },
  {
    title: 'Same sizes stay apart',
    body: 'Two homes of the same size cannot share a wall. Touching at a corner is fine. If you join them, the home gets too big and shakes.',
  },
] as const

const mouse = { glyph: '🐭', fill: '#FFE5EC' }
const empty = { glyph: '', fill: '#FFFFFF' }

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'How to play', path: '/how-to-play' },
] as const

export default function HowToPlayPage() {
  return (
    <ContentPage crumbs={crumbs.map((crumb) => ({ href: crumb.path === '/how-to-play' ? undefined : crumb.path, label: crumb.name }))}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to play Fillomino in Crittermino',
          description,
          totalTime: 'PT2M',
          step: [
            ...rules.map((rule, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              name: rule.title,
              text: rule.body,
              url: `${SITE.url}/how-to-play#${rule.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            })),
            {
              '@type': 'HowToStep',
              position: rules.length + 1,
              name: 'Compare a legal touch and an illegal wall',
              text: 'Two mouse homes may touch at a corner. They cannot share a side. Three mice in a row are one region of three, which is too big for a mouse.',
            },
          ],
        }}
      />
      <h1 className="font-display text-4xl font-bold">How to play</h1>
      <p className="mt-3 leading-relaxed text-[#8C7468]">
        Crittermino is a Fillomino puzzle. The givens are the cells that already have an animal. They cannot be changed. Everything else is yours to place, and the solution is unique.
      </p>
      <ul className="mt-6 grid gap-3">
        {rules.map((rule) => (
          <li key={rule.title} id={rule.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
            <h2 className="font-display text-xl font-bold">{rule.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-[#8C7468]">{rule.body}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-display text-2xl font-bold">The neighbors</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {ANIMALS.map((animal) => (
          <li key={animal.emoji} className="rounded-2xl p-3 text-center ring-1 ring-[#E5D5C0]" style={{ background: animal.fill }}>
            <span className="text-3xl" aria-hidden="true">
              {animal.emoji}
            </span>
            <p className="mt-1 font-display font-bold">{animal.name}</p>
            <p className="text-sm tabular-nums" style={{ color: animal.ink }}>
              {animal.size} cells
            </p>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-display text-2xl font-bold">Two shapes to compare</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#8C7468]">
        A mouse home is exactly two cells. The pink rings mark a shape the rules reject.
      </p>
      <div className="mt-4 grid gap-3">
        <ExampleBoard
          label="Two mouse homes touch only at a corner, which is allowed."
          caption="Corner touch is allowed. The top mouse home and the bottom mouse home do not share a side."
          rows={[
            [mouse, mouse, empty, empty],
            [empty, empty, mouse, mouse],
          ]}
        />
        <ExampleBoard
          label="Four mice joined by their sides, one region of four, which is too big."
          caption="These four mice connect by their sides, so they are one region. A mouse home is two cells, and this shape shakes."
          rows={[
            [{ ...mouse, bad: true }, { ...mouse, bad: true }, empty],
            [empty, { ...mouse, bad: true }, { ...mouse, bad: true }],
          ]}
        />
        <ExampleBoard
          label="Three mice in a row make one region of three, which is too big."
          caption="Three mice in a row are one region of three. A mouse home is two cells, so the extra cell has to be some other animal."
          rows={[[{ ...mouse, bad: true }, { ...mouse, bad: true }, { ...mouse, bad: true }]]}
        />
      </div>
      <h2 className="mt-8 font-display text-2xl font-bold">Try a tiny one</h2>
      <p className="mt-2 mb-4 text-sm text-[#8C7468]">Mouse is selected. Tap the empty cell beside the other mouse.</p>
      <DemoPuzzle />
      <p className="mt-6 text-sm leading-relaxed text-[#8C7468]">
        When you want a longer walk through the logic, read{' '}
        <Link href="/blog/how-to-solve-fillomino-puzzles" className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
          how to solve Fillomino
        </Link>
        . One shared board is waiting on the{' '}
        <Link href="/daily-challenge" className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
          daily challenge
        </Link>
        .
      </p>
      <div className="mt-8">
        <PlayLink>Play Crittermino</PlayLink>
      </div>
    </ContentPage>
  )
}
