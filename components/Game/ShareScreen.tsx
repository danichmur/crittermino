'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ANIMALS } from '@/lib/animals'
import { LEVEL_CAP } from '@/lib/campaign'
import { formatTime } from '@/lib/format'
import { fill, pluralWord } from '@/lib/i18n'
import { defaultProgress, loadProgress } from '@/lib/storage'
import type { ShareScore } from '@/lib/share-code'
import { useI18n } from '@/components/Locale/LocaleProvider'

interface ShareScreenProps {
  score: ShareScore
}

export const ShareScreen = ({ score }: ShareScreenProps) => {
  const [nextLevel, setNextLevel] = useState<number | null>(null)
  const [caughtUp, setCaughtUp] = useState(false)
  useEffect(() => {
    const progress = loadProgress() ?? defaultProgress()
    setCaughtUp(progress.completedLevels.includes(LEVEL_CAP))
    setNextLevel(Math.min(LEVEL_CAP, Math.max(1, progress.currentLevel)))
  }, [])
  const { locale, t } = useI18n()
  const label = caughtUp ? t.comingSoon : nextLevel === null ? t.playYourNext : fill(t.playLevel, { n: nextLevel })
  const note = caughtUp ? t.everyCleared : t.opensNext
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
      <Link href="/" className="font-display text-sm font-semibold tracking-wide text-[#E84B7F] uppercase">
        Crittermino
      </Link>
      <div className="mt-4 flex gap-2 text-4xl" aria-hidden="true">
        {ANIMALS.map((animal) => (
          <span key={animal.emoji}>{animal.emoji}</span>
        ))}
      </div>
      <p className="mt-4 text-sm font-semibold tracking-wide text-[#8C7468] uppercase">{fill(t.shareLevelCleared, { n: score.level })}</p>
      <h1 className="mt-1 font-display text-4xl font-bold text-[#3D2C29]">{t.homesFound}</h1>
      <div className="mt-5 grid w-full grid-cols-2 gap-3">
        <div className="rounded-3xl bg-white px-2 py-5 text-center ring-1 ring-[#E5D5C0]">
          <p className="font-display text-5xl leading-none font-bold tracking-tight text-[#3D2C29] tabular-nums sm:text-7xl">
            {score.moves}
          </p>
          <p className="mt-2 text-base font-semibold text-[#8C7468]">{pluralWord(locale, score.moves, 'move')}</p>
        </div>
        <div className="rounded-3xl bg-white px-2 py-5 text-center ring-1 ring-[#E5D5C0]">
          <p className="font-display text-5xl leading-none font-bold tracking-tight text-[#3D2C29] tabular-nums sm:text-7xl">
            {formatTime(score.seconds * 1000)}
          </p>
          <p className="mt-2 text-base font-semibold text-[#8C7468]">{t.time}</p>
        </div>
      </div>
      <div className="mt-6 flex w-full flex-col gap-3">
        <Link
          href="/?play=next"
          aria-describedby="share-next-note"
          className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#FF6B9D] px-6 font-display text-lg font-semibold text-white shadow-[0_6px_0_#E84B7F] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B9D]"
        >
          {label}
        </Link>
        <p id="share-next-note" className="text-sm text-[#8C7468]">
          {note}
        </p>
      </div>
    </main>
  )
}
