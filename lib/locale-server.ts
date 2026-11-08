import { headers } from 'next/headers'
import { isLocale, LOCALE_HEADER, type Locale } from '@/lib/locale'

/** Locale chosen for this request: saved cookie, otherwise country. */
export const getLocale = async (): Promise<Locale> => {
  const headerStore = await headers()
  const value = headerStore.get(LOCALE_HEADER)
  return isLocale(value) ? value : 'en'
}
