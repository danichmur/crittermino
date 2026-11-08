import type { BlogCopy } from '@/lib/blog/types'
import { listRu } from '@/lib/blog/translations/ru/best-free-logic-puzzles-2026'
import { tipsRu } from '@/lib/blog/translations/ru/crittermino-tips-and-strategies'
import { vsRu } from '@/lib/blog/translations/ru/fillomino-vs-sudoku'
import { howToRu } from '@/lib/blog/translations/ru/how-to-solve-fillomino-puzzles'
import { benefitsRu } from '@/lib/blog/translations/ru/logic-puzzle-benefits'

export const RU_POSTS: Record<string, BlogCopy> = {
  'how-to-solve-fillomino-puzzles': howToRu,
  'fillomino-vs-sudoku': vsRu,
  'best-free-logic-puzzles-2026': listRu,
  'crittermino-tips-and-strategies': tipsRu,
  'logic-puzzle-benefits': benefitsRu,
}
