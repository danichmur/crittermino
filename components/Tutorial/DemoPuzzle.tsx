'use client'

import { useState } from 'react'
import { createGrid, isSolvedGrid, replaceAnimal } from '@/lib/board'
import { getLevel } from '@/lib/levels'
import type { Animal } from '@/types/game'
import { AnimalSelector } from '@/components/Game/AnimalSelector'
import { Grid } from '@/components/Game/Grid'
import { useI18n } from '@/components/Locale/LocaleProvider'

const demoLevel = getLevel(1)

export const DemoPuzzle = () => {
  const [grid, setGrid] = useState(() => createGrid(demoLevel))
  const [selected, setSelected] = useState<Animal | null>('🐭')
  const solved = isSolvedGrid(grid)
  const { t } = useI18n()
  const onPress = (row: number, col: number): void => {
    const cell = grid[row]?.[col]
    if (!cell || cell.isHint || !selected || solved) return
    const next = cell.animal === selected ? null : selected
    setGrid(replaceAnimal(grid, row, col, next))
  }
  return (
    <div className="mx-auto w-full max-w-sm">
      <Grid
        grid={grid}
        shakes={{}}
        bursts={[]}
        spotlight={solved ? null : { row: 1, col: 0 }}
        highlight={null}
        ghostCells={[]}
        ghostAnimal={null}
        onPress={onPress}
      />
      <AnimalSelector level={demoLevel} grid={grid} selected={selected} onSelect={setSelected} />
      {solved ? <p className="mt-3 text-center font-display text-lg font-bold text-[#1B7A45]">{t.howToSolved}</p> : null}
    </div>
  )
}
