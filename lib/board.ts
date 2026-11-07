import { animalFromSize, getAnimalByEmoji } from '@/lib/animals'
import { analyzeSizes } from '@/lib/solver'
import type { Animal, Cell, Level } from '@/types/game'

export const sizesFromGrid = (grid: Cell[][]): number[][] =>
  grid.map((row) => row.map((cell) => (cell.animal ? getAnimalByEmoji(cell.animal).size : 0)))

export const decorateGrid = (grid: Cell[][]): Cell[][] => {
  const analysis = analyzeSizes(sizesFromGrid(grid))
  return grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const info = analysis.cells[rowIndex]?.[colIndex]
      return {
        ...cell,
        regionId: info?.regionId ?? null,
        isComplete: info?.isComplete ?? false,
        hasError: info?.hasError ?? false,
      }
    }),
  )
}

export const createGrid = (level: Level): Cell[][] => {
  const grid = level.solution.map((row, rowIndex) =>
    row.map((value, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      animal: level.givens[rowIndex]?.[colIndex] ? animalFromSize(value) : null,
      isHint: Boolean(level.givens[rowIndex]?.[colIndex]),
      regionId: null,
      isComplete: false,
      hasError: false,
    })),
  )
  return decorateGrid(grid)
}

export const countRegionsBySize = (sizes: number[][]): Record<number, number> => {
  const analysis = analyzeSizes(sizes)
  const seen = new Set<number>()
  const counts: Record<number, number> = {}
  for (let row = 0; row < sizes.length; row += 1) {
    for (let col = 0; col < sizes.length; col += 1) {
      const id = analysis.cells[row]?.[col]?.regionId
      if (id === null || id === undefined || seen.has(id)) continue
      if (!analysis.cells[row]?.[col]?.isComplete) continue
      seen.add(id)
      const size = sizes[row]?.[col] ?? 0
      counts[size] = (counts[size] ?? 0) + 1
    }
  }
  return counts
}

export const neededRegions = (level: Level): Record<number, number> => countRegionsBySize(level.solution)

export const finishedRegions = (grid: Cell[][]): Record<number, number> => countRegionsBySize(sizesFromGrid(grid))

export const isSolvedGrid = (grid: Cell[][]): boolean =>
  grid.length > 0 && grid.every((row) => row.every((cell) => cell.animal !== null && cell.isComplete && !cell.hasError))

export const completeSignatures = (grid: Cell[][]): Set<string> => {
  const groups = new Map<number, string[]>()
  for (const row of grid) {
    for (const cell of row) {
      if (!cell.isComplete || cell.regionId === null) continue
      const list = groups.get(cell.regionId) ?? []
      list.push(`${cell.row}:${cell.col}`)
      groups.set(cell.regionId, list)
    }
  }
  const signatures = new Set<string>()
  for (const cells of groups.values()) signatures.add([...cells].sort().join('|'))
  return signatures
}

export const replaceAnimal = (grid: Cell[][], row: number, col: number, animal: Animal | null): Cell[][] =>
  decorateGrid(
    grid.map((line, rowIndex) =>
      line.map((cell, colIndex) => (rowIndex === row && colIndex === col ? { ...cell, animal } : cell)),
    ),
  )
