import type { Difficulty, Level, TutorialCue } from '@/types/game'
import { createRng, seedForLevel, type Rng } from '@/lib/rng'
import { canExtendFlat, canPartition, evaluatePuzzle, isValidSolution, neighborsOf } from '@/lib/solver'

interface LevelConfig {
  size: number
  palette: number[]
  difficulty: Difficulty
  clueRatio: number
  keepOneClue: boolean
  intro?: string
  tutorial?: TutorialCue
}

interface CarveLocks {
  given: Set<number>
  empty: Set<number>
}

const rowsFromFlat = (flat: Uint8Array, size: number): number[][] => {
  const rows: number[][] = []
  for (let row = 0; row < size; row += 1) {
    const line: number[] = []
    for (let col = 0; col < size; col += 1) line.push(flat[row * size + col] ?? 0)
    rows.push(line)
  }
  return rows
}

const snakePath = (size: number, columnMajor: boolean): number[] => {
  const path: number[] = []
  if (!columnMajor) {
    for (let row = 0; row < size; row += 1) {
      const columns = Array.from({ length: size }, (_, col) => col)
      const ordered = row % 2 === 0 ? columns : columns.reverse()
      for (const col of ordered) path.push(row * size + col)
    }
    return path
  }
  for (let col = 0; col < size; col += 1) {
    const rows = Array.from({ length: size }, (_, row) => row)
    const ordered = col % 2 === 0 ? rows : rows.reverse()
    for (const row of ordered) path.push(row * size + col)
  }
  return path
}

const spiralPath = (size: number): number[] => {
  const path: number[] = []
  let top = 0
  let bottom = size - 1
  let left = 0
  let right = size - 1
  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col += 1) path.push(top * size + col)
    top += 1
    for (let row = top; row <= bottom; row += 1) path.push(row * size + right)
    right -= 1
    if (top <= bottom) {
      for (let col = right; col >= left; col -= 1) path.push(bottom * size + col)
      bottom -= 1
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row -= 1) path.push(row * size + left)
      left += 1
    }
  }
  return path
}

const tryHamiltonian = (size: number, rng: Rng): number[] | null => {
  const total = size * size
  const start = rng.int(total)
  const path = [start]
  const used = new Uint8Array(total)
  used[start] = 1
  let nodes = 0
  const onward = (cell: number): number => neighborsOf(cell, size).filter((neighbor) => used[neighbor] === 0).length
  const visit = (): boolean => {
    if (path.length === total) return true
    nodes += 1
    if (nodes > 20000) return false
    const current = path[path.length - 1] as number
    const options = neighborsOf(current, size).filter((neighbor) => used[neighbor] === 0)
    const groups = new Map<number, number[]>()
    for (const option of options) {
      const key = onward(option)
      const list = groups.get(key)
      if (list) list.push(option)
      else groups.set(key, [option])
    }
    const ordered: number[] = []
    for (const key of [...groups.keys()].sort((left, right) => left - right)) {
      ordered.push(...rng.shuffle(groups.get(key) ?? []))
    }
    for (const next of ordered) {
      used[next] = 1
      path.push(next)
      if (visit()) return true
      path.pop()
      used[next] = 0
    }
    return false
  }
  return visit() ? path.slice() : null
}

const buildPath = (size: number, rng: Rng): number[] => {
  const roll = rng.next()
  if (roll < 0.6) {
    const organic = tryHamiltonian(size, rng)
    if (organic) return organic
  }
  if (roll < 0.8) return snakePath(size, false)
  if (roll < 0.92) return snakePath(size, true)
  return spiralPath(size)
}

const randomComposition = (total: number, sizes: readonly number[], rng: Rng): number[] | null => {
  const parts: number[] = []
  const compose = (remaining: number): boolean => {
    if (remaining === 0) return true
    const options = rng.shuffle(sizes.filter((size) => size <= remaining))
    for (const size of options) {
      if (remaining !== size && !canPartition(remaining - size, sizes)) continue
      parts.push(size)
      if (compose(remaining - size)) return true
      parts.pop()
    }
    return false
  }
  return compose(total) ? parts.slice() : null
}

