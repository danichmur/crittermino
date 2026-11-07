'use client'

import { useState } from 'react'
import { LEVEL_CAP } from '@/lib/campaign'
import { cn } from '@/lib/cn'
import { Button } from '@/components/UI/Button'
import { useGame } from '@/hooks/useGame'
import { useProgress } from '@/hooks/useProgress'

const PAGE_SIZE = 40

export const LevelSelect = () => {
  const progress = useProgress((state) => state.progress)
  const startLevel = useGame((state) => state.startLevel)
  const showHome = useGame((state) => state.showHome)
  const unlocked = Math.min(LEVEL_CAP, Math.max(progress.currentLevel, 1))
  const pageCount = Math.max(1, Math.ceil(unlocked / PAGE_SIZE))
  const [page, setPage] = useState(() => Math.floor((Math.min(progress.currentLevel, unlocked) - 1) / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const first = safePage * PAGE_SIZE + 1
  const last = Math.min(unlocked, first + PAGE_SIZE - 1)
  const levels = Array.from({ length: last - first + 1 }, (_, index) => first + index)
  return (
    <div className="flex min-h-dvh flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Levels</h1>
        <Button variant="ghost" onClick={showHome}>
          Home
        </Button>
      </div>
      <p className="mt-1 text-sm text-[#8C7468]">Cleared puzzles stay open, so you can chase a better score.</p>
      {pageCount > 1 ? (
        <div className="mt-4 flex items-center justify-between gap-2">
          <Button variant="secondary" onClick={() => setPage(safePage - 1)} disabled={safePage === 0}>
            Previous
          </Button>
          <p className="text-sm font-medium text-[#8C7468] tabular-nums">
            {first}–{last}
          </p>
          <Button variant="secondary" onClick={() => setPage(safePage + 1)} disabled={safePage >= pageCount - 1}>
            Next
          </Button>
        </div>
      ) : null}
      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">
        {levels.map((level) => {
          const cleared = progress.completedLevels.includes(level)
          const best = progress.bestMoves[level]
          return (
            <button
              key={level}
              type="button"
              onClick={() => startLevel(level)}
              className={cn(
                'flex min-h-16 flex-col items-center justify-center rounded-2xl bg-white text-[#3D2C29] ring-1 ring-[#E5D5C0] touch-manipulation',
                'focus-visible:outline-2 focus-visible:outline-[#FF6B9D]',
                cleared && 'bg-[#E8F5E8]',
                level === progress.currentLevel && !cleared && 'ring-2 ring-[#FF6B9D]',
              )}
            >
              <span className="font-display text-lg font-bold tabular-nums">{level}</span>
              <span className="text-[10px] text-[#8C7468] tabular-nums">
                {cleared ? (best ? `${best} ${best === 1 ? 'move' : 'moves'}` : 'Cleared') : 'Open'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
