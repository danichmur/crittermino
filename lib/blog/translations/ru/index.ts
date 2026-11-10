import type { BlogCopy } from '@/lib/blog/types'
import { listRu } from '@/lib/blog/translations/ru/best-free-logic-puzzles-2026'
import { tipsRu } from '@/lib/blog/translations/ru/crittermino-tips-and-strategies'
import { vsRu } from '@/lib/blog/translations/ru/fillomino-vs-sudoku'
import { howToRu } from '@/lib/blog/translations/ru/how-to-solve-fillomino-puzzles'
import { crosswordRu } from '@/lib/blog/translations/ru/japanese-crossword'
import { kakuroRu } from '@/lib/blog/translations/ru/kakuro-rules'
import { kenkenRu } from '@/lib/blog/translations/ru/kenken-rules'
import { killerRu } from '@/lib/blog/translations/ru/killer-sudoku'
import { benefitsRu } from '@/lib/blog/translations/ru/logic-puzzle-benefits'
import { sudokuRu } from '@/lib/blog/translations/ru/sudoku-rules'

export const RU_POSTS: Record<string, BlogCopy> = {
  'sudoku-rules': sudokuRu,
  'kakuro-rules': kakuroRu,
  'japanese-crossword': crosswordRu,
  'killer-sudoku': killerRu,
  'kenken-rules': kenkenRu,
  'how-to-solve-fillomino-puzzles': howToRu,
  'fillomino-vs-sudoku': vsRu,
  'best-free-logic-puzzles-2026': listRu,
  'crittermino-tips-and-strategies': tipsRu,
  'logic-puzzle-benefits': benefitsRu,
}
