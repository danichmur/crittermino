import type { Level } from '@/types/game'

export interface SolveSummary {
  status: 'unique' | 'multiple' | 'none' | 'unknown'
  solutions: number
}

export interface CellAnalysis {
  regionId: number | null
  isComplete: boolean
  hasError: boolean
}

export interface BoardAnalysis {
  cells: CellAnalysis[][]
  completeRegions: number
  solved: boolean
}

interface SearchState {
  nodes: number
  exhausted: boolean
  maxNodes: number
}

const neighborCache = new Map<number, number[][]>()
const partitionCache = new Map<string, boolean>()

export const neighborsOf = (index: number, size: number): readonly number[] => {
  let table = neighborCache.get(size)
  if (!table) {
    table = Array.from({ length: size * size }, (_, cell) => {
      const row = Math.floor(cell / size)
      const col = cell % size
      const neighbors: number[] = []
      if (row > 0) neighbors.push(cell - size)
      if (row < size - 1) neighbors.push(cell + size)
      if (col > 0) neighbors.push(cell - 1)
      if (col < size - 1) neighbors.push(cell + 1)
      return neighbors
    })
    neighborCache.set(size, table)
  }
  return table[index] ?? []
}

export const canPartition = (total: number, sizes: readonly number[]): boolean => {
  if (total === 0) return true
  const key = `${total}:${sizes.join(',')}`
  const cached = partitionCache.get(key)
  if (cached !== undefined) return cached
  const possible = new Uint8Array(total + 1)
  possible[0] = 1
  for (let sum = 0; sum <= total; sum += 1) {
    if (possible[sum] === 0) continue
    for (const size of sizes) {
      if (sum + size <= total) possible[sum + size] = 1
    }
  }
  const ok = possible[total] === 1
  partitionCache.set(key, ok)
  return ok
}

const strictComponent = (grid: Uint8Array, size: number, start: number): number[] => {
  const value = grid[start] ?? 0
  const cells: number[] = []
  const seen = new Uint8Array(grid.length)
  const stack = [start]
  seen[start] = 1
  while (stack.length > 0) {
    const current = stack.pop() as number
    cells.push(current)
    for (const neighbor of neighborsOf(current, size)) {
      if (seen[neighbor] === 0 && grid[neighbor] === value) {
        seen[neighbor] = 1
        stack.push(neighbor)
      }
    }
  }
  return cells
}

/** Same-value cells that could still merge, plus the empty cells that would join them. */
const growthBlob = (grid: Uint8Array, size: number, start: number): { valued: number[]; empties: number[] } => {
  const value = grid[start] ?? 0
  const valued: number[] = []
  const empties: number[] = []
  const seenValue = new Uint8Array(grid.length)
  const seenEmpty = new Uint8Array(grid.length)
  const stack = [start]
  seenValue[start] = 1
  while (stack.length > 0) {
    const current = stack.pop() as number
    if ((grid[current] ?? 0) === 0) empties.push(current)
    else valued.push(current)
    for (const neighbor of neighborsOf(current, size)) {
      const neighborValue = grid[neighbor] ?? 0
      if (neighborValue === value && seenValue[neighbor] === 0) {
        seenValue[neighbor] = 1
        stack.push(neighbor)
      } else if (neighborValue === 0 && seenEmpty[neighbor] === 0) {
        seenEmpty[neighbor] = 1
        stack.push(neighbor)
      }
    }
  }
  return { valued, empties }
}

const gridConsistent = (grid: Uint8Array, size: number, palette: readonly number[]): boolean => {
  const allowed = new Set(palette)
  const seen = new Uint8Array(grid.length)
  for (let index = 0; index < grid.length; index += 1) {
    const value = grid[index] ?? 0
    if (value === 0 || seen[index] === 1) continue
    if (!allowed.has(value)) return false
    const cells = strictComponent(grid, size, index)
    for (const cell of cells) seen[cell] = 1
    if (cells.length > value) return false
    const blob = growthBlob(grid, size, index)
    if (blob.valued.length + blob.empties.length < value) return false
  }
  return true
}

