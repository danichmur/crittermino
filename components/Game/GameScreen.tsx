'use client'

import { useEffect } from 'react'
import { animalFromSize } from '@/lib/animals'
import { finishedRegions, neededRegions } from '@/lib/board'
import { Mascot } from '@/components/Brand/Mascot'
import { Header } from '@/components/Layout/Header'
import { AnimalSelector } from '@/components/Game/AnimalSelector'
import { Grid } from '@/components/Game/Grid'
import { HintButton } from '@/components/Game/HintButton'
import { RestartButton } from '@/components/Game/RestartButton'
import { MenuSheet, SettingsDialog } from '@/components/Game/MenuSheet'
import { HintAdModal } from '@/components/Game/HintAdModal'
import { PlusSheet } from '@/components/Game/PlusSheet'
import { WinModal } from '@/components/Game/WinModal'
import { InteractiveTutorial } from '@/components/Tutorial/InteractiveTutorial'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { fill, homeCountLabel } from '@/lib/i18n'
import { IS_IOS_APP } from '@/lib/platform'
import { useGame } from '@/hooks/useGame'
import { usePlus } from '@/hooks/usePlus'
import { useProgress } from '@/hooks/useProgress'

export const GameScreen = () => {
  const level = useGame((state) => state.level)
  const playMode = useGame((state) => state.playMode)
  const grid = useGame((state) => state.grid)
  const moves = useGame((state) => state.moves)
  const selectedAnimal = useGame((state) => state.selectedAnimal)
  const shakes = useGame((state) => state.shakes)
  const bursts = useGame((state) => state.bursts)
  const coach = useGame((state) => state.coach)
  const isGenerating = useGame((state) => state.isGenerating)
  const isComplete = useGame((state) => state.isComplete)
  const menuOpen = useGame((state) => state.menuOpen)
  const settingsOpen = useGame((state) => state.settingsOpen)
  const openMenu = useGame((state) => state.openMenu)
  const restart = useGame((state) => state.restart)
  const selectAnimal = useGame((state) => state.selectAnimal)
  const tapCell = useGame((state) => state.tapCell)
  const requestHint = useGame((state) => state.requestHint)
  const startLevel = useGame((state) => state.startLevel)
  const closeMenu = useGame((state) => state.closeMenu)
  const tutorialCompleted = useProgress((state) => state.progress.tutorialCompleted)
  const skipTutorial = useProgress((state) => state.skipTutorial)
  const plusNudge = useGame((state) => state.plusNudge)
  const openPlus = useGame((state) => state.openPlus)
  const dismissPlusNudge = useGame((state) => state.dismissPlusNudge)
  const plus = usePlus()
  const { locale, t } = useI18n()
  const handleSkipLesson = (): void => {
    skipTutorial()
    startLevel(6)
  }
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (menuOpen || settingsOpen || isComplete || !level) return
      if (event.key === 'Escape') closeMenu()
      const index = Number(event.key) - 1
      const animals = level.palette
        .slice()
        .sort((left, right) => left - right)
        .map((size) => (size === 2 ? '🐭' : size === 3 ? '🐱' : size === 4 ? '🐶' : size === 5 ? '🐼' : '🦁'))
      const animal = animals[index]
      if (animal) selectAnimal(animal)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, settingsOpen, isComplete, level, closeMenu, selectAnimal])
  if (isGenerating || !level) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <Mascot className="h-28 w-28" />
        <p className="font-display text-xl font-bold">{t.folding}</p>
      </div>
    )
  }
  const needed = Object.values(neededRegions(level)).reduce((sum, count) => sum + count, 0)
  const done = Object.values(finishedRegions(grid)).reduce((sum, count) => sum + count, 0)
  const spotlight =
    level.tutorial?.spotlight.find((spot) => grid[spot.row]?.[spot.col]?.animal !== animalFromSize(level.solution[spot.row]?.[spot.col] ?? 0)) ??
    null
  const showSkip = playMode === 'campaign' && level.number <= 5 && !tutorialCompleted && !isComplete
  const coachText = (() => {
    if (!coach) return null
    if (coach.kind === 'region') return fill(t.outlined, { name: t.animals[coach.animal] })
    return coach.note === 'only-one' ? t.onlyOne : t.lookHere
  })()
  const ghostCells = coach?.kind === 'region' ? coach.cells : []
  const ghostAnimal = coach?.kind === 'region' ? coach.animal : null
  const highlight = coach?.kind === 'cell' ? { row: coach.row, col: coach.col } : null
  return (
    <div className="fixed inset-x-0 top-0 mx-auto flex h-dvh max-h-dvh w-full max-w-3xl flex-col overflow-hidden px-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-3 [@media(max-height:700px)]:px-1.5 [@media(max-height:700px)]:pt-[max(0.25rem,env(safe-area-inset-top))] [@media(max-height:700px)]:pb-[max(0.25rem,env(safe-area-inset-bottom))]">
      <Header
        mode="game"
        level={level.number}
        label={playMode === 'daily' ? t.dailyLabel : undefined}
        moves={moves}
        homes={homeCountLabel(locale, done, needed)}
        onMenu={openMenu}
        restart={<RestartButton onRestart={restart} />}
        hint={<HintButton onHint={requestHint} />}
      />
      {showSkip ? (
        <button
          type="button"
          onClick={handleSkipLesson}
          className="mt-1 shrink-0 self-center rounded-full px-3 py-0.5 text-xs font-semibold text-[#8C7468] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
        >
          {t.skipLesson}
        </button>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col py-2 [@media(max-height:700px)]:py-1">
        {coach ? (
          <p className="mb-2 shrink-0 text-center text-sm font-medium text-[#8C7468]" role="status">
            {coachText}
          </p>
        ) : null}
        <InteractiveTutorial message={null} fill>
          <Grid
            grid={grid}
            shakes={shakes}
            bursts={bursts}
            spotlight={spotlight}
            highlight={highlight}
            ghostCells={ghostCells}
            ghostAnimal={ghostAnimal}
            onPress={tapCell}
          />
        </InteractiveTutorial>
      </div>
      {IS_IOS_APP && plusNudge && !plus ? (
        <div className="mb-2 flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={openPlus}
            className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-[#3D2C29] ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
          >
            {t.plusNudge}
          </button>
          <button
            type="button"
            aria-label={t.plusDismiss}
            onClick={dismissPlusNudge}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg text-[#8C7468] ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
          >
            ×
          </button>
        </div>
      ) : null}
      <div className="shrink-0">
        <AnimalSelector level={level} grid={grid} selected={selectedAnimal} onSelect={selectAnimal} />
      </div>
      <MenuSheet />
      <SettingsDialog />
      <WinModal />
      <HintAdModal />
      <PlusSheet />
    </div>
  )
}
