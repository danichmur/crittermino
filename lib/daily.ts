import { LEVEL_CAP } from '@/lib/campaign'
import { INTL_LOCALE, type Locale } from '@/lib/locale'

const MS_PER_DAY = 86_400_000
const EPOCH_UTC = Date.UTC(2026, 0, 1)
/** Levels 1–5 are the tutorial, so the shared daily grid starts at 6. */
const DAILY_FIRST_LEVEL = 6
const DAILY_LEVEL_COUNT = LEVEL_CAP - DAILY_FIRST_LEVEL + 1

/** UTC calendar day as YYYY-MM-DD. The daily grid is keyed off this, not the local timezone. */
export const utcDateString = (date: Date = new Date()): string => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Same level number for every player on a given UTC date. */
export const dailyLevelNumber = (date: Date = new Date()): number => {
  const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  const dayIndex = Math.floor((utc - EPOCH_UTC) / MS_PER_DAY)
  const index = ((dayIndex % DAILY_LEVEL_COUNT) + DAILY_LEVEL_COUNT) % DAILY_LEVEL_COUNT
  return DAILY_FIRST_LEVEL + index
}

/** Long UTC date, safe to render on the server and the client. */
export const formatDailyDate = (date: Date = new Date(), locale: Locale = 'en'): string =>
  new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
