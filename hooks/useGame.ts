'use client'

import { create } from 'zustand'
import { animalFromSize, getAnimalByEmoji } from '@/lib/animals'
import { copy } from '@/lib/i18n'
import { getActiveLocale } from '@/lib/locale'
import { track } from '@/lib/analytics'
import { completeSignatures, createGrid, isSolvedGrid, replaceAnimal } from '@/lib/board'
import { generateLevel } from '@/lib/generator'
import { LEVEL_CAP } from '@/lib/campaign'
import { dailyLevelNumber } from '@/lib/daily'
import { getLevel, hasLevel } from '@/lib/levels'
import { buzz, playComplete, playError, playTap, playWin } from '@/lib/sound'
import { findForcedMove, neighborsOf } from '@/lib/solver'
import type { Animal, Burst, Cell, Coach, Level } from '@/types/game'
import { useProgress } from '@/hooks/useProgress'

interface WinSnapshot {
  isComplete: boolean
  elapsedMs: number
  isNewBest: boolean
  tutorialCelebration: boolean
}

interface GameStore {
  view: 'home' | 'play' | 'levels' | 'soon'
  playMode: 'campaign' | 'daily'
  level: Level | null
  grid: Cell[][]
  selectedAnimal: Animal | null
  moves: number
  hintsUsed: number
  isComplete: boolean
  startedAt: number
  elapsedMs: number
  coach: Coach | null
  shakes: Record<string, number>
  bursts: Burst[]
  menuOpen: boolean
  settingsOpen: boolean
  hintAdOpen: boolean
  toast: string | null
  isGenerating: boolean
  introVisible: boolean
  isNewBest: boolean
  tutorialCelebration: boolean
  showHome: () => void
  showLevels: () => void
  showSoon: () => void
  startLevel: (levelNumber: number, mode?: 'campaign' | 'daily') => void
  startDaily: () => void
  selectAnimal: (animal: Animal) => void
  tapCell: (row: number, col: number) => void
  requestHint: () => void
  grantHintFromAd: () => void
  restart: () => void
  openMenu: () => void
  closeMenu: () => void
  openSettings: () => void
  closeSettings: () => void
  closeHintAd: () => void
  dismissIntro: () => void
  showToast: (message: string) => void
}

let toastTimer = 0
let burstCounter = 0
const animalSize = (animal: Animal): number => getAnimalByEmoji(animal).size
const cellKey = (row: number, col: number): string => `${row}:${col}`

const bump = (shakes: Record<string, number>, key: string): Record<string, number> => ({
  ...shakes,
  [key]: (shakes[key] ?? 0) + 1,
})

const mismatch = (grid: Cell[][], level: Level): { row: number; col: number } | null => {
  for (let row = 0; row < level.size; row += 1) {
    for (let col = 0; col < level.size; col += 1) {
      if ((grid[row]?.[col]?.animal ?? null) !== animalFromSize(level.solution[row]?.[col] ?? 0)) {
        return { row, col }
      }
    }
  }
  return null
}

const solutionRegion = (level: Level, row: number, col: number): Array<{ row: number; col: number }> => {
  const value = level.solution[row]?.[col] ?? 0
  const seen = new Uint8Array(level.size * level.size)
  const stack = [row * level.size + col]
  seen[row * level.size + col] = 1
  const cells: Array<{ row: number; col: number }> = []
  while (stack.length > 0) {
    const current = stack.pop() as number
    const currentRow = Math.floor(current / level.size)
    const currentCol = current % level.size
    cells.push({ row: currentRow, col: currentCol })
    for (const neighbor of neighborsOf(current, level.size)) {
      const neighborRow = Math.floor(neighbor / level.size)
      const neighborCol = neighbor % level.size
      if (seen[neighbor] === 0 && level.solution[neighborRow]?.[neighborCol] === value) {
        seen[neighbor] = 1
        stack.push(neighbor)
      }
    }
  }
  return cells
}

const guideRegion = (
  grid: Cell[][],
  level: Level,
): { cells: Array<{ row: number; col: number }>; animal: Animal } | null => {
  const seen = new Uint8Array(level.size * level.size)
  let best: { cells: Array<{ row: number; col: number }>; animal: Animal; misses: number } | null = null
  for (let row = 0; row < level.size; row += 1) {
    for (let col = 0; col < level.size; col += 1) {
      const index = row * level.size + col
      if (seen[index] === 1) continue
      const cells = solutionRegion(level, row, col)
      for (const cell of cells) seen[cell.row * level.size + cell.col] = 1
      const animal = animalFromSize(level.solution[row]?.[col] ?? 0)
      if (!animal) continue
      const misses = cells.filter((cell) => grid[cell.row]?.[cell.col]?.animal !== animal).length
      if (misses > 0 && (!best || misses > best.misses)) best = { cells, animal, misses }
    }
  }
  return best ? { cells: best.cells, animal: best.animal } : null
}

