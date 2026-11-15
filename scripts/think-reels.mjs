// Think-pause reels: the one-hole board holds for 3 seconds, then the same wrong taps.
// node scripts/think-reels.mjs

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const RAW_ROOT = path.join(ROOT, 'promo/raw/fails')
const CARD_ROOT = path.join(ROOT, 'promo/think/cards')
const OUT_ROOT = path.join(ROOT, 'promo/out/think')
const SHARED_CARDS = path.join(ROOT, 'promo/fails/cards')
const AUDIO_DIR = path.join(ROOT, 'promo/audio')
const OUT_W = 1080
const OUT_H = 1920
const FPS = 30
const HOLD = 3
const SR = 48000
const QUESTION = 'Which animal fits this hole?'

const CLIPS = [
  {
    id: '01',
    source: '01',
    slug: 'which-animal',
    level: 6,
    answer: 'mouse',
    wrongs: 'dog, then cat',
    hole: { x: 376.5, y: 453 },
    caption: 'One cell left, and it is a mouse. The board holds. He still tries the dog, then the cat.',
  },
  {
    id: '02',
    source: '03',
    slug: 'which-animal',
    level: 10,
    answer: 'cat',
    wrongs: 'mouse, then dog',
    hole: { x: 56, y: 240.5 },
    caption: 'The corner wants a cat. The board holds. He tries the mouse, then the dog.',
  },
  {
    id: '03',
    source: '06',
    slug: 'which-animal',
    level: 20,
    answer: 'mouse',
    wrongs: 'dog, then cat',
    hole: { x: 483, y: 665.5 },
    caption: 'Last cell of the level. The board holds. Dog, then cat, then the mouse.',
  },
]

const FONT = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap" rel="stylesheet">
`

const questionHtml = () => `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONT}
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { background: transparent; }
  body { width: 1080px; height: 160px; display: flex; justify-content: center; align-items: center; font-family: Fredoka, "Avenir Next", sans-serif; }
  .pill { background: #fff; border: 4px solid #ffd0dc; border-radius: 999px; padding: 16px 36px 18px; text-align: center; box-shadow: 0 14px 36px rgba(61,44,41,0.2); }
  .line { font-size: 42px; font-weight: 700; color: #3D2C29; line-height: 1; white-space: nowrap; }
  .line span { color: #E11D48; }
</style></head>
<body><div class="pill"><div class="line">${QUESTION.replace('this hole?', '<span>this hole?</span>')}</div></div></body></html>`

const ringHtml = () => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { background: transparent; }
  body { width: 240px; height: 240px; display: flex; justify-content: center; align-items: center; }
  .ring { width: 176px; height: 176px; border: 8px solid #E11D48; border-radius: 40px; box-shadow: 0 0 0 5px rgba(255,255,255,0.95), 0 10px 24px rgba(225,29,72,0.3); }
</style></head>
<body><div class="ring"></div></body></html>`

const pngSize = (file) => {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' })
  return {
    w: Number(out.match(/pixelWidth: (\d+)/)[1]),
    h: Number(out.match(/pixelHeight: (\d+)/)[1]),
  }
}

const probeDuration = (file) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }).trim())

const renderCards = async () => {
  fs.mkdirSync(CARD_ROOT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 160 }, deviceScaleFactor: 1 })
  await page.setContent(questionHtml(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
  await page.locator('.pill').screenshot({ path: path.join(CARD_ROOT, 'question.png'), omitBackground: true })
  await page.setViewportSize({ width: 240, height: 240 })
  await page.setContent(ringHtml(), { waitUntil: 'load' })
  await page.waitForTimeout(100)
  await page.locator('.ring').screenshot({ path: path.join(CARD_ROOT, 'hole.png'), omitBackground: true })
  await browser.close()
}

const buildSfx = (events, start, duration, file) => {
  const sets = {
    erase: [{ f: 520, d: 0.05, g: 0.35 }],
    fail: [{ f: 196, d: 0.2, g: 0.7 }, { f: 146, d: 0.16, g: 0.55, o: 0.08 }],
    win: [
      { f: 523.25, d: 0.13, g: 0.58, o: 0 },
      { f: 659.25, d: 0.13, g: 0.58, o: 0.12 },
      { f: 783.99, d: 0.13, g: 0.58, o: 0.24 },
      { f: 1046.5, d: 0.28, g: 0.62, o: 0.36 },
    ],
  }
  const notes = []
  for (const event of events) {
    const at = event.t - start
    if (at < -0.05 || at > duration) continue
    for (const note of sets[event.type] ?? []) notes.push({ ...note, start: Math.max(0, at + (note.o ?? 0)) })
  }
  if (notes.length === 0) notes.push({ f: 440, d: 0.05, g: 0.01, start: 0 })
  const inputs = []
  const filters = []
  const labels = []
  notes.forEach((note, index) => {
    inputs.push('-f', 'lavfi', '-i', `sine=frequency=${note.f}:duration=${note.d}:sample_rate=${SR}`)
    const delay = Math.max(0, Math.round(note.start * 1000))
    filters.push(`[${index}:a]volume=${note.g},afade=t=out:st=0:d=${note.d}:curve=exp,adelay=${delay}|${delay}[a${index}]`)
    labels.push(`[a${index}]`)
  })
  inputs.push('-f', 'lavfi', '-i', `anullsrc=r=${SR}:cl=mono`)
  filters.push(`[${notes.length}:a]atrim=0:${duration.toFixed(3)}[sil]`)
  labels.push('[sil]')
  const graph = `${filters.join(';')};${labels.join('')}amix=inputs=${labels.length}:duration=longest:normalize=0[out]`
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...inputs, '-filter_complex', graph, '-map', '[out]', '-t', duration.toFixed(3), '-ac', '1', file], { stdio: 'inherit' })
}

