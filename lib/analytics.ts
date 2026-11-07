export type AnalyticsEvent =
  | { name: 'level_started'; level: number }
  | { name: 'level_completed'; level: number; moves: number; timeMs: number }
  | { name: 'hint_used'; level: number; hintNumber: number }
  | { name: 'tutorial_completed' }
  | { name: 'share_clicked'; level: number }

/** Sends a game event to Google Analytics and to the local analytics route. */
export const track = (event: AnalyticsEvent): void => {
  if (typeof window === 'undefined') return
  const { name, ...params } = event
  window.gtag?.('event', name, params)
  const payload = { ...event, ts: Date.now() }
  void fetch('/api/analytics', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined)
}