const localCandidates = (grid: Uint8Array, size: number, palette: readonly number[], cell: number): number[] => {
  const result: number[] = []
  for (const value of palette) {
    grid[cell] = value
    if (gridConsistent(grid, size, palette)) result.push(value)
    grid[cell] = 0
  }
  return result
}

const propagate = (grid: Uint8Array, size: number, palette: readonly number[]): boolean => {
  const allowed = new Set(palette)
  const limit = size * size + 1
  for (let guard = 0; guard <= limit; guard += 1) {
    if (guard === limit) return false
    const seen = new Uint8Array(grid.length)
    let filled = false
    for (let index = 0; index < grid.length; index += 1) {
      const value = grid[index] ?? 0
      if (value === 0 || seen[index] === 1) continue
      if (!allowed.has(value)) return false
      const cells = strictComponent(grid, size, index)
      for (const cell of cells) seen[cell] = 1
      if (cells.length > value) return false
      const blob = growthBlob(grid, size, index)
      const room = blob.valued.length + blob.empties.length
      if (room < value) return false
      if (room === value && blob.empties.length > 0) {
        for (const empty of blob.empties) grid[empty] = value
        filled = true
        break
      }
    }
    if (filled) continue
    let single = -1
    let singleValue = 0
    for (let index = 0; index < grid.length; index += 1) {
      if (grid[index] !== 0) continue
      const candidates = localCandidates(grid, size, palette, index)
      if (candidates.length === 0) return false
      if (candidates.length === 1) {
        single = index
        singleValue = candidates[0] ?? 0
        break
      }
    }
    if (single >= 0) {
      grid[single] = singleValue
      continue
    }
    return true
  }
  return false
}

const isExactCover = (grid: Uint8Array, size: number, palette: readonly number[]): boolean => {
  const allowed = new Set(palette)
  const seen = new Uint8Array(grid.length)
  for (let index = 0; index < grid.length; index += 1) {
    const value = grid[index] ?? 0
    if (value === 0 || !allowed.has(value)) return false
    if (seen[index] === 1) continue
    const cells = strictComponent(grid, size, index)
    if (cells.length !== value) return false
    for (const cell of cells) seen[cell] = 1
  }
  return true
}

const pickCell = (
  grid: Uint8Array,
  size: number,
  palette: readonly number[],
): { cell: number; candidates: number[] } | null => {
  let best: { cell: number; candidates: number[] } | null = null
  for (let index = 0; index < grid.length; index += 1) {
    if (grid[index] !== 0) continue
    const candidates = localCandidates(grid, size, palette, index)
    if (candidates.length === 0) return { cell: index, candidates }
    if (!best || candidates.length < best.candidates.length) {
      best = { cell: index, candidates }
    }
  }
  return best
}

const search = (grid: Uint8Array, size: number, palette: readonly number[], limit: number, state: SearchState): number => {
  state.nodes += 1
  if (state.nodes > state.maxNodes) {
    state.exhausted = true
    return limit
  }
  const snapshot = grid.slice()
  if (!propagate(grid, size, palette)) {
    grid.set(snapshot)
    return 0
  }
  const picked = pickCell(grid, size, palette)
  if (!picked) {
    const solved = isExactCover(grid, size, palette)
    grid.set(snapshot)
    return solved ? 1 : 0
  }
  if (picked.candidates.length === 0) {
    grid.set(snapshot)
    return 0
  }
  let found = 0
  for (const value of picked.candidates) {
    grid[picked.cell] = value
    found += search(grid, size, palette, limit, state)
    if (found >= limit) break
  }
  grid.set(snapshot)
  return found
}

const normalizePalette = (palette: readonly number[]): number[] => [...new Set(palette)].sort((left, right) => left - right)

const toFlat = (grid: number[][]): Uint8Array => {
  const size = grid.length
  const flat = new Uint8Array(size * size)
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) flat[row * size + col] = grid[row]?.[col] ?? 0
  }
  return flat
}