const celebrate = (previous: Cell[][], next: Cell[][], bursts: Burst[]): Burst[] => {
  const before = completeSignatures(previous)
  const members = new Map<number, Array<{ row: number; col: number; animal: Animal }>>()
  for (const row of next) {
    for (const cell of row) {
      if (!cell.isComplete || cell.regionId === null || !cell.animal) continue
      const list = members.get(cell.regionId) ?? []
      list.push({ row: cell.row, col: cell.col, animal: cell.animal })
      members.set(cell.regionId, list)
    }
  }
  const added: Burst[] = []
  for (const list of members.values()) {
    const signature = list.map((cell) => `${cell.row}:${cell.col}`).sort().join('|')
    const origin = list[0]
    if (before.has(signature) || !origin) continue
    burstCounter += 1
    added.push({ id: burstCounter, row: origin.row, col: origin.col, color: getAnimalByEmoji(origin.animal).accent })
  }
  for (const burst of added) {
    const id = burst.id
    window.setTimeout(() => {
      useGame.setState({ bursts: useGame.getState().bursts.filter((item) => item.id !== id) })
    }, 720)
  }
  return [...bursts, ...added]
}

const finishIfSolved = (level: Level, grid: Cell[][], moves: number, startedAt: number): WinSnapshot => {
  if (!isSolvedGrid(grid)) {
    return { isComplete: false, elapsedMs: 0, isNewBest: false, tutorialCelebration: false }
  }
  const elapsedMs = Date.now() - startedAt
  const progress = useProgress.getState().progress
  const previousBest = progress.bestMoves[level.number]
  if (useGame.getState().playMode === 'daily') {
    useProgress.getState().completeDaily()
    track({ name: 'level_completed', level: level.number, moves, timeMs: elapsedMs })
    playWin()
    buzz([24, 40, 24, 40, 70])
    return { isComplete: true, elapsedMs, isNewBest: false, tutorialCelebration: false }
  }
  const tutorialCelebration = level.number === 5 && !progress.tutorialCompleted
  useProgress.getState().completeLevel(level.number, moves)
  track({ name: 'level_completed', level: level.number, moves, timeMs: elapsedMs })
  if (tutorialCelebration) track({ name: 'tutorial_completed' })
  playWin()
  buzz([24, 40, 24, 40, 70])
  return {
    isComplete: true,
    elapsedMs,
    isNewBest: previousBest !== undefined && moves < previousBest,
    tutorialCelebration,
  }
}

const applyHint = (): void => {
  const state = useGame.getState()
  const level = state.level
  if (!level || state.isComplete) return
  const mode = state.hintsUsed % 3
  const hintNumber = state.hintsUsed + 1
  if (mode === 0) {
    const sizes = state.grid.map((row) => row.map((cell) => (cell.animal ? animalSize(cell.animal) : 0)))
    const logical = findForcedMove(sizes, level.palette)
    const logicalOk = Boolean(
      logical &&
        !state.grid[logical.row]?.[logical.col]?.animal &&
        logical.value === level.solution[logical.row]?.[logical.col],
    )
    const target = logicalOk && logical ? { row: logical.row, col: logical.col } : mismatch(state.grid, level)
    if (!target) return
    useGame.setState({
      coach: {
        kind: 'cell',
        row: target.row,
        col: target.col,
        note: logicalOk ? 'only-one' : 'look',
      },
      hintsUsed: hintNumber,
    })
  } else if (mode === 1) {
    const highlighted = state.coach?.kind === 'cell' ? state.coach : null
    const highlightedWrong =
      highlighted !== null &&
      state.grid[highlighted.row]?.[highlighted.col]?.animal !==
        animalFromSize(level.solution[highlighted.row]?.[highlighted.col] ?? 0)
    const target = highlightedWrong && highlighted ? { row: highlighted.row, col: highlighted.col } : mismatch(state.grid, level)
    if (!target) return
    const animal = animalFromSize(level.solution[target.row]?.[target.col] ?? 0)
    if (!animal) return
    const grid = replaceAnimal(state.grid, target.row, target.col, animal)
    const solved = finishIfSolved(level, grid, state.moves, state.startedAt)
    if (!solved.isComplete) playComplete()
    useGame.setState({
      grid,
      coach: null,
      hintsUsed: hintNumber,
      bursts: celebrate(state.grid, grid, state.bursts),
      ...solved,
    })
  } else {
    const region = guideRegion(state.grid, level)
    if (!region) return
    useGame.setState({
      coach: {
        kind: 'region',
        cells: region.cells,
        animal: region.animal,
        note: 'outlined',
      },
      hintsUsed: hintNumber,
    })
  }
  useProgress.getState().recordHint()
  track({ name: 'hint_used', level: level.number, hintNumber })
}

