'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { Animal, Burst, Cell as CellData } from '@/types/game'
import { Cell } from '@/components/Game/Cell'

interface GridProps {
  grid: CellData[][]
  shakes: Record<string, number>
  bursts: Burst[]
  spotlight: { row: number; col: number } | null
  highlight: { row: number; col: number } | null
  ghostCells: Array<{ row: number; col: number }>
  ghostAnimal: Animal | null
  onPress: (row: number, col: number) => void
}

export const Grid = ({ grid, shakes, bursts, spotlight, highlight, ghostCells, ghostAnimal, onPress }: GridProps) => {
  const size = grid.length
  const reduceMotion = useReducedMotion()
  if (size === 0) return null
  return (
    <div className="relative aspect-square w-full">
      <div
        className="@container grid h-full w-full gap-1.5 sm:gap-2"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row) =>
          row.map((cell) => {
            const ghost = ghostCells.some((item) => item.row === cell.row && item.col === cell.col)
            return (
              <div key={`${cell.row}-${cell.col}`} className="@container">
                <Cell
                  cell={cell}
                  shake={shakes[`${cell.row}:${cell.col}`] ?? 0}
                  showHand={spotlight?.row === cell.row && spotlight.col === cell.col}
                  highlighted={highlight?.row === cell.row && highlight.col === cell.col}
                  ghost={ghost ? ghostAnimal : null}
                  onPress={onPress}
                />
              </div>
            )
          }),
        )}
      </div>
      <div className="pointer-events-none absolute inset-0">
        {bursts.map((burst) => (
          <span key={burst.id} className="absolute" style={{ left: `${((burst.col + 0.5) / size) * 100}%`, top: `${((burst.row + 0.5) / size) * 100}%` }}>
            {Array.from({ length: 8 }, (_, index) => (
              <motion.span
                key={index}
                className="absolute h-2 w-2 rounded-full"
                style={{ background: burst.color }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={
                  reduceMotion
                    ? { opacity: 0 }
                    : {
                        x: Math.cos((index / 8) * Math.PI * 2) * (18 + (index % 3) * 8),
                        y: Math.sin((index / 8) * Math.PI * 2) * (18 + (index % 3) * 8),
                        opacity: 0,
                        scale: 0.6,
                      }
                }
                transition={{ duration: 0.55, ease: 'easeOut' }}
              />
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
