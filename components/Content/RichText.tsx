import Link from 'next/link'
import type { ReactNode } from 'react'
import { localizeHref, type Locale } from '@/lib/locale'

const isSafeHref = (href: string): boolean =>
  (href.startsWith('/') && !href.startsWith('//')) || href.startsWith('https://')

/** Point /blog links at the translation the reader is on. Other paths stay put. */
export const prefixRichText = (text: string, locale: Locale): string => {
  if (locale === 'en') return text
  return text.replace(/\[\[(\/blog(?:\/[^\]|]+)*)\|([^\]]+)\]\]/g, (_match, href: string, label: string) => {
    return `[[${localizeHref(locale, href)}|${label}]]`
  })
}

/** Visible label of a rich-text link, for schema and other plain-text surfaces. */
export const stripRichText = (text: string): string => text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')

/** Turns `[[/path|label]]` and `[[https://…|label]]` into links. Other text stays text. */
export const richText = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = []
  let cursor = 0
  for (const match of text.matchAll(/\[\[([^\]|]+)\|([^\]]+)\]\]/g)) {
    const index = match.index ?? 0
    const href = match[1] ?? ''
    const label = match[2] ?? href
    if (index > cursor) nodes.push(text.slice(cursor, index))
    if (!isSafeHref(href)) {
      nodes.push(label)
    } else if (href.startsWith('/')) {
      nodes.push(
        <Link
          key={`${index}-${href}`}
          href={href}
          className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
        >
          {label}
        </Link>,
      )
    } else {
      nodes.push(
        <a
          key={`${index}-${href}`}
          href={href}
          className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
          rel="noreferrer"
        >
          {label}
        </a>,
      )
    }
    cursor = index + match[0].length
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}
