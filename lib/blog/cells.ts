import type { ExampleCell } from '@/lib/blog/types'

type CellState = 'given' | 'found' | 'bad'

interface AnimalPaint {
  glyph: string
  fill: string
  found: string
}

const mousePaint: AnimalPaint = { glyph: '🐭', fill: '#E8ECF1', found: '#D2D8E2' }
const catPaint: AnimalPaint = { glyph: '🐱', fill: '#FFF4CC', found: '#FFE58A' }
const dogPaint: AnimalPaint = { glyph: '🐶', fill: '#E5F4FF', found: '#C4E4FF' }
const pandaPaint: AnimalPaint = { glyph: '🐼', fill: '#E8F5E8', found: '#C8EBC8' }
const lionPaint: AnimalPaint = { glyph: '🦁', fill: '#FFE5D9', found: '#FFCDB3' }

const paint = (animal: AnimalPaint, state: CellState = 'given'): ExampleCell => ({
  glyph: animal.glyph,
  fill: state === 'found' ? animal.found : animal.fill,
  ...(state === 'bad' ? { bad: true } : {}),
})

export const blank = (): ExampleCell => ({ glyph: '', fill: '#FFFFFF' })

export const mouse = (state?: CellState): ExampleCell => paint(mousePaint, state)

export const cat = (state?: CellState): ExampleCell => paint(catPaint, state)

export const dog = (state?: CellState): ExampleCell => paint(dogPaint, state)

export const panda = (state?: CellState): ExampleCell => paint(pandaPaint, state)

export const lion = (state?: CellState): ExampleCell => paint(lionPaint, state)
