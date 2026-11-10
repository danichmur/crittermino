import { bestFreeLogicPuzzles2026 } from '@/lib/blog/posts/best-free-logic-puzzles-2026'
import { critterminoTips } from '@/lib/blog/posts/crittermino-tips-and-strategies'
import { fillominoVsSudoku } from '@/lib/blog/posts/fillomino-vs-sudoku'
import { howToSolveFillomino } from '@/lib/blog/posts/how-to-solve-fillomino-puzzles'
import { japaneseCrossword } from '@/lib/blog/posts/japanese-crossword'
import { kakuroRules } from '@/lib/blog/posts/kakuro-rules'
import { kenkenRules } from '@/lib/blog/posts/kenken-rules'
import { killerSudoku } from '@/lib/blog/posts/killer-sudoku'
import { logicPuzzleBenefits } from '@/lib/blog/posts/logic-puzzle-benefits'
import { sudokuRules } from '@/lib/blog/posts/sudoku-rules'
import { ES_POSTS } from '@/lib/blog/translations/es'
import { RU_POSTS } from '@/lib/blog/translations/ru'
import type { BlogCopy, BlogPost } from '@/lib/blog/types'
import { INTL_LOCALE, type Locale } from '@/lib/locale'

export type { ArticleBlock, ArticleFaq, ArticleSection, BlogCopy, BlogPost, ExampleCell } from '@/lib/blog/types'

export const BLOG_POSTS: readonly BlogPost[] = [
  sudokuRules,
  kakuroRules,
  japaneseCrossword,
  killerSudoku,
  kenkenRules,
  howToSolveFillomino,
  fillominoVsSudoku,
  bestFreeLogicPuzzles2026,
  critterminoTips,
  logicPuzzleBenefits,
]

const TRANSLATIONS: Record<Exclude<Locale, 'en'>, Record<string, BlogCopy>> = {
  ru: RU_POSTS,
  es: ES_POSTS,
}

export const getPost = (slug: string): BlogPost | undefined => BLOG_POSTS.find((post) => post.slug === slug)

/** English on /blog. Russian and Spanish only when that translation exists. */
export const getLocalizedPost = (slug: string, locale: Locale): BlogPost | undefined => {
  const post = getPost(slug)
  if (!post || locale === 'en') return post
  const copy = TRANSLATIONS[locale][slug]
  if (!copy) return post
  return { ...post, ...copy }
}

export const localizePosts = (locale: Locale): readonly BlogPost[] =>
  BLOG_POSTS.map((post) => getLocalizedPost(post.slug, locale) ?? post)

/** Format YYYY-MM-DD in UTC so the server and the browser print the same day. */
export const formatPublished = (isoDate: string, locale: Locale = 'en'): string => {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}