const composeClip = (clip, bed, questionSize, ringSize) => {
  const dir = path.join(RAW_ROOT, clip.source)
  const raw = path.join(dir, 'gameplay.webm')
  const { events } = JSON.parse(fs.readFileSync(path.join(dir, 'events.json'), 'utf8'))
  const lastPlace = Math.max(...events.filter((event) => event.type === 'place').map((event) => event.t))
  const win = events.find((event) => event.type === 'win')
  const fails = events.filter((event) => event.type === 'fail')
  if (!win || fails.length === 0) throw new Error(`${clip.id} is missing the fail`)
  const videoDuration = probeDuration(raw)
  const freezeAt = lastPlace + 0.32
  const resumeAt = lastPlace + 0.4
  const end = Math.min(videoDuration - 0.04, win.t + 2.05)
  const answerDur = end - resumeAt
  const total = HOLD + answerDur
  const work = path.join(OUT_ROOT, `.work-${clip.id}`)
  fs.mkdirSync(work, { recursive: true })
  const frame = path.join(work, 'freeze.png')
  const sfxFile = path.join(work, 'sfx.wav')
  const mixFile = path.join(work, 'mix.wav')
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', freezeAt.toFixed(3), '-i', raw, '-frames:v', '1', frame], { stdio: 'inherit' })
  buildSfx(events, resumeAt, answerDur, sfxFile)
  const fadeOut = Math.max(0, total - 0.4)
  const musicStart = (Number(clip.id) - 1) * 2.4
  execFileSync('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-ss', musicStart.toFixed(2), '-i', bed,
    '-i', sfxFile,
    '-filter_complex', `[0:a]atrim=0:${total.toFixed(3)},volume=0.42,afade=t=in:st=0:d=0.15,afade=t=out:st=${fadeOut.toFixed(3)}:d=0.35[m];[1:a]volume=1.2,adelay=${Math.round(HOLD * 1000)}|${Math.round(HOLD * 1000)}[s];[m][s]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.95[out]`,
    '-map', '[out]', '-t', total.toFixed(3), '-ac', '2', '-ar', String(SR), mixFile,
  ], { stdio: 'inherit' })
  const nopeEnable = fails.map((event) => {
    const at = HOLD + (event.t - resumeAt)
    return `between(t,${at.toFixed(2)},${(at + 0.85).toFixed(2)})`
  }).join('+')
  const questionY = Math.round(200 + Math.max(0, 172 - questionSize.h) / 2)
  const nopeY = Math.round(200 + Math.max(0, 172 - 90) / 2)
  const ringX = Math.round(clip.hole.x * 2 - ringSize.w / 2)
  const ringY = Math.round(clip.hole.y * 2 - ringSize.h / 2)
  const outfile = path.join(OUT_ROOT, `${clip.id}-${clip.slug}.mp4`)
  const cover = path.join(OUT_ROOT, `${clip.id}-${clip.slug}.jpg`)
  const graph = [
    `[0:v]scale=${OUT_W}:${OUT_H}:flags=lanczos,setsar=1,fps=${FPS},trim=0:${HOLD.toFixed(3)},setpts=PTS-STARTPTS[hold]`,
    `[1:v]trim=${resumeAt.toFixed(3)}:${end.toFixed(3)},setpts=PTS-STARTPTS,fps=${FPS},scale=${OUT_W}:${OUT_H}:flags=lanczos,setsar=1[play]`,
    `[hold][play]concat=n=2:v=1:a=0,fade=t=in:st=0:d=0.12,format=yuv420p[gp]`,
    `[2:v]format=rgba[chip]`,
    `[3:v]format=rgba,fade=t=in:st=0.1:d=0.14:alpha=1,fade=t=out:st=${HOLD.toFixed(3)}:d=0.2:alpha=1[ask]`,
    `[4:v]format=rgba,fade=t=in:st=0.1:d=0.16:alpha=1,fade=t=out:st=${HOLD.toFixed(3)}:d=0.18:alpha=1[ring]`,
    `[5:v]format=rgba[nope]`,
    `[gp][chip]overlay=x=(W-w)/2:y=118:format=auto:eof_action=pass[v1]`,
    `[v1][ask]overlay=x=(W-w)/2:y=${questionY}:format=auto:eof_action=pass[v2]`,
    `[v2][ring]overlay=x=${ringX}:y=${ringY}:format=auto:eof_action=pass[v3]`,
    `[v3][nope]overlay=x=(W-w)/2:y=${nopeY}:enable='${nopeEnable}':format=auto:eof_action=pass,format=yuv420p[vout]`,
  ].join(';')
  execFileSync('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-loop', '1', '-framerate', String(FPS), '-t', HOLD.toFixed(3), '-i', frame,
    '-i', raw,
    '-loop', '1', '-framerate', String(FPS), '-t', total.toFixed(3), '-i', path.join(SHARED_CARDS, 'url-chip.png'),
    '-loop', '1', '-framerate', String(FPS), '-t', (HOLD + 0.24).toFixed(3), '-i', path.join(CARD_ROOT, 'question.png'),
    '-loop', '1', '-framerate', String(FPS), '-t', (HOLD + 0.24).toFixed(3), '-i', path.join(CARD_ROOT, 'hole.png'),
    '-loop', '1', '-framerate', String(FPS), '-t', total.toFixed(3), '-i', path.join(SHARED_CARDS, 'nope.png'),
    '-i', mixFile,
    '-filter_complex', graph,
    '-map', '[vout]', '-map', '6:a',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart',
    '-c:a', 'aac', '-b:a', '160k', '-ac', '2',
    '-t', total.toFixed(3),
    outfile,
  ], { stdio: 'inherit' })
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', '1.15', '-i', outfile, '-frames:v', '1', '-q:v', '3', cover], { stdio: 'inherit' })
  const duration = probeDuration(outfile)
  console.log('built', path.basename(outfile), `${duration.toFixed(1)}s`, 'level', clip.level)
  return duration
}

