import type { Animal } from '@/types/game'
import type { Locale } from '@/lib/locale'
import { en } from '@/lib/i18n/en'
import { es } from '@/lib/i18n/es'
import { ru } from '@/lib/i18n/ru'
import { BOARD_LINES, type Copy } from '@/lib/i18n/types'

export type { Copy }

export const copy: Record<Locale, Copy> = { en, es, ru }

export const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (_match, key: string) => String(values[key] ?? ''))

const plural = (locale: Locale, count: number, forms: { one: string; few: string; many: string }): string => {
  if (locale !== 'ru') return count === 1 ? forms.one : forms.many
  const abs = Math.abs(count) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return forms.many
  if (last === 1) return forms.one
  if (last > 1 && last < 5) return forms.few
  return forms.many
}

type WordKind = 'move' | 'day' | 'home' | 'cell'

export const pluralWord = (locale: Locale, count: number, kind: WordKind): string => {
  const text = copy[locale]
  const forms = {
    move: { one: text.moveOne, few: text.moveFew, many: text.moveMany },
    day: { one: text.dayOne, few: text.dayFew, many: text.dayMany },
    home: { one: text.homeOne, few: text.homeFew, many: text.homeMany },
    cell: { one: text.cellOne, few: text.cellFew, many: text.cellMany },
  }[kind]
  return plural(locale, count, forms)
}

export const animalName = (locale: Locale, animal: Animal): string => copy[locale].animals[animal]

export const translateBoardLine = (locale: Locale, text: string): string => {
  const match = BOARD_LINES.find((line) => line === text)
  if (!match) return text
  return copy[locale].boardLines[match]
}

export const formatStreak = (locale: Locale, streak: number, kind: 'today' | 'keep'): string => {
  const text = copy[locale]
  const template = kind === 'today' ? text.streakToday : text.streakKeep
  return fill(template, { n: streak, day: pluralWord(locale, streak, 'day') })
}

export const homeCountLabel = (locale: Locale, done: number, needed: number): string =>
  fill(copy[locale].homeCount, { done, needed, home: pluralWord(locale, needed, 'home') })

export const cellCountLabel = (locale: Locale, size: number): string =>
  fill(copy[locale].cellCount, { n: size, cell: pluralWord(locale, size, 'cell') })

export const moveCountLabel = (locale: Locale, count: number): string =>
  fill(copy[locale].moveCount, { n: count, move: pluralWord(locale, count, 'move') })