const paintPath = (path: readonly number[], parts: readonly number[]): Uint8Array | null => {
  const flat = new Uint8Array(path.length)
  let cursor = 0
  for (const size of parts) {
    if (cursor + size > path.length) return null
    for (let step = 0; step < size; step += 1) {
      const cell = path[cursor + step]
      if (cell === undefined) return null
      flat[cell] = size
    }
    cursor += size
  }
  if (cursor !== path.length) return null
  return flat
}

const randomShape = (grid: Uint8Array, size: number, start: number, target: number, rng: Rng): number[] | null => {
  const shape = [start]
  const member = new Set<number>([start])
  while (shape.length < target) {
    const frontier: number[] = []
    const seen = new Set<number>()
    for (const cell of shape) {
      for (const neighbor of neighborsOf(cell, size)) {
        if (grid[neighbor] === 0 && !member.has(neighbor) && !seen.has(neighbor)) {
          seen.add(neighbor)
          frontier.push(neighbor)
        }
      }
    }
    if (frontier.length === 0) return null
    const next = frontier[rng.int(frontier.length)]
    if (next === undefined) return null
    shape.push(next)
    member.add(next)
  }
  return shape
}

const touchesSameSize = (shape: readonly number[], value: number, grid: Uint8Array, size: number): boolean => {
  const inside = new Set(shape)
  for (const cell of shape) {
    for (const neighbor of neighborsOf(cell, size)) {
      if (!inside.has(neighbor) && grid[neighbor] === value) return true
    }
  }
  return false
}

const tileByGrowth = (size: number, palette: readonly number[], rng: Rng): Uint8Array | null => {
  const grid = new Uint8Array(size * size)
  let nodes = 0
  const fill = (cursor: number): boolean => {
    nodes += 1
    if (nodes > 6000) return false
    let start = cursor
    while (start < grid.length && grid[start] !== 0) start += 1
    if (start === grid.length) return isValidSolution(rowsFromFlat(grid, size), palette)
    for (const value of rng.shuffle(palette)) {
      for (let attempt = 0; attempt < 4; attempt += 1) {
        const shape = randomShape(grid, size, start, value, rng)
        if (!shape || touchesSameSize(shape, value, grid, size)) continue
        for (const cell of shape) grid[cell] = value
        if (canExtendFlat(grid, size, palette) && fill(start + 1)) return true
        for (const cell of shape) grid[cell] = 0
      }
    }
    return false
  }
  return fill(0) ? grid.slice() : null
}

const generateSolution = (size: number, palette: readonly number[], rng: Rng): Uint8Array | null => {
  for (let attempt = 0; attempt < 70; attempt += 1) {
    const path = buildPath(size, rng)
    for (let cut = 0; cut < 24; cut += 1) {
      const parts = randomComposition(size * size, palette, rng)
      if (!parts) continue
      const painted = paintPath(path, parts)
      if (!painted) continue
      if (isValidSolution(rowsFromFlat(painted, size), palette)) return painted
    }
  }
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const tiled = tileByGrowth(size, palette, rng)
    if (tiled) return tiled
  }
  return null
}

const regionCells = (solution: Uint8Array, size: number): number[][] => {
  const seen = new Uint8Array(solution.length)
  const regions: number[][] = []
  for (let index = 0; index < solution.length; index += 1) {
    if (seen[index] === 1) continue
    const value = solution[index] ?? 0
    const cells: number[] = []
    const stack = [index]
    seen[index] = 1
    while (stack.length > 0) {
      const current = stack.pop() as number
      cells.push(current)
      for (const neighbor of neighborsOf(current, size)) {
        if (seen[neighbor] === 0 && solution[neighbor] === value) {
          seen[neighbor] = 1
          stack.push(neighbor)
        }
      }
    }
    regions.push(cells)
  }
  return regions
}

const countGivens = (givens: Uint8Array): number => givens.reduce((sum, value) => sum + value, 0)

const maskedRows = (solution: Uint8Array, givens: Uint8Array, size: number): number[][] => {
  const rows: number[][] = []
  for (let row = 0; row < size; row += 1) {
    const line: number[] = []
    for (let col = 0; col < size; col += 1) {
      const index = row * size + col
      line.push(givens[index] ? (solution[index] ?? 0) : 0)
    }
    rows.push(line)
  }
  return rows
}

