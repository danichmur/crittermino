'use client'

import { useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ANIMALS } from '@/lib/animals'
import { LEVEL_CAP } from '@/lib/campaign'
import { formatTime } from '@/lib/format'
import { fill, pluralWord } from '@/lib/i18n'
import { shareMessage } from '@/lib/share-code'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { track } from '@/lib/analytics'
import { Button } from '@/components/UI/Button'
import { Modal } from '@/components/UI/Modal'
import { useGame } from '@/hooks/useGame'

const CONFETTI = ['#FF6B9D', '#E6B325', '#C0844A', '#3CB371', '#FF8C42', '#FFFFFF']

export const WinModal = () => {
  const level = useGame((state) => state.level)
  const open = useGame((state) => state.isComplete)
  const moves = useGame((state) => state.moves)
  const elapsedMs = useGame((state) => state.elapsedMs)
  const isNewBest = useGame((state) => state.isNewBest)
  const tutorial = useGame((state) => state.tutorialCelebration)
  const playMode = useGame((state) => state.playMode)
  const startLevel = useGame((state) => state.startLevel)
  const showHome = useGame((state) => state.showHome)
  const showSoon = useGame((state) => state.showSoon)
  const router = useRouter()
  const restart = useGame((state) => state.restart)
  const showToast = useGame((state) => state.showToast)
  const reduceMotion = useReducedMotion()
  const { locale, t } = useI18n()
  if (!level) return null
  const isDaily = playMode === 'daily'
  const isLast = level.number >= LEVEL_CAP
  const handleDailyDone = (): void => {
    showHome()
    router.push('/daily-challenge')
  }
  const animals = ANIMALS.filter((animal) => level.palette.includes(animal.size))
  const share = async (): Promise<void> => {
    const seconds = Math.min(65_535, Math.max(0, Math.round(elapsedMs / 1000)))
    const score = { level: level.number, moves: Math.min(65_535, Math.max(0, moves)), seconds }
    const { text, url, line } = shareMessage(score, locale)
    track({ name: 'share_clicked', level: level.number, mode: playMode })
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Crittermino', text, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(line)
      showToast(t.scoreCopied)
    } catch {
      showToast(line)
    }
  }
  return (
    <Modal open={open} placement="center" title={isDaily ? t.dailyClear : tutorial ? t.tutorialComplete : fill(t.levelClear, { n: level.number })} dismissable={false}>
      <div className="relative">
        {!reduceMotion
          ? CONFETTI.map((color, index) => (
              <span
                key={`${color}-${index}`}
                aria-hidden="true"
                className="pointer-events-none absolute top-0 h-2.5 w-2.5 overflow-hidden rounded-full"
                style={{
                  left: '50%',
                  background: color,
                  animation: `critter-confetti 0.9s ease-out ${index * 0.03}s forwards`,
                  ['--confetti-x' as string]: `${Math.cos((index / CONFETTI.length) * Math.PI * 2) * (70 + index * 8)}px`,
                }}
              />
            ))
          : null}
        <div className="mb-4 flex justify-center gap-2 text-4xl">
          {animals.map((animal, index) => (
            <span
              key={animal.emoji}
              aria-hidden="true"
              className={reduceMotion ? undefined : 'animate-bounce'}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {animal.emoji}
            </span>
          ))}
        </div>
        <h2 className="text-center font-display text-3xl font-bold">{tutorial ? t.tutorialDone : t.homesFound}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-white px-2 py-4 text-center ring-1 ring-[#E5D5C0]">
            <p className="font-display text-5xl leading-none font-bold tracking-tight text-[#3D2C29] tabular-nums sm:text-7xl">{moves}</p>
            <p className="mt-2 text-base font-semibold text-[#8C7468]">{pluralWord(locale, moves, 'move')}</p>
          </div>
          <div className="rounded-3xl bg-white px-2 py-4 text-center ring-1 ring-[#E5D5C0]">
            <p className="font-display text-5xl leading-none font-bold tracking-tight text-[#3D2C29] tabular-nums sm:text-7xl">{formatTime(elapsedMs)}</p>
            <p className="mt-2 text-base font-semibold text-[#8C7468]">{t.time}</p>
          </div>
        </div>
        {isNewBest ? <p className="mt-3 text-center font-display text-xl font-bold text-[#E84B7F]">{t.newBest}</p> : null}
        {isLast ? <p className="mt-3 text-center text-sm text-[#3D2C29]">{t.lastHome}</p> : null}
        {tutorial ? (
          <ul className="mt-4 space-y-2 text-sm text-[#3D2C29]">
            <li>{t.ruleFill}</li>
            <li>{t.ruleSize}</li>
            <li>{t.ruleApart}</li>
          </ul>
        ) : null}
        <div className="mt-5 flex flex-col gap-3">
          {isDaily ? (
            <Button size="lg" onClick={handleDailyDone}>
              {t.todaysPage}
            </Button>
          ) : (
            <Button size="lg" onClick={() => (isLast ? showSoon() : startLevel(level.number + 1))}>
              {tutorial ? t.playLevel6 : isLast ? t.comingSoon : t.nextLevel}
            </Button>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => void share()}>
              {t.share}
            </Button>
            <Button variant="secondary" onClick={restart}>
              {t.replay}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
