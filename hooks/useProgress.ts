'use client'

import { create } from 'zustand'
import { LEVEL_CAP } from '@/lib/campaign'
import { utcDateString } from '@/lib/daily'
import { setHapticsEnabled, setSoundEnabled } from '@/lib/sound'
import { defaultProgress, loadProgress, saveProgress, withStreak } from '@/lib/storage'
import type { Progress } from '@/types/game'

interface ProgressStore {
  progress: Progress
  ready: boolean
  hydrate: () => void
  touchStreak: () => void
  recordMove: () => void
  undoMove: () => void
  recordHint: () => void
  completeLevel: (level: number, moves: number) => void
  completeDaily: () => void
  setSound: (enabled: boolean) => void
  setHaptics: (enabled: boolean) => void
  reset: () => void
}

const persist = (progress: Progress): Progress => {
  saveProgress(progress)
  return progress
}

export const useProgress = create<ProgressStore>((set, get) => ({
  progress: defaultProgress(),
  ready: false,
  hydrate: () => {
    if (get().ready) return
    const loaded = loadProgress() ?? defaultProgress()
    setSoundEnabled(loaded.soundEnabled)
    setHapticsEnabled(loaded.hapticsEnabled)
    set({ progress: loaded, ready: true })
  },
  touchStreak: () => {
    const progress = persist(withStreak(get().progress))
    set({ progress })
  },
  recordMove: () => {
    const progress = persist({ ...get().progress, totalMoves: get().progress.totalMoves + 1 })
    set({ progress })
  },
  undoMove: () => {
    const progress = persist({ ...get().progress, totalMoves: Math.max(0, get().progress.totalMoves - 1) })
    set({ progress })
  },
  recordHint: () => {
    const progress = persist({ ...get().progress, hintsUsed: get().progress.hintsUsed + 1 })
    set({ progress })
  },
  completeLevel: (level, moves) => {
    const current = withStreak(get().progress)
    const completedLevels = current.completedLevels.includes(level)
      ? current.completedLevels
      : [...current.completedLevels, level].sort((left, right) => left - right)
    const previous = current.bestMoves[level]
    const progress = persist({
      ...current,
      completedLevels,
      bestMoves: {
        ...current.bestMoves,
        [level]: previous === undefined ? moves : Math.min(previous, moves),
      },
      currentLevel: Math.min(LEVEL_CAP, Math.max(current.currentLevel, level + 1)),
      tutorialCompleted: current.tutorialCompleted || level >= 5,
    })
    set({ progress })
  },
  completeDaily: () => {
    const progress = persist({ ...withStreak(get().progress), lastDaily: utcDateString() })
    set({ progress })
  },
  setSound: (enabled) => {
    setSoundEnabled(enabled)
    const progress = persist({ ...get().progress, soundEnabled: enabled })
    set({ progress })
  },
  setHaptics: (enabled) => {
    setHapticsEnabled(enabled)
    const progress = persist({ ...get().progress, hapticsEnabled: enabled })
    set({ progress })
  },
  reset: () => {
    const progress = persist(defaultProgress())
    setSoundEnabled(true)
    setHapticsEnabled(true)
    set({ progress })
  },
}))
