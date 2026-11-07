import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const LEVEL = Number(process.env.LEVEL ?? 53)
const TOTAL = Number(process.env.TOTAL ?? 27)
const SR = 48000
const OUT = path.resolve(ROOT, 'promo/audio')
fs.mkdirSync(OUT, { recursive: true })

const eventsPath = path.resolve(ROOT, `promo/raw/gameplay-${LEVEL}.events.json`)
const { events } = JSON.parse(fs.readFileSync(eventsPath, 'utf8'))

// Replicate the in-game Web Audio tones (lib/sound.ts).
const TAP = [{ f: 740, d: 0.11, g: 0.42 }]
const COMPLETE = [
  { f: 523.25, d: 0.16, g: 0.5, o: 0 },
  { f: 659.25, d: 0.16, g: 0.5, o: 0.08 },
  { f: 783.99, d: 0.2, g: 0.5, o: 0.16 },
]
const WIN = [
  { f: 523.25, d: 0.16, g: 0.55, o: 0 },
  { f: 659.25, d: 0.16, g: 0.55, o: 0.12 },
  { f: 783.99, d: 0.16, g: 0.55, o: 0.24 },
  { f: 1046.5, d: 0.34, g: 0.6, o: 0.36 },
]

const notesForEvent = (type, t) => {
  if (type === 'win') return WIN.map((n) => ({ ...n, start: t + (n.o ?? 0) }))
  if (type === 'complete') return COMPLETE.map((n) => ({ ...n, start: t + (n.o ?? 0) }))
  return TAP.map((n) => ({ ...n, start: t }))
}

const sfxNotes = events.flatMap((e) => notesForEvent(e.type, e.t))

// Cozy music-box arpeggio (C major pentatonic), one pluck per step.
const PATTERN = [523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 659.25]
const STEP = 0.42
const musicNotes = []
for (let i = 0, t = 0; t < TOTAL; i += 1, t += STEP) {
  musicNotes.push({ f: PATTERN[i % PATTERN.length], d: 0.7, g: 0.17, start: t })
}

const buildTrack = (notes, outFile, post) => {
  const inputs = []
  const filters = []
  const labels = []
  notes.forEach((n, i) => {
    inputs.push('-f', 'lavfi', '-i', `sine=frequency=${n.f}:duration=${n.d}:sample_rate=${SR}`)
    const ms = Math.round(n.start * 1000)
    filters.push(`[${i}:a]volume=${n.g},afade=t=out:st=0:d=${n.d}:curve=exp,adelay=${ms}|${ms}[a${i}]`)
    labels.push(`[a${i}]`)
  })
  const silentIndex = notes.length
  inputs.push('-f', 'lavfi', '-i', `anullsrc=r=${SR}:cl=mono`)
  filters.push(`[${silentIndex}:a]atrim=0:${TOTAL}[sil]`)
  labels.push('[sil]')
  const mix = `${labels.join('')}amix=inputs=${labels.length}:duration=longest:normalize=0[mixed]`
  const chain = post ? `[mixed]${post}[out]` : `[mixed]anull[out]`
  const graph = `${filters.join(';')};${mix};${chain}`
  execFileSync(
    'ffmpeg',
    ['-y', '-hide_banner', '-loglevel', 'error', ...inputs, '-filter_complex', graph, '-map', '[out]', '-t', String(TOTAL), '-ac', '1', outFile],
    { stdio: 'inherit' },
  )
  console.log('built', path.basename(outFile), 'notes', notes.length)
}

const sfxFile = path.join(OUT, 'sfx.wav')
const musicFile = path.join(OUT, 'music.wav')
const audioFile = path.join(OUT, 'audio.wav')

buildTrack(sfxNotes, sfxFile, 'aecho=0.7:0.85:35:0.18,alimiter=limit=0.95')
buildTrack(musicNotes, musicFile, 'lowpass=f=3200,aecho=0.8:0.88:90|160:0.3|0.2,volume=0.9')

// Mix music under sfx, master limit, fade the tail.
const fadeStart = Math.max(0, TOTAL - 1.2)
execFileSync(
  'ffmpeg',
  [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-i', musicFile,
    '-i', sfxFile,
    '-filter_complex',
    `[0:a]volume=0.5[m];[1:a]volume=1.15[s];[m][s]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-17:TP=-2:LRA=11,afade=t=in:st=0:d=0.4,afade=t=out:st=${fadeStart}:d=1.2[out]`,
    '-map', '[out]', '-t', String(TOTAL), '-ac', '2', '-ar', String(SR), audioFile,
  ],
  { stdio: 'inherit' },
)
console.log('audio ready:', audioFile)
