export type AnalyticsEvent =
  | { name: 'level_started'; level: number }
  | { name: 'level_completed'; level: number; moves: number; timeMs: number }
  | { name: 'hint_used'; level: number; hintNumber: number }
  | { name: 'tutorial_completed' }
  | { name: 'share_clicked'; level: number }

/** Placeholder analytics. Pushes to dataLayer and POSTs to /api/analytics when a sink exists. */
export const track = (event: AnalyticsEvent): void => {
  if (typeof window === 'undefined') return
  const payload = { ...event, ts: Date.now() }
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(payload)
  void fetch('/api/analytics', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined)
}
