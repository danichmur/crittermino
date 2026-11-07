import { LEVEL_CAP } from '@/lib/campaign'
import type { Progress } from '@/types/game'

const STORAGE_KEY = 'crittermino-progress-v1'

export const defaultProgress = (): Progress => ({
  currentLevel: 1,
  completedLevels: [],
  bestMoves: {},
  hintsUsed: 0,
  totalMoves: 0,
  streak: 0,
  lastPlayed: '',
  soundEnabled: true,
  hapticsEnabled: true,
  tutorialCompleted: false,
})

export const localDate = (date: Date = new Date()): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const previousDate = (date: Date = new Date()): string => {
  const copy = new Date(date)
  copy.setDate(copy.getDate() - 1)
  return localDate(copy)
}

export const withStreak = (progress: Progress): Progress => {
  const today = localDate()
  if (progress.lastPlayed === today) return progress
  const streak = progress.lastPlayed === previousDate() ? progress.streak + 1 : 1
  return { ...progress, streak, lastPlayed: today }
}

export const streakLabel = (progress: Progress): string | null => {
  if (!progress.lastPlayed || progress.streak <= 0) return null
  if (progress.lastPlayed === localDate()) return `${progress.streak}-day streak`
  if (progress.lastPlayed === previousDate()) return `Play today to keep a ${progress.streak}-day streak`
  return null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Read saved progress. Corrupt or missing data falls back to a new game. */
export const loadProgress = (): Progress | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || typeof parsed.currentLevel !== 'number') return null
    const completed = Array.isArray(parsed.completedLevels)
      ? parsed.completedLevels.filter((level): level is number => typeof level === 'number')
      : []
    const bestMoves: Record<number, number> = {}
    if (isRecord(parsed.bestMoves)) {
      for (const [key, value] of Object.entries(parsed.bestMoves)) {
        const level = Number(key)
        if (Number.isInteger(level) && typeof value === 'number') bestMoves[level] = value
      }
    }
    return {
      ...defaultProgress(),
      ...parsed,
      currentLevel: Math.min(LEVEL_CAP, Math.max(1, parsed.currentLevel)),
      completedLevels: completed,
      bestMoves,
      hintsUsed: typeof parsed.hintsUsed === 'number' ? parsed.hintsUsed : 0,
      totalMoves: typeof parsed.totalMoves === 'number' ? parsed.totalMoves : 0,
      streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
      lastPlayed: typeof parsed.lastPlayed === 'string' ? parsed.lastPlayed : '',
      soundEnabled: parsed.soundEnabled !== false,
      hapticsEnabled: parsed.hapticsEnabled !== false,
      tutorialCompleted: parsed.tutorialCompleted === true,
    }
  } catch {
    return null
  }
}

export const saveProgress = (progress: Progress): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Private mode and full storage should not break the puzzle.
  }
}
