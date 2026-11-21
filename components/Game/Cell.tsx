'use client'

import { useEffect, useRef, useState } from 'react'
import { getAnimalByEmoji } from '@/lib/animals'
import { fill } from '@/lib/i18n'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { cn } from '@/lib/cn'
import type { Animal, Cell as CellData } from '@/types/game'
import { TutorialHand } from '@/components/Tutorial/InteractiveTutorial'

interface CellProps {
  cell: CellData
  shake: number
  showHand: boolean
  highlighted: boolean
  ghost: Animal | null
  onPress: (row: number, col: number) => void
}

export const Cell = ({ cell, shake, showHand, highlighted, ghost, onPress }: CellProps) => {
  const { t } = useI18n()
  const animal = cell.animal ? getAnimalByEmoji(cell.animal) : null
  const ghostAnimal = ghost ? getAnimalByEmoji(ghost) : null
  const [motion, setMotion] = useState<'shake' | 'pop' | null>(null)
  const lastAnimal = useRef(cell.animal)
  const lastShake = useRef(0)
  useEffect(() => {
    if (!shake || shake === lastShake.current) return
    lastShake.current = shake
    setMotion('shake')
  }, [shake])
  useEffect(() => {
    if (!cell.animal || cell.isHint || cell.hasError) {
      lastAnimal.current = cell.animal
      return
    }
    if (cell.animal === lastAnimal.current) return
    lastAnimal.current = cell.animal
    setMotion('pop')
  }, [cell.animal, cell.isHint, cell.hasError])
  const label = [
    fill(t.cellWhere, { row: cell.row + 1, column: cell.col + 1 }),
    animal ? t.animals[animal.emoji] : t.cellEmpty,
    cell.isHint ? t.cellGiven : null,
    cell.isComplete ? t.cellComplete : null,
    cell.hasError ? t.cellError : null,
  ]
    .filter(Boolean)
    .join(', ')
  const background = cell.hasError ? '#FECDD3' : animal ? (cell.isComplete ? animal.complete : animal.fill) : '#FFFFFF'
  const outline = cell.hasError
    ? '#E11D48'
    : highlighted || showHand
      ? '#FF6B9D'
      : cell.isComplete && animal
        ? animal.accent
        : ghostAnimal
          ? ghostAnimal.accent
          : '#E5D5C0'
  return (
    <button
      type="button"
      data-row={cell.row}
      data-col={cell.col}
      aria-label={label}
      onClick={() => onPress(cell.row, cell.col)}
      onAnimationEnd={() => setMotion(null)}
      className={cn(
        'relative flex h-full w-full items-center justify-center rounded-2xl border touch-manipulation',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B9D]',
        ghost && !animal && 'border-dashed',
        motion === 'shake' && 'critter-cell-shake',
        motion === 'pop' && 'critter-cell-pop',
      )}
      style={{
        background,
        borderColor: outline,
        boxShadow: showHand ? '0 0 0 3px rgba(255, 107, 157, 0.45)' : undefined,
      }}
    >
      {animal ? (
        <span className="text-2xl leading-none" style={{ fontSize: 'clamp(1.15rem, 50cqi, 2.15rem)' }} aria-hidden="true">
          {animal.emoji}
        </span>
      ) : ghostAnimal ? (
        <span className="text-2xl leading-none opacity-40" style={{ fontSize: 'clamp(1.15rem, 50cqi, 2.15rem)' }} aria-hidden="true">
          {ghostAnimal.emoji}
        </span>
      ) : null}
      {animal ? (
        <span
          className="absolute text-[10px] leading-none font-bold tabular-nums"
          style={{ color: animal.ink, right: 'clamp(3px, 12cqi, 12px)', bottom: 'clamp(3px, 11cqi, 10px)' }}
        >
          {animal.size}
        </span>
      ) : null}
      {cell.isHint ? (
        <span
          className="absolute h-2 w-2 rounded-full"
          style={{ background: animal ? animal.accent : outline, top: 'clamp(3px, 12cqi, 12px)', left: 'clamp(3px, 12cqi, 12px)' }}
          aria-hidden="true"
        />
      ) : null}
      {showHand ? <TutorialHand /> : null}
    </button>
  )
}
