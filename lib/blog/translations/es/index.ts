import type { BlogCopy } from '@/lib/blog/types'
import { listEs } from '@/lib/blog/translations/es/best-free-logic-puzzles-2026'
import { tipsEs } from '@/lib/blog/translations/es/crittermino-tips-and-strategies'
import { vsEs } from '@/lib/blog/translations/es/fillomino-vs-sudoku'
import { howToEs } from '@/lib/blog/translations/es/how-to-solve-fillomino-puzzles'
import { crosswordEs } from '@/lib/blog/translations/es/japanese-crossword'
import { kakuroEs } from '@/lib/blog/translations/es/kakuro-rules'
import { kenkenEs } from '@/lib/blog/translations/es/kenken-rules'
import { killerEs } from '@/lib/blog/translations/es/killer-sudoku'
import { benefitsEs } from '@/lib/blog/translations/es/logic-puzzle-benefits'
import { sudokuEs } from '@/lib/blog/translations/es/sudoku-rules'

export const ES_POSTS: Record<string, BlogCopy> = {
  'sudoku-rules': sudokuEs,
  'kakuro-rules': kakuroEs,
  'japanese-crossword': crosswordEs,
  'killer-sudoku': killerEs,
  'kenken-rules': kenkenEs,
  'how-to-solve-fillomino-puzzles': howToEs,
  'fillomino-vs-sudoku': vsEs,
  'best-free-logic-puzzles-2026': listEs,
  'crittermino-tips-and-strategies': tipsEs,
  'logic-puzzle-benefits': benefitsEs,
}
