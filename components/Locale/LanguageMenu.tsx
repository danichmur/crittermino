'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { LOCALE_FLAG, LOCALE_LABEL, LOCALES, type Locale } from '@/lib/locale'
import { cn } from '@/lib/cn'

interface LanguageChoicesProps {
  onChoose?: () => void
}

export const LanguageChoices = ({ onChoose }: LanguageChoicesProps) => {
  const { locale, setLocale, t } = useI18n()
  const handleChoose = (next: Locale): void => {
    setLocale(next)
    onChoose?.()
  }
  return (
    <div role="radiogroup" aria-label={t.language} className="grid gap-2">
      {LOCALES.map((item) => {
        const selected = item === locale
        return (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => handleChoose(item)}
            className={cn(
              'flex min-h-11 items-center justify-between rounded-2xl px-4 text-left font-display font-semibold text-[#3D2C29]',
              'focus-visible:outline-2 focus-visible:outline-[#FF6B9D]',
              selected ? 'bg-[#FFE5EC] ring-2 ring-[#FF6B9D]' : 'bg-white ring-1 ring-[#E5D5C0]',
            )}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{LOCALE_FLAG[item]}</span>
              {LOCALE_LABEL[item]}
            </span>
            {selected ? <span aria-hidden="true">✓</span> : null}
          </button>
        )
      })}
    </div>
  )
}

export const LanguageMenu = () => {
  const { locale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  useEffect(() => {
    if (!open) return
    const handlePointer = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', handlePointer)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])
  const handleToggle = (): void => setOpen((value) => !value)
  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={`${t.language}, ${LOCALE_LABEL[locale]}`}
        onClick={handleToggle}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 font-display text-sm font-semibold text-[#3D2C29] shadow-sm ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
      >
        <span aria-hidden="true">{LOCALE_FLAG[locale]}</span>
        {LOCALE_LABEL[locale]}
      </button>
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={t.language}
          className="absolute right-0 z-30 mt-2 w-56 rounded-3xl bg-[#FFF9F0] p-3 text-left shadow-lg ring-1 ring-[#E5D5C0]"
        >
          <p className="mb-2 px-1 font-display text-lg font-bold text-[#3D2C29]">{t.language}</p>
          <LanguageChoices onChoose={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  )
}
