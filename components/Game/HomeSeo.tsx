import Link from 'next/link'
import { ANIMALS } from '@/lib/animals'
import { HOME_FAQS } from '@/lib/seo'

const readMore = [
  { href: '/how-to-play', label: 'How to play' },
  { href: '/daily-challenge', label: 'Daily puzzle' },
  { href: '/blog', label: 'Strategies' },
  { href: '/about', label: 'About the game' },
] as const

export const HomeSeo = () => (
  <div className="mx-auto w-full max-w-lg px-5 pb-2">
    <section aria-labelledby="what-it-is">
      <h2 id="what-it-is" className="font-display text-3xl font-bold">
        A free logic puzzle online
      </h2>
      <p className="mt-3 leading-relaxed text-[#3D2C29]">
        Crittermino is a Fillomino game and an animal puzzle game in the same board. You play in the browser. There is no download and no account. Every cell becomes part of a home, and the solution on each level is unique.
      </p>
    </section>
    <section className="mt-8" aria-labelledby="animal-homes">
      <h2 id="animal-homes" className="font-display text-2xl font-bold">
        The homes
      </h2>
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
      <p className="mt-3 text-sm leading-relaxed text-[#8C7468]">
        A home can bend. It has to stay connected edge to edge. Two homes of the same size cannot share a wall. Corners may touch.
      </p>
    </section>
    <section className="mt-8" aria-labelledby="home-questions">
      <h2 id="home-questions" className="font-display text-2xl font-bold">
        Questions
      </h2>
      <dl className="mt-3 grid gap-3">
        {HOME_FAQS.map((item) => (
          <div key={item.question} className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
            <dt className="font-display text-lg font-bold">{item.question}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-[#8C7468]">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
    <nav aria-label="Read more" className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
      {readMore.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-[#3D2C29] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  </div>
)
