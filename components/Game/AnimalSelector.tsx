'use client'

import { ANIMALS } from '@/lib/animals'
import { cn } from '@/lib/cn'
import { finishedRegions, neededRegions } from '@/lib/board'
import { fill } from '@/lib/i18n'
import { useI18n } from '@/components/Locale/LocaleProvider'
import type { Animal, Cell, Level } from '@/types/game'

interface AnimalSelectorProps {
  level: Level
  grid: Cell[][]
  selected: Animal | null
  onSelect: (animal: Animal) => void
}

export const AnimalSelector = ({ level, grid, selected, onSelect }: AnimalSelectorProps) => {
  const needed = neededRegions(level)
  const done = finishedRegions(grid)
  const animals = ANIMALS.filter((animal) => (needed[animal.size] ?? 0) > 0)
  const { t } = useI18n()
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${animals.length}, minmax(0, 1fr))` }} role="group" aria-label={t.chooseAnimal}>
      {animals.map((animal) => {
        const isSelected = selected === animal.emoji
        const finished = done[animal.size] ?? 0
        const total = needed[animal.size] ?? 0
        return (
          <button
            key={animal.emoji}
            type="button"
            aria-pressed={isSelected}
            aria-label={fill(t.animalButton, { name: t.animals[animal.emoji], size: animal.size, finished, total })}
            onClick={() => onSelect(animal.emoji)}
            className={cn(
              'flex min-h-14 flex-col items-center justify-center rounded-2xl px-1 py-1.5 text-[#3D2C29] touch-manipulation sm:min-h-16 sm:py-2',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B9D]',
              isSelected && 'scale-[1.04]',
            )}
            style={{
              background: isSelected ? animal.complete : animal.fill,
              boxShadow: isSelected ? `0 0 0 3px ${animal.accent}` : 'inset 0 0 0 1px #E5D5C0',
            }}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {animal.emoji}
            </span>
            <span className="mt-1 hidden text-[11px] font-semibold [@media(min-height:520px)]:block">{t.animals[animal.emoji]}</span>
            <span className="text-xs font-bold tabular-nums" style={{ color: animal.ink }}>
              {animal.size} · {finished}/{total}
            </span>
          </button>
        )
      })}
    </div>
  )
}