const beginLevel = (level: Level): void => {
  window.scrollTo(0, 0)
  useGame.setState({
    view: 'play',
    level,
    grid: createGrid(level),
    selectedAnimal: level.tutorial?.select ?? null,
    moves: 0,
    hintsUsed: 0,
    isComplete: false,
    startedAt: Date.now(),
    elapsedMs: 0,
    coach: null,
    shakes: {},
    bursts: [],
    menuOpen: false,
    settingsOpen: false,
    hintAdOpen: false,
    isGenerating: false,
    introVisible: Boolean(level.intro),
    isNewBest: false,
    tutorialCelebration: false,
  })
  track({ name: 'level_started', level: level.number })
  useProgress.getState().touchStreak()
}

export const useGame = create<GameStore>((set, get) => ({
  view: 'home',
  playMode: 'campaign',
  level: null,
  grid: [],
  selectedAnimal: null,
  moves: 0,
  hintsUsed: 0,
  isComplete: false,
  startedAt: 0,
  elapsedMs: 0,
  coach: null,
  shakes: {},
  bursts: [],
  menuOpen: false,
  settingsOpen: false,
  hintAdOpen: false,
  toast: null,
  isGenerating: false,
  introVisible: false,
  isNewBest: false,
  tutorialCelebration: false,
  showToast: (message) => {
    window.clearTimeout(toastTimer)
    set({ toast: message })
    toastTimer = window.setTimeout(() => set({ toast: null }), 2200)
  },
  showHome: () => set({ view: 'home', menuOpen: false, settingsOpen: false }),
  showLevels: () => set({ view: 'levels', menuOpen: false, settingsOpen: false }),
  showSoon: () => set({ view: 'soon', menuOpen: false, settingsOpen: false, isComplete: false, isGenerating: false }),
  openMenu: () => set({ menuOpen: true }),
  closeMenu: () => set({ menuOpen: false }),
  openSettings: () => set({ settingsOpen: true, menuOpen: false }),
  closeSettings: () => set({ settingsOpen: false }),
  closeHintAd: () => set({ hintAdOpen: false }),
  dismissIntro: () => set({ introVisible: false }),
  selectAnimal: (animal) => set({ selectedAnimal: get().selectedAnimal === animal ? null : animal }),
  startDaily: () => {
    get().startLevel(dailyLevelNumber(), 'daily')
  },
  startLevel: (levelNumber, mode = 'campaign') => {
    set({ playMode: mode })
    if (levelNumber > LEVEL_CAP) {
      get().showSoon()
      return
    }
    if (hasLevel(levelNumber)) {
      beginLevel(getLevel(levelNumber))
      return
    }
    set({ view: 'play', isGenerating: true, menuOpen: false, level: null, grid: [] })
    window.setTimeout(() => {
      try {
        beginLevel(generateLevel(levelNumber))
      } catch {
        set({ isGenerating: false, view: 'home' })
        get().showToast(copy[getActiveLocale()].puzzleFailed)
      }
    }, 40)
  },
  restart: () => {
    const level = get().level
    if (!level) return
    set({
      grid: createGrid(level),
      moves: 0,
      hintsUsed: 0,
      isComplete: false,
      startedAt: Date.now(),
      elapsedMs: 0,
      coach: null,
      shakes: {},
      bursts: [],
      menuOpen: false,
      isNewBest: false,
      tutorialCelebration: false,
      selectedAnimal: level.tutorial?.select ?? get().selectedAnimal,
    })
  },
  tapCell: (row, col) => {
    const state = get()
    if (!state.level || state.isComplete || state.isGenerating) return
    const current = state.grid[row]?.[col]
    if (!current) return
    if (current.isHint) {
      set({ shakes: bump(state.shakes, cellKey(row, col)) })
      playTap()
      return
    }
    if (!current.animal && !state.selectedAnimal) {
      get().showToast(copy[getActiveLocale()].pickAnimal)
      return
    }
    const isErase = Boolean(current.animal)
    const nextAnimal = isErase ? null : state.selectedAnimal
    const grid = replaceAnimal(state.grid, row, col, nextAnimal)
    const placed = grid[row]?.[col]
    const before = completeSignatures(state.grid)
    const after = completeSignatures(grid)
    const grew = [...after].some((signature) => !before.has(signature))
    const moveCount = isErase ? Math.max(0, state.moves - 1) : state.moves + 1
    const solved = finishIfSolved(state.level, grid, moveCount, state.startedAt)
    if (placed?.hasError) {
      playError()
      buzz([18, 30, 18])
    } else if (!solved.isComplete && grew) {
      playComplete()
      buzz(12)
    } else if (!solved.isComplete) {
      playTap()
      buzz(8)
    }
    if (isErase) {
      if (state.moves > 0) useProgress.getState().undoMove()
    } else {
      useProgress.getState().recordMove()
    }
    set({
      grid,
      moves: moveCount,
      shakes: placed?.hasError ? bump(state.shakes, cellKey(row, col)) : state.shakes,
      coach: null,
      introVisible: false,
      bursts: celebrate(state.grid, grid, state.bursts),
      ...solved,
    })
  },
  requestHint: () => {
    const state = get()
    if (!state.level || state.isComplete) return
    applyHint()
  },
  grantHintFromAd: () => {
    set({ hintAdOpen: false })
    applyHint()
  },
}))
