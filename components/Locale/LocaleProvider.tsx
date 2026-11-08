'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { copy, type Copy } from '@/lib/i18n'
import { persistLocale, readStoredLocale, setActiveLocale, type Locale } from '@/lib/locale'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Copy
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

interface LocaleProviderProps {
  initialLocale: Locale
  children: ReactNode
}

export const LocaleProvider = ({ initialLocale, children }: LocaleProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  setActiveLocale(locale)
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  useEffect(() => {
    const stored = readStoredLocale()
    if (!stored || stored === initialLocale) return
    setLocaleState(stored)
    persistLocale(stored)
  }, [initialLocale])
  const setLocale = (next: Locale): void => {
    setLocaleState(next)
    setActiveLocale(next)
    persistLocale(next)
    document.documentElement.lang = next
    if (window.location.pathname === '/') document.title = copy[next].metaTitle
  }
  return <LocaleContext.Provider value={{ locale, setLocale, t: copy[locale] }}>{children}</LocaleContext.Provider>
}

export const useI18n = (): LocaleContextValue => {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useI18n must be used within LocaleProvider')
  return value
}
