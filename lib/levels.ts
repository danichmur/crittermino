import raw from '@/data/levels.json'
import { generateLevel } from '@/lib/generator'
import type { Level } from '@/types/game'

const bank = new Map<number, Level>((raw.levels as Level[]).map((level) => [level.number, level]))

export const BANK_SIZE = bank.size

export const hasLevel = (levelNumber: number): boolean => bank.has(levelNumber)

/** Banked puzzles are instant. Later numbers are built from the same seeded generator. */
export const getLevel = (levelNumber: number): Level => bank.get(levelNumber) ?? generateLevel(levelNumber)
