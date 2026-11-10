import type { PlayMode } from '@/types/game'

export type AnalyticsEvent =
  | { name: 'level_started'; level: number; mode: PlayMode }
  | { name: 'level_completed'; level: number; mode: PlayMode; moves: number; timeMs: number }
  | { name: 'hint_used'; level: number; mode: PlayMode; hintNumber: number }
  | { name: 'tutorial_completed' }
  | { name: 'share_clicked'; level: number; mode: PlayMode }

/** Sends a game event to Google Analytics. */
export const track = (event: AnalyticsEvent): void => {
  if (typeof window === 'undefined') return
  const { name, ...params } = event
  window.gtag?.('event', name, params)
}
