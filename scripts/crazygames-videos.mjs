import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const LEVEL = Number(process.env.LEVEL ?? 53)
const OUT = path.resolve(ROOT, 'promo/crazygames')
const COVER_SECONDS = 1.0
const FADE_SECONDS = 0.4
const LEAD_IN = 0.4
const WIN_HOLD = 1.6
const MAX_SECONDS = 20

const FORMATS = [
  { name: 'landscape', width: 1920, height: 1080, cover: 'cover-landscape-1920x1080.png' },
  { name: 'portrait', width: 1080, height: 1620, cover: 'cover-portrait-800x1200.png' },
]

const readWindow = (dir) => {
  const { events } = JSON.parse(fs.readFileSync(path.join(dir, `gameplay-${LEVEL}.events.json`), 'utf8'))
  const win = events.find((event) => event.type === 'win') ?? events[events.length - 1]
  const start = Math.max(0, events[0].t - LEAD_IN)
  const length = Math.min(win.t + WIN_HOLD - start, MAX_SECONDS - COVER_SECONDS + FADE_SECONDS)
  return { start, length }
}

const buildVideo = (format) => {
  const dir = path.resolve(ROOT, `promo/raw/crazygames-${format.name}`)
  const { start, length } = readWindow(dir)
  const size = `${format.width}:${format.height}`
  const graph = [
    `[0:v]scale=${size}:flags=lanczos,fps=30,setsar=1,format=yuv420p[cover]`,
    `[1:v]trim=${start}:${start + length},setpts=PTS-STARTPTS,scale=${size}:flags=lanczos,fps=30,setsar=1,format=yuv420p[gp]`,
    `[cover][gp]xfade=transition=fade:duration=${FADE_SECONDS}:offset=${COVER_SECONDS - FADE_SECONDS}[vout]`,
  ].join(';')
  const file = path.join(OUT, `preview-${format.name}-${format.width}x${format.height}.mp4`)
  execFileSync(
    'ffmpeg',
    [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-loop', '1', '-framerate', '30', '-t', String(COVER_SECONDS), '-i', path.join(OUT, format.cover),
      '-i', path.join(dir, `gameplay-${LEVEL}.webm`),
      '-filter_complex', graph, '-map', '[vout]', '-an',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
      file,
    ],
    { stdio: 'inherit' },
  )
  console.log('preview ready', file, `${(COVER_SECONDS - FADE_SECONDS + length).toFixed(1)}s`)
}

FORMATS.forEach(buildVideo)
