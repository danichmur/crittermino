export interface ExampleCell {
  glyph: string
  fill: string
  bad?: boolean
}

export type ArticleBlock =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: readonly string[] }
  | { kind: 'board'; label: string; caption: string; rows: readonly (readonly ExampleCell[])[] }

export interface ArticleFaq {
  question: string
  answer: string
}

export interface ArticleSection {
  heading: string
  blocks: readonly ArticleBlock[]
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  published: string
  updated?: string
  keywords: readonly string[]
  sections: readonly ArticleSection[]
  faqs?: readonly ArticleFaq[]
}

/** Translated fields. Slug and dates stay on the English post. */
export interface BlogCopy {
  title: string
  description: string
  keywords: readonly string[]
  sections: readonly ArticleSection[]
  faqs?: readonly ArticleFaq[]
}

export const paragraph = (text: string): ArticleBlock => ({ kind: 'p', text })

export const list = (items: readonly string[]): ArticleBlock => ({ kind: 'ul', items })

export const board = (
  label: string,
  caption: string,
  rows: readonly (readonly ExampleCell[])[],
): ArticleBlock => ({ kind: 'board', label, caption, rows })