const nodeBudget = (size: number): number => {
  if (size <= 4) return 40000
  if (size === 5) return 80000
  if (size === 6) return 120000
  return 160000
}

/**
 * Count completions, stopping at `limit`.
 * `unknown` means the search hit its node budget before it could prove the count.
 */
export const evaluatePuzzle = (grid: number[][], palette: readonly number[], limit = 2): SolveSummary => {
  const size = grid.length
  if (size === 0 || grid.some((row) => row.length !== size)) return { status: 'none', solutions: 0 }
  const flat = toFlat(grid)
  const normalized = normalizePalette(palette)
  const state: SearchState = { nodes: 0, exhausted: false, maxNodes: nodeBudget(size) }
  const solutions = search(flat, size, normalized, limit, state)
  if (state.exhausted) return { status: 'unknown', solutions }
  if (solutions <= 0) return { status: 'none', solutions: 0 }
  if (solutions === 1) return { status: 'unique', solutions: 1 }
  return { status: 'multiple', solutions }
}

export const isValidSolution = (grid: number[][], palette: readonly number[]): boolean => {
  const size = grid.length
  if (size === 0 || grid.some((row) => row.length !== size)) return false
  return isExactCover(toFlat(grid), size, normalizePalette(palette))
}

/** Partial grid: no region is already too big, and every region still has cells it could claim. */
export const canExtendFlat = (flat: Uint8Array, size: number, palette: readonly number[]): boolean =>
  gridConsistent(flat, size, normalizePalette(palette))

/** Region status for the board the player is building. Incomplete homes are not errors. */
export const analyzeSizes = (grid: number[][]): BoardAnalysis => {
  const size = grid.length
  const cells: CellAnalysis[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ regionId: null, isComplete: false, hasError: false })),
  )
  const flat = toFlat(grid)
  const seen = new Uint8Array(flat.length)
  let nextId = 1
  let completeRegions = 0
  let filled = 0
  let broken = false
  for (let index = 0; index < flat.length; index += 1) {
    const value = flat[index] ?? 0
    if (value === 0 || seen[index] === 1) continue
    const component = strictComponent(flat, size, index)
    for (const cell of component) seen[cell] = 1
    const blob = growthBlob(flat, size, index)
    const exact = component.length === value
    const overflow = component.length > value
    const starved = blob.valued.length + blob.empties.length < value
    const hasError = overflow || starved
    if (exact && !hasError) completeRegions += 1
    if (hasError) broken = true
    filled += component.length
    const regionId = nextId
    nextId += 1
    for (const cell of component) {
      const row = Math.floor(cell / size)
      const col = cell % size
      const slot = cells[row]?.[col]
      if (!slot) continue
      slot.regionId = regionId
      slot.isComplete = exact
      slot.hasError = hasError
    }
  }
  return {
    cells,
    completeRegions,
    solved: filled === size * size && !broken && completeRegions > 0,
  }
}

export const findForcedMove = (
  grid: number[][],
  palette: readonly number[],
): { row: number; col: number; value: number } | null => {
  const size = grid.length
  const flat = toFlat(grid)
  const normalized = normalizePalette(palette)
  const before = flat.slice()
  if (!propagate(flat, size, normalized)) return null
  for (let index = 0; index < flat.length; index += 1) {
    if (before[index] === 0 && (flat[index] ?? 0) !== 0) {
      return { row: Math.floor(index / size), col: index % size, value: flat[index] ?? 0 }
    }
  }
  return null
}

/** Throws when a level is not a finished, uniquely solvable Fillomino. */
export const assertPlayable = (level: Level): void => {
  if (!isValidSolution(level.solution, level.palette)) {
    throw new Error(`Level ${level.number} solution breaks Fillomino rules`)
  }
  const masked = level.solution.map((row, rowIndex) =>
    row.map((value, colIndex) => (level.givens[rowIndex]?.[colIndex] ? value : 0)),
  )
  const result = evaluatePuzzle(masked, level.palette)
  if (result.status !== 'unique') {
    throw new Error(`Level ${level.number} is ${result.status}`)
  }
}
