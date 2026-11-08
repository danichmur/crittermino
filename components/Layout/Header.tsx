'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { fill, pluralWord } from '@/lib/i18n'
import { localizeHref } from '@/lib/locale'

interface HeaderProps {
  mode?: 'site' | 'game'
  level?: number
  label?: string
  moves?: number
  homes?: string
  onMenu?: () => void
  restart?: ReactNode
  hint?: ReactNode
}

export const Header = ({ mode = 'site', level, label, moves, homes, onMenu, restart, hint }: HeaderProps) => {
  const { locale, t } = useI18n()
  if (mode === 'site') {
    return (
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4">
        <Link href={localizeHref(locale, '/')} className="font-display text-xl font-bold text-[#3D2C29] focus-visible:outline-2 focus-visible:outline-[#FF6B9D]">
          Crittermino
        </Link>
        <nav aria-label="Crittermino" className="flex items-center gap-4">
          <Link href={localizeHref(locale, '/how-to-play')} className="text-sm font-medium text-[#8C7468] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#FF6B9D]">
            {t.howToPlay}
          </Link>
          <Link href={localizeHref(locale, '/blog')} className="text-sm font-medium text-[#8C7468] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#FF6B9D]">
            {t.blog}
          </Link>
        </nav>
      </header>
    )
  }
  return (
    <header className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
      <button
        type="button"
        onClick={onMenu}
        aria-label={t.openMenu}
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#3D2C29] shadow-sm ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <div className="text-center">
        <p className="font-display text-lg leading-none font-bold">{label ?? fill(t.levelName, { n: level ?? 1 })}</p>
        <p className="mt-1 text-xs text-[#8C7468] tabular-nums">
          {moves} {pluralWord(locale, moves ?? 0, 'move')}
          {homes ? ` · ${homes}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {restart}
        {hint}
      </div>
    </header>
  )
}
