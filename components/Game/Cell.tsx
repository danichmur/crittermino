'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
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
  const controls = useAnimationControls()
  const reduceMotion = useReducedMotion()
  const wasComplete = useRef(cell.isComplete)
  const { t } = useI18n()
  const animal = cell.animal ? getAnimalByEmoji(cell.animal) : null
  const ghostAnimal = ghost ? getAnimalByEmoji(ghost) : null
  useEffect(() => {
    if (!shake || reduceMotion) return
    void controls.start({ x: [0, -7, 7, -4, 4, 0], transition: { duration: 0.28, ease: 'easeOut' } })
  }, [shake, reduceMotion, controls])
  useEffect(() => {
    if (!cell.animal || cell.isHint || cell.hasError || reduceMotion) return
    void controls.start({ scale: [1, 1.12, 0.98, 1], transition: { duration: 0.26, ease: 'easeOut' } })
  }, [cell.animal, cell.isHint, cell.hasError, reduceMotion, controls])
  useEffect(() => {
    if (cell.isComplete && !wasComplete.current && !reduceMotion) {
      void controls.start({ rotate: [0, -4, 4, -2, 0], transition: { duration: 0.4, ease: 'easeOut' } })
    }
    wasComplete.current = cell.isComplete
  }, [cell.isComplete, reduceMotion, controls])
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
  const outline = cell.hasError ? '#E11D48' : highlighted ? '#FF6B9D' : cell.isComplete && animal ? animal.accent : ghostAnimal ? ghostAnimal.accent : '#E5D5C0'
  return (
    <motion.button
      type="button"
      animate={controls}
      data-row={cell.row}
      data-col={cell.col}
      aria-label={label}
      onClick={() => onPress(cell.row, cell.col)}
      className={cn(
        'relative flex h-full w-full items-center justify-center rounded-xl border-2 touch-manipulation',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B9D]',
        highlighted && !reduceMotion && 'animate-pulse',
        ghost && !animal && 'border-dashed',
      )}
      style={{ background, borderColor: outline }}
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
        <span className="absolute right-1 bottom-0.5 text-[10px] font-bold tabular-nums" style={{ color: animal.ink }}>
          {animal.size}
        </span>
      ) : null}
      {cell.isHint ? <span className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-[#3D2C29]/30" aria-hidden="true" /> : null}
      {showHand ? <TutorialHand /> : null}
    </motion.button>
  )
}
