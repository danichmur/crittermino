import type { BlogCopy } from '@/lib/blog/types'
import { listEs } from '@/lib/blog/translations/es/best-free-logic-puzzles-2026'
import { tipsEs } from '@/lib/blog/translations/es/crittermino-tips-and-strategies'
import { vsEs } from '@/lib/blog/translations/es/fillomino-vs-sudoku'
import { howToEs } from '@/lib/blog/translations/es/how-to-solve-fillomino-puzzles'
import { benefitsEs } from '@/lib/blog/translations/es/logic-puzzle-benefits'

export const ES_POSTS: Record<string, BlogCopy> = {
  'how-to-solve-fillomino-puzzles': howToEs,
  'fillomino-vs-sudoku': vsEs,
  'best-free-logic-puzzles-2026': listEs,
  'crittermino-tips-and-strategies': tipsEs,
  'logic-puzzle-benefits': benefitsEs,
}