const carveBudget = (size: number): number => {
  if (size <= 4) return 2500
  if (size === 5) return 5000
  if (size === 6) return 8000
  return 12000
}

const carveGivens = (
  solution: Uint8Array,
  size: number,
  palette: readonly number[],
  rng: Rng,
  clueRatio: number,
  keepOneClue: boolean,
  locks?: CarveLocks,
): Uint8Array | null => {
  const givens = new Uint8Array(solution.length)
  const regions = regionCells(solution, size)
  for (const index of locks?.given ?? []) givens[index] = 1
  for (const region of regions) {
    const open = region.filter((cell) => givens[cell] === 0 && !locks?.empty.has(cell))
    const already = region.some((cell) => givens[cell] === 1)
    if (already) continue
    if (open.length === 0) return null
    const pick = open[rng.int(open.length)]
    if (pick === undefined) return null
    givens[pick] = 1
  }
  const order = rng.shuffle(Array.from({ length: solution.length }, (_, index) => index))
  const target = Math.max(countGivens(givens), Math.round(solution.length * clueRatio))
  for (const index of order) {
    if (countGivens(givens) >= target) break
    if (locks?.empty.has(index)) continue
    givens[index] = 1
  }
  const deadline = Date.now() + carveBudget(size)
  let guard = 0
  while (guard < solution.length) {
    if (Date.now() > deadline) return null
    const result = evaluatePuzzle(maskedRows(solution, givens, size), palette)
    if (result.status === 'unique') break
    if (result.status === 'none') return null
    const hidden = order.filter((index) => givens[index] === 0 && !locks?.empty.has(index))
    if (hidden.length === 0) return null
    const pick = hidden[rng.int(hidden.length)]
    if (pick === undefined) return null
    givens[pick] = 1
    guard += 1
  }
  const minimum = Math.max(regions.length, Math.round(solution.length * Math.max(0.28, clueRatio - 0.14)))
  for (const index of rng.shuffle(order.filter((cell) => givens[cell] === 1))) {
    if (countGivens(givens) <= minimum) break
    if (Date.now() > deadline) break
    if (locks?.given.has(index)) continue
    if (keepOneClue) {
      const value = solution[index]
      const region = regions.find((cells) => cells.includes(index))
      const stillMarked = region?.some((cell) => cell !== index && givens[cell] === 1) ?? false
      if (!stillMarked || value === undefined) continue
    }
    givens[index] = 0
    const result = evaluatePuzzle(maskedRows(solution, givens, size), palette)
    if (result.status !== 'unique') givens[index] = 1
  }
  const finalResult = evaluatePuzzle(maskedRows(solution, givens, size), palette)
  if (finalResult.status !== 'unique') return null
  return givens
}

const toLevel = (
  levelNumber: number,
  solution: Uint8Array,
  givens: Uint8Array,
  config: LevelConfig,
): Level => {
  const solutionRows = rowsFromFlat(solution, config.size)
  const givenRows = Array.from({ length: config.size }, (_, row) =>
    Array.from({ length: config.size }, (_, col) => givens[row * config.size + col] === 1),
  )
  return {
    number: levelNumber,
    size: config.size,
    difficulty: config.difficulty,
    solution: solutionRows,
    givens: givenRows,
    palette: config.palette.slice(),
    tutorial: config.tutorial,
    intro: config.intro,
  }
}

const fixedLevel = (
  levelNumber: number,
  solution: number[][],
  givens: boolean[][],
  palette: number[],
  tutorial: TutorialCue,
): Level => ({
  number: levelNumber,
  size: solution.length,
  difficulty: 'tutorial',
  solution,
  givens,
  palette,
  tutorial,
})

const tutorialThree = (rng: Rng): Level | null => {
  const solutionRows = [
    [4, 4, 4, 2],
    [4, 2, 3, 2],
    [3, 2, 3, 3],
    [3, 3, 2, 2],
  ]
  const size = 4
  const flat = new Uint8Array(solutionRows.flat())
  const given = new Set<number>([3, 5, 7, 9, 14, 15])
  const empty = new Set<number>([6])
  const carved = carveGivens(flat, size, [2, 3, 4], rng, 0.62, true, { given, empty })
  if (!carved) return null
  return toLevel(3, flat, carved, {
    size,
    palette: [2, 3, 4],
    difficulty: 'tutorial',
    clueRatio: 0.62,
    keepOneClue: true,
    tutorial: {
      message: "Same-size homes can't share a wall. Cat sits between these mice.",
      spotlight: [{ row: 1, col: 2 }],
      select: '🐱',
    },
  })
}

