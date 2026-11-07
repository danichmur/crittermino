'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ANIMALS } from '@/lib/animals'
import { LEVEL_CAP } from '@/lib/campaign'
import { streakLabel } from '@/lib/storage'
import { Button } from '@/components/UI/Button'
import { HomeSeo } from '@/components/Game/HomeSeo'
import { Footer } from '@/components/Layout/Footer'
import { useInstallPrompt } from '@/components/PwaRegister'
import { useGame } from '@/hooks/useGame'
import { useProgress } from '@/hooks/useProgress'

const FLOATERS = [
  { emoji: '🐭', className: 'left-[6%] top-[18%]', delay: 0 },
  { emoji: '🐱', className: 'right-[8%] top-[22%]', delay: 0.4 },
  { emoji: '🐶', className: 'left-[10%] bottom-[18%]', delay: 0.8 },
  { emoji: '🐼', className: 'right-[12%] bottom-[22%]', delay: 0.2 },
]

export const HomeScreen = () => {
  const progress = useProgress((state) => state.progress)
  const ready = useProgress((state) => state.ready)
  const startLevel = useGame((state) => state.startLevel)
  const showLevels = useGame((state) => state.showLevels)
  const showSoon = useGame((state) => state.showSoon)
  const reduceMotion = useReducedMotion()
  const { canInstall, install } = useInstallPrompt()
  const streak = ready ? streakLabel(progress) : null
  const caughtUp = progress.completedLevels.includes(LEVEL_CAP)
  const nextLevel = Math.min(progress.currentLevel, LEVEL_CAP)
  const continueLabel = nextLevel > 1 || progress.completedLevels.length > 0
  return (
    <div>
    <div className="relative flex min-h-dvh flex-col px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block" aria-hidden="true">
        {FLOATERS.map((floater) => (
          <motion.span
            key={floater.emoji}
            className={`absolute text-5xl opacity-70 ${floater.className}`}
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: floater.delay, ease: 'easeOut' }}
          >
            {floater.emoji}
          </motion.span>
        ))}
      </div>
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold tracking-wide text-[#E84B7F] uppercase">Logic puzzle</p>
        <h1 className="mt-2 font-display text-5xl font-bold text-[#3D2C29]">Crittermino</h1>
        <p className="mt-3 max-w-xs text-base text-[#8C7468]">
          A free Fillomino puzzle in the browser. No download. Fill the grid with animal homes. Each critter needs a region of exactly the right size, and same-size homes cannot touch.
        </p>
        <div className="mt-5 flex gap-2 text-3xl" aria-hidden="true">
          {ANIMALS.map((animal) => (
            <span key={animal.emoji} title={`${animal.name} ${animal.size}`}>
              {animal.emoji}
            </span>
          ))}
        </div>
        {streak ? <p className="mt-4 rounded-full bg-white px-3 py-1 text-sm font-medium ring-1 ring-[#E5D5C0]">{streak}</p> : null}
        <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
          <Button size="lg" onClick={() => (caughtUp ? showSoon() : startLevel(nextLevel))}>
            {caughtUp ? 'Coming soon' : continueLabel ? `Continue · Level ${nextLevel}` : 'Play'}
          </Button>
          <Button variant="secondary" onClick={showLevels}>
            Level select
          </Button>
          <Link
            href="/how-to-play"
            className="inline-flex min-h-11 items-center justify-center rounded-full px-4 font-display font-semibold text-[#3D2C29] underline-offset-4 hover:underline"
          >
            How to play
          </Link>
          {canInstall ? (
            <Button variant="secondary" onClick={() => void install()}>
              Install app
            </Button>
          ) : null}
        </div>
        {ready && progress.completedLevels.length > 0 ? (
          <p className="mt-6 text-sm text-[#8C7468] tabular-nums">
            {progress.completedLevels.length} cleared · {progress.totalMoves} moves
          </p>
        ) : null}
      </main>
    </div>
      <HomeSeo />
      <Footer />
    </div>
  )
}
