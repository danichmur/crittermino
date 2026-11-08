'use client'

import Link from 'next/link'
import { ANIMALS } from '@/lib/animals'
import { cellCountLabel } from '@/lib/i18n'
import { useI18n } from '@/components/Locale/LocaleProvider'

export const HomeSeo = () => {
  const { locale, t } = useI18n()
  const readMore = [
    { href: '/how-to-play', label: t.howToPlay },
    { href: '/daily-challenge', label: t.dailyPuzzle },
    { href: '/blog', label: t.strategies },
    { href: '/about', label: t.aboutGame },
  ] as const
  return (
    <div className="mx-auto w-full max-w-lg px-5 pb-2">
      <section aria-labelledby="what-it-is">
        <h2 id="what-it-is" className="font-display text-3xl font-bold">
          {t.seoTitle}
        </h2>
        <p className="mt-3 leading-relaxed text-[#3D2C29]">{t.seoBody}</p>
      </section>
      <section className="mt-8" aria-labelledby="animal-homes">
        <h2 id="animal-homes" className="font-display text-2xl font-bold">
          {t.homesTitle}
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {ANIMALS.map((animal) => (
            <li key={animal.emoji} className="rounded-2xl p-3 text-center ring-1 ring-[#E5D5C0]" style={{ background: animal.fill }}>
              <span className="text-3xl" aria-hidden="true">
                {animal.emoji}
              </span>
              <p className="mt-1 font-display font-bold">{t.animals[animal.emoji]}</p>
              <p className="text-sm tabular-nums" style={{ color: animal.ink }}>
                {cellCountLabel(locale, animal.size)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-[#8C7468]">{t.homesNote}</p>
      </section>
      <section className="mt-8" aria-labelledby="home-questions">
        <h2 id="home-questions" className="font-display text-2xl font-bold">
          {t.questions}
        </h2>
        <dl className="mt-3 grid gap-3">
          {t.faqs.map((item) => (
            <div key={item.question} className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
              <dt className="font-display text-lg font-bold">{item.question}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[#8C7468]">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
      <nav aria-label={t.strategies} className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
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
}