const writeSheet = () => {
  const lines = [
    '3 рилса-паузы. Доска с одной пустой клеткой стоит 3 секунды, потом тот же фейл.',
    '1080×1920. Текст на видео английский. Ссылка на экране.',
    `На паузе: ${QUESTION}`,
    'Постить отдельно от обычных геймплейных. Ссылка в био: https://crittermino.vercel.app',
    'В описании TikTok ссылку лучше не ставить. Если накладываешь трендовый звук, выключи оригинальную дорожку.',
    '',
  ]
  for (const clip of CLIPS) {
    const file = `${clip.id}-${clip.slug}.mp4`
    const full = path.join(OUT_ROOT, file)
    const length = fs.existsSync(full) ? `${probeDuration(full).toFixed(1)} с` : 'ещё не собран'
    lines.push(`${clip.id}. ${file} · уровень ${clip.level} · ответ ${clip.answer} · ${length}`)
    lines.push(`На экране: ${QUESTION}`)
    lines.push(`Потом: ${clip.wrongs}. Верный — ${clip.answer}.`)
    lines.push(clip.caption)
    lines.push('Which animal fits this hole? Play free. Link in bio.')
    lines.push('#crittermino #logicpuzzle #oddlysatisfying #brainteaser')
    lines.push('')
  }
  fs.writeFileSync(path.join(OUT_ROOT, 'captions.txt'), `${lines.join('\n')}\n`)
}

const run = async () => {
  fs.mkdirSync(OUT_ROOT, { recursive: true })
  const bed = path.join(AUDIO_DIR, 'social-music.wav')
  if (!fs.existsSync(bed)) throw new Error('Missing promo/audio/social-music.wav')
  await renderCards()
  const questionSize = pngSize(path.join(CARD_ROOT, 'question.png'))
  const ringSize = pngSize(path.join(CARD_ROOT, 'hole.png'))
  console.log('question', questionSize, 'ring', ringSize)
  if (questionSize.w > 980) throw new Error('Question card is too wide for the frame')
  for (const clip of CLIPS) composeClip(clip, bed, questionSize, ringSize)
  for (const clip of CLIPS) fs.rmSync(path.join(OUT_ROOT, `.work-${clip.id}`), { recursive: true, force: true })
  writeSheet()
  console.log('done', CLIPS.length)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