const configFor = (levelNumber: number): LevelConfig => {
  if (levelNumber <= 5) {
    return {
      size: 4,
      palette: [2, 3, 4],
      difficulty: 'tutorial',
      clueRatio: levelNumber === 4 ? 0.62 : 0.5,
      keepOneClue: true,
      tutorial:
        levelNumber === 5
          ? { message: 'First real puzzle. The givens are all you need.', spotlight: [] }
          : undefined,
    }
  }
  if (levelNumber <= 10) {
    return { size: 5, palette: [2, 3, 4], difficulty: 'easy', clueRatio: 0.56, keepOneClue: true }
  }
  if (levelNumber <= 20) {
    return { size: 5, palette: [2, 3, 4], difficulty: 'easy', clueRatio: 0.46, keepOneClue: true }
  }
  if (levelNumber <= 35) {
    return {
      size: 6,
      palette: [2, 3, 4, 5],
      difficulty: 'medium',
      clueRatio: 0.48,
      keepOneClue: true,
      intro: levelNumber === 21 ? 'Panda needs a connected home of exactly 5 cells.' : undefined,
    }
  }
  if (levelNumber <= 50) {
    return {
      size: 6,
      palette: [2, 3, 4, 5, 6],
      difficulty: 'medium',
      clueRatio: 0.44,
      keepOneClue: false,
      intro: levelNumber === 36 ? 'Lion needs a roomy home of exactly 6 cells.' : undefined,
    }
  }
  return { size: 7, palette: [2, 3, 4, 5, 6], difficulty: 'hard', clueRatio: 0.42, keepOneClue: false }
}

/**
 * Build one puzzle. The same level number always returns the same grid.
 * Levels 1–2 are handcrafted lessons. Everything else is carved from a seeded tiling.
 */
export const generateLevel = (levelNumber: number): Level => {
  if (!Number.isInteger(levelNumber) || levelNumber < 1) {
    throw new Error(`Level must be a positive integer. Received ${levelNumber}.`)
  }
  if (levelNumber === 1) {
    return fixedLevel(
      1,
      [
        [4, 4, 4],
        [2, 2, 4],
        [3, 3, 3],
      ],
      [
        [true, true, true],
        [false, true, true],
        [true, true, true],
      ],
      [2, 3, 4],
      {
        message: 'Tap the glowing cell to give Mouse a 2-cell home.',
        spotlight: [{ row: 1, col: 0 }],
        select: '🐭',
      },
    )
  }
  if (levelNumber === 2) {
    return fixedLevel(
      2,
      [
        [2, 2, 3],
        [4, 4, 3],
        [4, 4, 3],
      ],
      [
        [true, true, false],
        [true, true, false],
        [true, true, false],
      ],
      [2, 3, 4],
      {
        message: 'Cat needs more room than Mouse — exactly 3 cells.',
        spotlight: [
          { row: 0, col: 2 },
          { row: 1, col: 2 },
          { row: 2, col: 2 },
        ],
        select: '🐱',
      },
    )
  }
  const rng = createRng(seedForLevel(levelNumber))
  if (levelNumber === 3) {
    const tutorial = tutorialThree(rng)
    if (!tutorial) throw new Error('Could not carve tutorial level 3')
    return tutorial
  }
  const config = configFor(levelNumber)
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const solution = generateSolution(config.size, config.palette, rng)
    if (!solution) continue
    const givens = carveGivens(solution, config.size, config.palette, rng, config.clueRatio, config.keepOneClue)
    if (!givens) continue
    const distinct = new Set(solution)
    if (config.palette.length > 1 && distinct.size < 2) continue
    return toLevel(levelNumber, solution, givens, config)
  }
  throw new Error(`Could not generate level ${levelNumber}`)
}
