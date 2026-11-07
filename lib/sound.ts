let audio: AudioContext | null = null
let soundEnabled = true
let hapticsEnabled = true

const context = (): AudioContext | null => {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext
  if (!Ctx) return null
  if (!audio) audio = new Ctx()
  if (audio.state === 'suspended') void audio.resume()
  return audio
}

const tone = (
  frequency: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
  delay = 0,
  slide?: number,
): void => {
  if (!soundEnabled) return
  const ctx = context()
  if (!ctx) return
  const start = ctx.currentTime + delay
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  if (slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, slide), start + duration)
  gain.gain.setValueAtTime(gainValue, start)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled
}

export const setHapticsEnabled = (enabled: boolean): void => {
  hapticsEnabled = enabled
}

export const playTap = (): void => {
  tone(740, 0.045, 'sine', 0.045)
}

export const playError = (): void => {
  tone(196, 0.16, 'triangle', 0.05, 0, 90)
}

export const playComplete = (): void => {
  tone(523, 0.11, 'sine', 0.05)
  tone(659, 0.12, 'sine', 0.05, 0.08)
  tone(784, 0.16, 'sine', 0.05, 0.16)
}

export const playWin = (): void => {
  tone(523, 0.13, 'sine', 0.055)
  tone(659, 0.13, 'sine', 0.055, 0.12)
  tone(784, 0.13, 'sine', 0.055, 0.24)
  tone(1046, 0.28, 'sine', 0.06, 0.36)
}

export const buzz = (pattern: number | number[]): void => {
  if (!hapticsEnabled || typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  navigator.vibrate(pattern)
}
