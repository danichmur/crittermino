'use client'

import { ANIMALS } from '@/lib/animals'
import { LEVEL_CAP } from '@/lib/campaign'
import { Button } from '@/components/UI/Button'
import { useGame } from '@/hooks/useGame'

export const ComingSoon = () => {
  const showHome = useGame((state) => state.showHome)
  const showLevels = useGame((state) => state.showLevels)
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-8 text-center">
      <div className="flex gap-2 text-4xl" aria-hidden="true">
        {ANIMALS.map((animal) => (
          <span key={animal.emoji}>{animal.emoji}</span>
        ))}
      </div>
      <p className="mt-6 text-sm font-semibold tracking-wide text-[#E84B7F] uppercase">Level {LEVEL_CAP} cleared</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-[#3D2C29]">Coming soon</h1>
      <p className="mt-3 max-w-xs text-base text-[#8C7468]">
        You found every home we have. More puzzles are on the way — hang tight.
      </p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
        <Button size="lg" onClick={showLevels}>
          Level select
        </Button>
        <Button variant="secondary" onClick={showHome}>
          Home
        </Button>
      </div>
    </div>
  )
}
