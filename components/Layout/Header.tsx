'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

interface HeaderProps {
  mode?: 'site' | 'game'
  level?: number
  moves?: number
  homes?: string
  onMenu?: () => void
  hint?: ReactNode
}

export const Header = ({ mode = 'site', level, moves, homes, onMenu, hint }: HeaderProps) => {
  if (mode === 'site') {
    return (
      <header className="flex items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-xl font-bold text-[#3D2C29]">
          Crittermino
        </Link>
        <Link href="/how-to-play" className="text-sm font-medium text-[#8C7468] underline-offset-4 hover:underline">
          How to play
        </Link>
      </header>
    )
  }
  return (
    <header className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#3D2C29] shadow-sm ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <div className="text-center">
        <p className="font-display text-lg leading-none font-bold">Level {level}</p>
        <p className="mt-1 text-xs text-[#8C7468] tabular-nums">
          {moves} {moves === 1 ? 'move' : 'moves'}
          {homes ? ` · ${homes}` : ''}
        </p>
      </div>
      {hint}
    </header>
  )
}
