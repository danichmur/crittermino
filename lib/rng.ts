export interface Rng {
  next: () => number
  int: (max: number) => number
  shuffle: <T>(items: readonly T[]) => T[]
}

/** Mulberry32. Same seed always yields the same stream. */
export const createRng = (seed: number): Rng => {
  let state = seed >>> 0 || 1
  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    int: (max: number): number => {
      if (max <= 0) return 0
      return Math.floor(next() * max)
    },
    shuffle: <T>(items: readonly T[]): T[] => {
      const copy = items.slice()
      for (let index = copy.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(next() * (index + 1))
        const current = copy[index] as T
        copy[index] = copy[swap] as T
        copy[swap] = current
      }
      return copy
    },
  }
}

export const seedForLevel = (levelNumber: number): number => (Math.imul(levelNumber, 0x9e3779b1) ^ 0xa5a5a5a5) >>> 0
