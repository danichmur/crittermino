export const LOCALES = ['en', 'es', 'ru'] as const

export type Locale = (typeof LOCALES)[number]

export const LOCALE_COOKIE = 'crittermino-locale'

export const LOCALE_HEADER = 'x-locale'

/** Set only when the URL itself starts with /ru or /es. Empty means the address is the English one. */
export const PATH_LOCALE_HEADER = 'x-path-locale'

export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
}

export const LOCALE_FLAG: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  ru: '🇷🇺',
}

export const INTL_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  es: 'es-419',
  ru: 'ru-RU',
}

const SPANISH_COUNTRIES = new Set([
  'ES',
  'MX',
  'AR',
  'CO',
  'CL',
  'PE',
  'VE',
  'EC',
  'GT',
  'CU',
  'BO',
  'DO',
  'HN',
  'PY',
  'SV',
  'NI',
  'CR',
  'PA',
  'UY',
  'PR',
  'GQ',
])

const RUSSIAN_COUNTRIES = new Set(['RU', 'BY', 'KZ', 'KG'])

export const isLocale = (value: string | null | undefined): value is Locale =>
  value === 'en' || value === 'es' || value === 'ru'

/** Map a country code to a language. Anywhere else stays English. */
export const localeFromCountry = (country: string | null | undefined): Locale => {
  const code = country?.toUpperCase() ?? ''
  if (SPANISH_COUNTRIES.has(code)) return 'es'
  if (RUSSIAN_COUNTRIES.has(code)) return 'ru'
  return 'en'
}

/** Used only when the host has no country header, such as local development. */
export const localeFromAcceptLanguage = (header: string | null | undefined): Locale => {
  if (!header) return 'en'
  const tags = header.split(',').map((part) => part.trim().split(';')[0]?.toLowerCase() ?? '')
  for (const tag of tags) {
    if (tag.startsWith('es')) return 'es'
    if (tag.startsWith('ru')) return 'ru'
    if (tag.startsWith('en')) return 'en'
  }
  return 'en'
}

let activeLocale: Locale = 'en'

export const setActiveLocale = (locale: Locale): void => {
  activeLocale = locale
}

export const getActiveLocale = (): Locale => activeLocale

export const persistLocale = (locale: Locale): void => {
  try {
    window.localStorage.setItem(LOCALE_COOKIE, locale)
  } catch {
    // Private mode should still keep the choice for this visit.
  }
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
}

/** English stays unprefixed. /ru and /es are real addresses a crawler can request. */
export const localizeHref = (locale: Locale, path: string): string => {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  const bare = path.replace(/^\/(ru|es)(?=\/|$)/, '') || '/'
  if (locale === 'en') return bare
  return bare === '/' ? `/${locale}` : `/${locale}${bare}`
}

export const readStoredLocale = (): Locale | null => {
  try {
    const value = window.localStorage.getItem(LOCALE_COOKIE)
    return isLocale(value) ? value : null
  } catch {
    return null
  }
}
