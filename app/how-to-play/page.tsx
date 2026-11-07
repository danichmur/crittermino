import type { Metadata } from 'next'
import Link from 'next/link'
import { ANIMALS } from '@/lib/animals'
import { Footer } from '@/components/Layout/Footer'
import { Header } from '@/components/Layout/Header'
import { DemoPuzzle } from '@/components/Tutorial/DemoPuzzle'

export const metadata: Metadata = {
  title: 'How to play Crittermino',
  description: 'Learn the Fillomino rules behind Crittermino: animal homes, region sizes, and why same-size regions cannot touch.',
  alternates: { canonical: '/how-to-play' },
}

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
]

export default function HowToPlayPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col">
      <Header />
      <main className="px-5 pb-8">
        <h1 className="font-display text-4xl font-bold">How to play</h1>
        <p className="mt-3 text-[#8C7468]">
          Crittermino is a Fillomino puzzle. The givens are the cells that already have an animal. They cannot be changed. Everything else is yours to place, and the solution is unique.
        </p>
        <ul className="mt-6 grid gap-3">
          {rules.map((rule) => (
            <li key={rule.title} className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
              <h2 className="font-display text-xl font-bold">{rule.title}</h2>
              <p className="mt-1 text-sm text-[#8C7468]">{rule.body}</p>
            </li>
          ))}
        </ul>
        <h2 className="mt-8 font-display text-2xl font-bold">The neighbors</h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {ANIMALS.map((animal) => (
            <li key={animal.emoji} className="rounded-2xl p-3 text-center ring-1 ring-[#E5D5C0]" style={{ background: animal.fill }}>
              <span className="text-3xl">{animal.emoji}</span>
              <p className="mt-1 font-display font-bold">{animal.name}</p>
              <p className="text-sm tabular-nums" style={{ color: animal.ink }}>
                {animal.size} cells
              </p>
            </li>
          ))}
        </ul>
        <h2 className="mt-8 font-display text-2xl font-bold">Try a tiny one</h2>
        <p className="mt-2 mb-4 text-sm text-[#8C7468]">Mouse is selected. Tap the empty cell beside the other mouse.</p>
        <DemoPuzzle />
        <Link
          href="/"
          className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#FF6B9D] px-6 font-display text-lg font-semibold text-white shadow-[0_6px_0_#E84B7F]"
        >
          Play Crittermino
        </Link>
      </main>
      <Footer />
    </div>
  )
}
