let audio: AudioContext | null = null
let keeper: AudioBufferSourceNode | null = null
let soundEnabled = true
let hapticsEnabled = true

type AudioCtor = typeof AudioContext

const audioCtor = (): AudioCtor | null => {
  if (typeof window === 'undefined') return null
  const legacy = window as Window & { webkitAudioContext?: AudioCtor }
  return window.AudioContext ?? legacy.webkitAudioContext ?? null
}

const context = (): AudioContext | null => {
  const Ctor = audioCtor()
  if (!Ctor) return null
  if (audio?.state === 'closed') {
    audio = null
    keeper = null
  }
  if (!audio) audio = new Ctor()
  return audio
}

/**
 * iOS drops the audio session once every node has stopped, which is the pause
 * on the results screen. A quiet loop started inside the gesture keeps it alive,
 * and a fresh loop is started again if the session was suspended.
 */
const holdOpen = (ctx: AudioContext): void => {
  const buffer = ctx.createBuffer(1, 22050, 22050)
  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  source.buffer = buffer
  source.loop = true
  gain.gain.value = 0.00001
  source.connect(gain)
  gain.connect(ctx.destination)
  try {
    source.start()
  } catch {
    return
  }
  if (keeper) {
    try {
      keeper.stop()
    } catch {
      // The previous loop already ended when the session was interrupted.
    }
    keeper.disconnect()
  }
  keeper = source
}

const unlock = (): void => {
  const ctx = context()
  if (!ctx) return
  if (ctx.state !== 'running' || !keeper) holdOpen(ctx)
  if (ctx.state !== 'running') void ctx.resume()
}

const playTone = (
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
  delay: number,
  slide?: number,
): void => {
  const start = ctx.currentTime + delay
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  if (slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, slide), start + duration)
  gain.gain.setValueAtTime(gainValue, start)
  gain.gain.linearRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
  oscillator.onended = () => {
    oscillator.disconnect()
    gain.disconnect()
  }
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
  // Start the node in the same turn as the tap. Waiting on resume() runs after
  // the gesture, and iOS then plays nothing for the rest of the session.
  if (ctx.state !== 'running') void ctx.resume()
  try {
    playTone(ctx, frequency, duration, type, gainValue, delay, slide)
  } catch {
    // A closed context is replaced on the next tap.
  }
}

export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled
  if (enabled) unlock()
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

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlock, { capture: true })
  window.addEventListener('touchstart', unlock, { capture: true, passive: true })
  window.addEventListener('keydown', unlock, { capture: true })
}
