import { headers } from 'next/headers'
import { isLocale, LOCALE_HEADER, PATH_LOCALE_HEADER, type Locale } from '@/lib/locale'

/** Locale chosen for this request: URL prefix, otherwise saved cookie, otherwise country. */
export const getLocale = async (): Promise<Locale> => {
  const headerStore = await headers()
  const value = headerStore.get(LOCALE_HEADER)
  return isLocale(value) ? value : 'en'
}

/** Locale written into the path. Null on /blog, which stays English for every visitor. */
export const getPathLocale = async (): Promise<Locale | null> => {
  const headerStore = await headers()
  const value = headerStore.get(PATH_LOCALE_HEADER)
  return isLocale(value) ? value : null
}
