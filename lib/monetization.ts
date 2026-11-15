import { utcDateString } from '@/lib/daily'
import { IS_IOS_APP } from '@/lib/platform'
import type { PlayMode } from '@/types/game'

/** The look and the placed animal are free. The outline, and anything after it, is not. */
export const FREE_HINTS_PER_LEVEL = 2

/** No full-screen ad until the player has reached this campaign level. */
export const INTERSTITIAL_MIN_LEVEL = 11

const DAY_MS = 86_400_000
const STORAGE_KEY = 'crittermino-monetization'

export const PLUS_PRODUCTS = {
  weekly: 'app.crittermino.ios.plus.weekly',
  monthly: 'app.crittermino.ios.plus.monthly',
  yearly: 'app.crittermino.ios.plus.yearly',
} as const

export type PlusPlan = keyof typeof PLUS_PRODUCTS

export interface PlusProduct {
  productId: string
  displayPrice: string
}

export type PurchaseResult = 'active' | 'cancelled' | 'pending' | 'failed'

export interface MonetizationBridge {
  showRewarded: () => Promise<boolean>
  showInterstitial: () => Promise<boolean>
  loadProducts: () => Promise<PlusProduct[]>
  purchase: (productId: string) => Promise<Exclude<PurchaseResult, 'failed'>>
  restore: () => Promise<boolean>
}

interface MonetizationState {
  installedAt: number
  sessions: number
  lastInterstitialAt: number
  lastNudgeDay: string
  plus: boolean
}

export interface InterruptInput {
  plus: boolean
  sessions: number
  installedAt: number
  lastInterstitialAt: number
  level: number
  mode: PlayMode
  now: number
}

const emptyState = (): MonetizationState => ({
  installedAt: 0,
  sessions: 0,
  lastInterstitialAt: 0,
  lastNudgeDay: '',
  plus: false,
})

let state = emptyState()
let loaded = false
let sessionNoted = false
const listeners = new Set<(plus: boolean) => void>()

const readState = (): MonetizationState => {
  if (typeof window === 'undefined') return emptyState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as Partial<MonetizationState>
    return {
      installedAt: typeof parsed.installedAt === 'number' ? parsed.installedAt : 0,
      sessions: typeof parsed.sessions === 'number' ? parsed.sessions : 0,
      lastInterstitialAt: typeof parsed.lastInterstitialAt === 'number' ? parsed.lastInterstitialAt : 0,
      lastNudgeDay: typeof parsed.lastNudgeDay === 'string' ? parsed.lastNudgeDay : '',
      plus: parsed.plus === true,
    }
  } catch {
    return emptyState()
  }
}

const ensure = (): void => {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  state = readState()
}

const persist = (): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const bridge = (): MonetizationBridge | null => {
  if (typeof window === 'undefined') return null
  return window.critterminoMonetization ?? null
}

/** Minimum quiet time between full-screen ads. It shrinks the longer the app has been installed. */
export const tenureGapMs = (installedAt: number, now: number): number => {
  const days = installedAt > 0 ? Math.floor((now - installedAt) / DAY_MS) : 0
  if (days <= 1) return 120_000
  if (days <= 6) return 100_000
  if (days <= 13) return 90_000
  if (days <= 30) return 80_000
  return 60_000
}

/** A full-screen ad is allowed only after the tutorial, a second visit, and the tenure gap. */
export const canInterrupt = (input: InterruptInput): boolean => {
  if (input.plus || input.mode !== 'campaign') return false
  if (input.level < INTERSTITIAL_MIN_LEVEL || input.sessions < 2) return false
  return input.now - input.lastInterstitialAt >= tenureGapMs(input.installedAt, input.now)
}

export const isPlus = (): boolean => {
  ensure()
  return state.plus
}

export const subscribePlus = (listener: (plus: boolean) => void): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const setPlus = (plus: boolean): void => {
  ensure()
  state = { ...state, plus }
  persist()
  listeners.forEach((listener) => listener(plus))
}

/** Count one app launch. Safe to call twice in React strict mode. */
export const noteSession = (): void => {
  if (!IS_IOS_APP || sessionNoted) return
  sessionNoted = true
  ensure()
  state = {
    ...state,
    installedAt: state.installedAt || Date.now(),
    sessions: state.sessions + 1,
  }
  persist()
}

export const needsRewardedHint = (hintsUsed: number): boolean => {
  if (!IS_IOS_APP) return false
  ensure()
  if (state.plus) return false
  return hintsUsed >= FREE_HINTS_PER_LEVEL
}

export const planInterstitial = (input: { level: number; mode: PlayMode; now: number }): { show: boolean; nudge: boolean } => {
  if (!IS_IOS_APP) return { show: false, nudge: false }
  ensure()
  const show = canInterrupt({ ...state, ...input })
  if (!show) return { show: false, nudge: false }
  return { show: true, nudge: state.lastNudgeDay !== utcDateString(new Date(input.now)) }
}

export const markInterstitialShown = (now: number, nudge: boolean): void => {
  ensure()
  state = {
    ...state,
    lastInterstitialAt: now,
    lastNudgeDay: nudge ? utcDateString(new Date(now)) : state.lastNudgeDay,
  }
  persist()
}

export const showRewardedAd = async (): Promise<boolean> => {
  const ads = bridge()
  if (!ads) return false
  try {
    return await ads.showRewarded()
  } catch {
    return false
  }
}

export const showInterstitialAd = async (): Promise<boolean> => {
  const ads = bridge()
  if (!ads) return false
  try {
    return await ads.showInterstitial()
  } catch {
    return false
  }
}

export const loadPlusProducts = async (): Promise<PlusProduct[]> => {
  const ads = bridge()
  if (!ads) return []
  try {
    return await ads.loadProducts()
  } catch {
    return []
  }
}

export const purchasePlus = async (plan: PlusPlan): Promise<PurchaseResult> => {
  const ads = bridge()
  if (!ads) return 'failed'
  try {
    return await ads.purchase(PLUS_PRODUCTS[plan])
  } catch {
    return 'failed'
  }
}

export const restorePlus = async (): Promise<boolean> => {
  const ads = bridge()
  if (!ads) return false
  try {
    return await ads.restore()
  } catch {
    return false
  }
}

declare global {
  interface Window {
    critterminoMonetization?: MonetizationBridge
  }
}
