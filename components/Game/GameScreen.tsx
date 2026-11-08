'use client'

import { useEffect } from 'react'
import { animalFromSize } from '@/lib/animals'
import { finishedRegions, neededRegions } from '@/lib/board'
import { Header } from '@/components/Layout/Header'
import { AnimalSelector } from '@/components/Game/AnimalSelector'
import { Grid } from '@/components/Game/Grid'
import { HintButton } from '@/components/Game/HintButton'
import { MenuSheet, SettingsDialog } from '@/components/Game/MenuSheet'
import { WinModal } from '@/components/Game/WinModal'
import { InteractiveTutorial } from '@/components/Tutorial/InteractiveTutorial'
import { useGame } from '@/hooks/useGame'

export const GameScreen = () => {
  const level = useGame((state) => state.level)
  const playMode = useGame((state) => state.playMode)
  const grid = useGame((state) => state.grid)
  const moves = useGame((state) => state.moves)
  const selectedAnimal = useGame((state) => state.selectedAnimal)
  const shakes = useGame((state) => state.shakes)
  const bursts = useGame((state) => state.bursts)
  const coach = useGame((state) => state.coach)
  const introVisible = useGame((state) => state.introVisible)
  const isGenerating = useGame((state) => state.isGenerating)
  const isComplete = useGame((state) => state.isComplete)
  const menuOpen = useGame((state) => state.menuOpen)
  const settingsOpen = useGame((state) => state.settingsOpen)
  const openMenu = useGame((state) => state.openMenu)
  const selectAnimal = useGame((state) => state.selectAnimal)
  const tapCell = useGame((state) => state.tapCell)
  const requestHint = useGame((state) => state.requestHint)
  const dismissIntro = useGame((state) => state.dismissIntro)
  const closeMenu = useGame((state) => state.closeMenu)
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
        <p className="text-5xl" aria-hidden="true">
          🐭
        </p>
        <p className="font-display text-xl font-bold">Folding the next puzzle…</p>
      </div>
    )
  }
  const needed = Object.values(neededRegions(level)).reduce((sum, count) => sum + count, 0)
  const done = Object.values(finishedRegions(grid)).reduce((sum, count) => sum + count, 0)
  const spotlight =
    level.tutorial?.spotlight.find((spot) => grid[spot.row]?.[spot.col]?.animal !== animalFromSize(level.solution[spot.row]?.[spot.col] ?? 0)) ??
    null
  const spotlightCell = spotlight ? grid[spotlight.row]?.[spotlight.col] : null
  const tutorialMessage = (() => {
    if (!level.tutorial || isComplete) return null
    if (level.tutorial.spotlight.length === 0 && moves > 0) return null
    if (level.tutorial.spotlight.length > 0 && !spotlight) return null
    if (spotlightCell?.hasError) return 'Those homes are the same size and share a wall. Try a different animal.'
    return level.tutorial.message
  })()
  const ghostCells = coach?.kind === 'region' ? coach.cells : []
  const ghostAnimal = coach?.kind === 'region' ? coach.animal : null
  const highlight = coach?.kind === 'cell' ? { row: coach.row, col: coach.col } : null
  return (
    <div className="fixed inset-x-0 top-0 mx-auto flex h-dvh max-h-dvh w-full max-w-3xl flex-col overflow-hidden px-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-3">
      <Header
        mode="game"
        level={level.number}
        label={playMode === 'daily' ? 'Daily' : undefined}
        moves={moves}
        homes={`${done}/${needed} homes`}
        onMenu={openMenu}
        hint={<HintButton onHint={requestHint} />}
      />
      <div className="flex min-h-0 flex-1 flex-col py-2">
        {introVisible && level.intro ? (
          <button
            type="button"
            onClick={dismissIntro}
            className="mb-2 shrink-0 rounded-2xl bg-white px-4 py-3 text-left text-sm font-medium shadow-sm ring-1 ring-[#E5D5C0]"
          >
            {level.intro}
            <span className="mt-1 block text-xs text-[#8C7468]">Tap to dismiss</span>
          </button>
        ) : null}
        {coach ? (
          <p className="mb-2 shrink-0 text-center text-sm font-medium text-[#8C7468]" role="status">
            {coach.note}
          </p>
        ) : null}
        <InteractiveTutorial message={tutorialMessage} fill>
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
      <div className="shrink-0">
        <AnimalSelector level={level} grid={grid} selected={selectedAnimal} onSelect={selectAnimal} />
      </div>
      <MenuSheet />
      <SettingsDialog />
      <WinModal />
    </div>
  )
}
