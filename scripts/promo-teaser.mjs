import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const LEVEL = Number(process.env.LEVEL ?? 53)
const RAW = path.resolve(ROOT, `promo/raw/gameplay-${LEVEL}.webm`)
const OUT = path.resolve(ROOT, 'promo/out')
const AUDIO_DIR = path.resolve(ROOT, 'promo/audio')
const SR = 48000
const CREAM = '0xfff9f0'

const START = 4.2
const SPEED = 2.0
const GPWIN = 8.0
const GPDUR = GPWIN / SPEED
const ENDT = 2.8
const XF = GPDUR - 0.5
const TOTAL = GPDUR + ENDT - 0.5

const { events } = JSON.parse(fs.readFileSync(path.join(ROOT, `promo/raw/gameplay-${LEVEL}.events.json`), 'utf8'))

const TAP = [{ f: 740, d: 0.11, g: 0.42 }]
const COMPLETE = [
  { f: 523.25, d: 0.16, g: 0.5, o: 0 },
  { f: 659.25, d: 0.16, g: 0.5, o: 0.08 },
  { f: 783.99, d: 0.2, g: 0.5, o: 0.16 },
]
const WIN = [
  { f: 523.25, d: 0.16, g: 0.6, o: 0 },
  { f: 659.25, d: 0.16, g: 0.6, o: 0.1 },
  { f: 783.99, d: 0.16, g: 0.6, o: 0.2 },
  { f: 1046.5, d: 0.4, g: 0.66, o: 0.3 },
]

const sfxNotes = []
for (const e of events) {
  if (e.t < START || e.t > START + GPWIN) continue
  const tt = (e.t - START) / SPEED
  const set = e.type === 'complete' ? COMPLETE : TAP
  for (const n of set) sfxNotes.push({ ...n, start: tt + (n.o ?? 0) })
}
// Win sting lands exactly on the endcard reveal.
for (const n of WIN) sfxNotes.push({ ...n, start: GPDUR - 0.15 + (n.o ?? 0) })

const PATTERN = [523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 659.25]
const MSTEP = 0.36
const musicNotes = []
for (let i = 0, t = 0; t < TOTAL; i += 1, t += MSTEP) {
  musicNotes.push({ f: PATTERN[i % PATTERN.length], d: 0.6, g: 0.17, start: t })
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
  const graph = `${filters.join(';')};${labels.join('')}amix=inputs=${labels.length}:duration=longest:normalize=0[mixed];[mixed]${post}[out]`
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...inputs, '-filter_complex', graph, '-map', '[out]', '-t', String(TOTAL), '-ac', '1', outFile], { stdio: 'inherit' })
}

fs.mkdirSync(AUDIO_DIR, { recursive: true })
const sfxFile = path.join(AUDIO_DIR, 'teaser-sfx.wav')
const musicFile = path.join(AUDIO_DIR, 'teaser-music.wav')
const audioFile = path.join(AUDIO_DIR, 'teaser-audio.wav')
buildTrack(sfxNotes, sfxFile, 'aecho=0.7:0.85:35:0.18,alimiter=limit=0.95')
buildTrack(musicNotes, musicFile, 'lowpass=f=3200,aecho=0.8:0.88:90|160:0.3|0.2')
const fadeStart = Math.max(0, TOTAL - 0.8)
execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', musicFile, '-i', sfxFile, '-filter_complex', `[0:a]volume=0.5[m];[1:a]volume=1.2[s];[m][s]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.2,afade=t=out:st=${fadeStart}:d=0.8[out]`, '-map', '[out]', '-t', String(TOTAL), '-ac', '2', '-ar', String(SR), audioFile], { stdio: 'inherit' })
console.log('teaser audio ready, notes', sfxNotes.length)

const ENC = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-shortest']
const gpTrim = `trim=${START}:${START + GPWIN},setpts=(PTS-STARTPTS)/${SPEED}`

const buildVertical = (lang) => {
  const hook = path.resolve(ROOT, `promo/cards/${lang}/hook.png`)
  const end = path.resolve(ROOT, `promo/cards/${lang}/endcard.png`)
  const graph = `\
[0:v]${gpTrim},scale=1080:1920:flags=lanczos,fps=30,setsar=1[gp];\
[2:v]scale=1080:-1:flags=lanczos,fps=30,format=rgba,fade=in:st=0.15:d=0.3:alpha=1,fade=out:st=${GPDUR - 0.5}:d=0.3:alpha=1[hk];\
[gp][hk]overlay=0:150,format=yuv420p,setsar=1[v0];\
[1:v]scale=1080:1920:flags=lanczos,fps=30,setsar=1,format=yuv420p[ec];\
[v0][ec]xfade=transition=fade:duration=0.5:offset=${XF}[vout]`
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', RAW, '-loop', '1', '-t', String(ENDT), '-i', end, '-loop', '1', '-framerate', '30', '-t', String(GPDUR), '-i', hook, '-i', audioFile, '-filter_complex', graph, '-map', '[vout]', '-map', '3:a', ...ENC, path.join(OUT, `crittermino-teaser-${lang}-1080x1920.mp4`)], { stdio: 'inherit' })
  console.log('teaser vertical', lang)
}

const buildSquare = () => {
  const end = path.resolve(ROOT, 'promo/cards/en/endcard.png')
  const graph = `\
[0:v]${gpTrim},scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080,gblur=sigma=28,eq=brightness=0.06,fps=30,setsar=1[bg];\
[0:v]${gpTrim},scale=-1:1040:flags=lanczos,fps=30[fg];\
[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p,setsar=1[v0];\
[1:v]scale=-1:1080:flags=lanczos,pad=1080:1080:(ow-iw)/2:0:color=${CREAM},fps=30,setsar=1,format=yuv420p[ec];\
[v0][ec]xfade=transition=fade:duration=0.5:offset=${XF}[vout]`
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', RAW, '-loop', '1', '-t', String(ENDT), '-i', end, '-i', audioFile, '-filter_complex', graph, '-map', '[vout]', '-map', '2:a', ...ENC, path.join(OUT, 'crittermino-teaser-square-1080x1080.mp4')], { stdio: 'inherit' })
  console.log('teaser square')
}

const LANGS = (process.env.LANGS ?? 'en,ru,es').split(',')
LANGS.forEach(buildVertical)
if (LANGS.includes('en')) buildSquare()
console.log('done. total', TOTAL.toFixed(2), 's')
