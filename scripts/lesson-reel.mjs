// 15s lesson ad: hook, three rules, one forced mouse, one red tap, unfinished board.
// node scripts/lesson-reel.mjs

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PROMO = path.resolve(ROOT, '../crittermino-growth/promo')
const RAW = path.join(PROMO, 'raw/lesson')
const CARDS = path.join(PROMO, 'lesson/cards')
const OUT = path.join(PROMO, 'out/lesson')
const AUDIO = path.join(PROMO, 'audio/cc0')
const PEOPLE = path.join(RAW, 'people')
const HAND = path.join(RAW, 'hand.jpg')
const LOGO = path.join(ROOT, 'components/Brand/mascot.png')
const FONT = fs.readFileSync(
  path.join(ROOT, 'node_modules/@fontsource-variable/fredoka/files/fredoka-latin-wght-normal.woff2'),
).toString('base64')
const BASE = process.env.BASE ?? 'http://localhost:3000'
const VW = 1080
const VH = 1920
const FPS = 30
const SR = 48000
const TOTAL = 15
const NAME_BY_SIZE = { 2: 'Mouse', 3: 'Cat', 4: 'Dog' }
const HAND_PX = 1280
const TIP = { x: (224 / 1024) * HAND_PX, y: (232 / 1024) * HAND_PX }

const FORMATS = {
  lesson: {
    hook: [0, 2.75],
    mouse: [2.75, 4],
    cat: [4, 5.15],
    apart: [5.15, 6.4],
    place: [6.4, 8.7],
    fail: [8.7, 11],
    ask: [11, 15],
    order: ['open', 'intro', 'place', 'fail', 'ask'],
  },
  snap: {
    hook: [0, 2.3],
    fail: [2.3, 4.1],
    mouse: [4.1, 5.35],
    cat: [5.35, 6.5],
    apart: [6.5, 7.6],
    place: [7.6, 9.7],
    ask: [9.7, 15],
    order: ['open', 'fail', 'intro', 'place', 'ask'],
  },
  rush: {
    hook: [0, 2.2],
    place: [2.2, 4.3],
    fail: [4.3, 6.1],
    ask: [6.1, 15],
    order: ['open', 'place', 'fail', 'ask'],
  },
}

const CLIPS = [
  { id: '02', slug: 'iq-over-150', format: 'lesson', level: 4, personAt: 0.55, hookY: 1480, track: 'Backbeat.mp3', trackAt: 0.3, gain: 11, credit: 'Backbeat by Kevin MacLeod — CC0', forced: { row: 1, col: 0, size: 2 }, hole: { row: 0, col: 1, size: 4, wrong: 3 }, hook: 'IQ over <span>150?</span>', hookSize: 76 },
  { id: '03', slug: 'simple-rules', format: 'lesson', level: 6, personAt: 0.4, hookY: 1420, track: 'Kick Shock.mp3', trackAt: 0.2, gain: 0, credit: 'Kick Shock by Kevin MacLeod (incompetech.com) — CC BY 4.0', forced: { row: 2, col: 3, size: 2 }, hole: { row: 0, col: 2, size: 3, wrong: 4 }, hook: 'Simple <span>rules.</span>', hookSize: 78 },
  { id: '04', slug: 'dont-guess', format: 'snap', level: 9, personAt: 0.35, hookY: 1460, track: 'The Whip.mp3', trackAt: 0.15, gain: 0, credit: 'The Whip by Kevin MacLeod (incompetech.com) — CC BY 4.0', forced: { row: 0, col: 2, size: 2 }, hole: { row: 0, col: 0, size: 3, wrong: 4 }, hook: "Don't <span>guess.</span>", hookSize: 84 },
  { id: '05', slug: 'one-cell', format: 'lesson', level: 11, personAt: 0.7, hookY: 860, track: 'Cool Blast.mp3', trackAt: 2, gain: 4, credit: 'Cool Blast by Kevin MacLeod (incompetech.com) — CC BY 4.0', forced: { row: 1, col: 1, size: 2 }, hole: { row: 0, col: 0, size: 4, wrong: 3 }, hook: 'One cell <span>left.</span>', hookSize: 74 },
  { id: '06', slug: 'can-you', format: 'rush', level: 14, personAt: 0.45, hookY: 1520, track: 'Laser Groove.mp3', trackAt: 18, gain: 1, credit: 'Laser Groove by Kevin MacLeod (incompetech.com) — CC BY 4.0', forced: { row: 0, col: 0, size: 2 }, hole: { row: 0, col: 1, size: 4, wrong: 3 }, hook: 'Can <span>you?</span>', hookSize: 92 },
]

const fontFace = `@font-face{font-family:Fredoka;src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:400 700;font-display:block;}`

const escapeHtml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const caption = (inner, size) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<style>
  ${fontFace}
  * { margin: 0; box-sizing: border-box; }
  html, body { background: transparent; }
  body { width: 1040px; height: 280px; display: flex; justify-content: center; align-items: center; font-family: Fredoka, "Avenir Next", sans-serif; }
  .stack { text-align: center; }
  .line { font-size: ${size}px; font-weight: 700; color: #3D2C29; line-height: 0.95; letter-spacing: -0.03em; -webkit-text-stroke: 10px #fff; paint-order: stroke fill; }
  .line span { color: #E11D48; }
</style></head><body><div class="stack">${inner}</div></body></html>`

const ringHtml = () => `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
  * { margin: 0; box-sizing: border-box; }
  html, body { background: transparent; }
  body { width: 360px; height: 360px; display: flex; justify-content: center; align-items: center; }
  .ring { width: 300px; height: 300px; border: 10px solid #E11D48; border-radius: 48px; box-shadow: 0 0 0 6px rgba(255,255,255,0.95), 0 10px 24px rgba(225,29,72,0.28); }
</style></head><body><div class="ring"></div></body></html>`

const SHARED_CARDS = [
  ['mouse', caption('<div class="line">Mouse <span>= 2</span></div>', 72)],
  ['cat', caption('<div class="line">Cat <span>= 3</span></div>', 72)],
  ['apart', caption('<div class="line">Same sizes stay apart.</div>', 58)],
  ['place', caption('<div class="line">Mouse. <span>Two cells.</span></div>', 64)],
  ['nope', caption('<div class="line"><span>nope.</span></div>', 78)],
  ['question', caption('<div class="line">Which <span>animal?</span></div>', 78)],
]

const run = (cmd, args) => {
  execFileSync(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] })
}

const probeDuration = (file) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }).trim())

const pngSize = (file) => {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' })
  return {
    w: Number(out.match(/pixelWidth: (\d+)/)[1]),
    h: Number(out.match(/pixelHeight: (\d+)/)[1]),
  }
}

const hideDevChrome = () => {
  const root = document.documentElement
  if (!root) return
  const style = document.createElement('style')
  style.textContent = 'nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay],[data-next-badge-root]{display:none!important}header{display:none!important}p[role="status"]{display:none!important}'
  root.append(style)
  const sweep = () => document.querySelectorAll('nextjs-portal').forEach((node) => node.remove())
  sweep()
  new MutationObserver(sweep).observe(root, { childList: true, subtree: true })
}

const loadLevel = (number) => {
  const { levels } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/levels.json'), 'utf8'))
  const level = levels.find((item) => item.number === number)
  if (!level) throw new Error(`Level ${number} not found`)
  return level
}

const setupCells = (level, clip) => {
  const skip = new Set([`${clip.forced.row}:${clip.forced.col}`, `${clip.hole.row}:${clip.hole.col}`])
  const cells = []
  for (let row = 0; row < level.size; row += 1) {
    for (let col = 0; col < level.size; col += 1) {
      if (level.givens[row][col] || skip.has(`${row}:${col}`)) continue
      cells.push({ row, col, value: level.solution[row][col] })
    }
  }
  return cells.sort((left, right) => left.value - right.value || left.row - right.row || left.col - right.col)
}

const renderCards = async (clips) => {
  fs.mkdirSync(CARDS, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 320 }, deviceScaleFactor: 1 })
  const shoot = async (html, file) => {
    await page.setViewportSize({ width: 1080, height: 320 })
    await page.setContent(html, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(60)
    await page.locator('.stack').screenshot({ path: file, omitBackground: true })
  }
  for (const [name, html] of SHARED_CARDS) await shoot(html, path.join(CARDS, `${name}.png`))
  for (const clip of clips) {
    await shoot(caption(`<div class="line" style="font-size:${clip.hookSize}px">${clip.hook}</div>`, clip.hookSize), path.join(CARDS, `${clip.id}-hook.png`))
  }
  await page.setViewportSize({ width: 360, height: 360 })
  await page.setContent(ringHtml(), { waitUntil: 'load' })
  await page.waitForTimeout(40)
  await page.locator('.ring').screenshot({ path: path.join(CARDS, 'ring.png'), omitBackground: true })
  await browser.close()
  for (const clip of clips) {
    const size = pngSize(path.join(CARDS, `${clip.id}-hook.png`))
    if (size.w > 1000) throw new Error(`${clip.id} hook is ${size.w}px wide`)
  }
}

const boxOf = async (locator) => {
  const box = await locator.boundingBox()
  if (!box) throw new Error('Missing cell box')
  return { x: box.x, y: box.y, w: box.width, h: box.height }
}

const movePointer = async (page, locator) => {
  const box = await locator.boundingBox()
  if (!box) return
  await page.evaluate(({ x, y }) => {
    const pointer = document.getElementById('tap-pointer')
    if (pointer) pointer.style.transform = `translate(${x}px, ${y}px)`
  }, { x: box.x + box.width / 2, y: box.y + box.height / 2 })
  await page.waitForTimeout(70)
}

const hidePointer = async (page) => {
  await page.evaluate(() => {
    const pointer = document.getElementById('tap-pointer')
    if (pointer) pointer.style.transform = 'translate(-120px, -120px)'
  })
}

const clearAnimal = async (page) => {
  const pressed = page.locator('button[aria-pressed="true"]')
  if ((await pressed.count()) === 0) return
  await movePointer(page, pressed.first())
  await pressed.first().click({ timeout: 8000 })
  await page.waitForTimeout(80)
}

const selectAnimal = async (page, size) => {
  const name = NAME_BY_SIZE[size]
  const button = page.getByRole('button', { name: new RegExp(`^${name}, homes of ${size}`) })
  if ((await button.getAttribute('aria-pressed')) === 'true') return
  await movePointer(page, button)
  await button.click({ timeout: 8000 })
  await page.waitForTimeout(90)
}

const clipDir = (clip) => path.join(RAW, clip.id)

const capture = async (browser, clip) => {
  const level = loadLevel(clip.level)
  const forced = clip.forced
  const hole = clip.hole
  if (level.solution[forced.row][forced.col] !== forced.size) throw new Error(`${clip.id} forced cell is not a ${forced.size}`)
  if (level.solution[hole.row][hole.col] !== hole.size) throw new Error(`${clip.id} hole is not a ${hole.size}`)
  const setup = setupCells(level, clip)
  const dir = clipDir(clip)
  fs.mkdirSync(dir, { recursive: true })
  const context = await browser.newContext({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: 1,
    locale: 'en-US',
    reducedMotion: 'no-preference',
    recordVideo: { dir, size: { width: VW, height: VH } },
  })
  await context.addInitScript(hideDevChrome)
  await context.addInitScript((levelNumber) => {
    const completed = []
    for (let n = 1; n < levelNumber; n += 1) completed.push(n)
    window.localStorage.setItem('crittermino-locale', 'en')
    document.cookie = 'crittermino-locale=en; Path=/; Max-Age=31536000; SameSite=Lax'
    window.localStorage.setItem('crittermino-progress-v1', JSON.stringify({
      currentLevel: levelNumber,
      completedLevels: completed,
      bestMoves: { [levelNumber]: 999 },
      hintsUsed: 0,
      totalMoves: 0,
      streak: 0,
      lastPlayed: '',
      lastDaily: '',
      soundEnabled: false,
      hapticsEnabled: false,
      tutorialCompleted: true,
    }))
  }, clip.level)
  const page = await context.newPage()
  const t0 = Date.now()
  const events = []
  const stamp = (type) => {
    const event = { t: (Date.now() - t0) / 1000, type }
    events.push(event)
    return event
  }
  const cell = (row, col) => page.locator(`[data-row="${row}"][data-col="${col}"]`)
  let boxes = null
  try {
    await page.goto(`${BASE}/?play=next`, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForSelector('[data-row="0"][data-col="0"]', { timeout: 20000 })
    await page.evaluate(hideDevChrome)
    await page.waitForTimeout(400)
    let current = null
    for (const spot of setup) {
      if (spot.value !== current) {
        await selectAnimal(page, spot.value)
        current = spot.value
      }
      const target = cell(spot.row, spot.col)
      await movePointer(page, target)
      await target.click({ timeout: 8000 })
      stamp('setup')
      await page.waitForTimeout(70)
    }
    await page.waitForTimeout(700)
    await clearAnimal(page)
    await hidePointer(page)
    await page.waitForTimeout(200)
    stamp('ready')
    await page.waitForTimeout(700)
    const origin = await boxOf(cell(0, 0))
    const far = await boxOf(cell(level.size - 1, level.size - 1))
    boxes = {
      forced: await boxOf(cell(forced.row, forced.col)),
      hole: await boxOf(cell(hole.row, hole.col)),
      buttons: await boxOf(page.getByRole('group', { name: 'Choose an animal' })),
      grid: { x: origin.x, y: origin.y, w: far.x + far.w - origin.x, h: far.y + far.h - origin.y },
    }
    await selectAnimal(page, forced.size)
    await movePointer(page, cell(forced.row, forced.col))
    await page.waitForTimeout(160)
    await cell(forced.row, forced.col).click({ timeout: 8000 })
    stamp('place')
    await page.waitForTimeout(260)
    const placed = await cell(forced.row, forced.col).getAttribute('aria-label')
    if (!placed?.includes('complete')) throw new Error(`Mouse home did not close: ${placed}`)
    await hidePointer(page)
    await page.waitForTimeout(860)
    await selectAnimal(page, hole.wrong)
    await movePointer(page, cell(hole.row, hole.col))
    await page.waitForTimeout(160)
    await cell(hole.row, hole.col).click({ timeout: 8000 })
    stamp('fail')
    await page.waitForTimeout(240)
    const failed = await cell(hole.row, hole.col).getAttribute('aria-label')
    if (!failed?.includes('does not fit')) throw new Error(`Wrong tap did not turn red: ${failed}`)
    await page.waitForTimeout(1100)
    await hidePointer(page)
    await cell(hole.row, hole.col).click({ timeout: 8000 })
    stamp('erase')
    await page.waitForTimeout(180)
    await clearAnimal(page)
    await hidePointer(page)
    await page.waitForTimeout(400)
    stamp('hold')
    const still = await cell(forced.row, forced.col).getAttribute('aria-label')
    if (!still?.includes('complete')) throw new Error('Mouse home broke after the erase')
  } catch (error) {
    const shot = path.join(dir, 'fail.png')
    await page.screenshot({ path: shot }).catch(() => {})
    await context.close().catch(() => {})
    throw new Error(`${clip.id} capture failed (${shot}): ${error instanceof Error ? error.message : String(error)}`)
  }
  const video = page.video()
  await page.close()
  await context.close()
  const recorded = await video.path()
  const target = path.join(dir, 'gameplay.webm')
  if (fs.existsSync(target)) fs.rmSync(target)
  fs.copyFileSync(recorded, target)
  fs.writeFileSync(path.join(dir, 'events.json'), JSON.stringify({ level: clip.level, boxes, events }, null, 2))
  console.log('captured', clip.id, events.map((event) => `${event.type}@${event.t.toFixed(2)}`).join(' '))
}

const even = (value) => Math.max(2, Math.round(value / 2) * 2)

const reframe = (clip, meta) => {
  const pad = 16
  const grid = meta.boxes.grid
  const crop = {
    x: Math.max(0, even(grid.x - pad)),
    y: Math.max(0, even(grid.y - pad)),
    w: even(Math.min(VW - Math.max(0, even(grid.x - pad)), grid.w + pad * 2)),
    h: even(Math.min(VH - Math.max(0, even(grid.y - pad)), grid.h + pad * 2)),
  }
  const buttonY0 = Math.max(0, Math.round(meta.boxes.buttons.y - 12))
  const buttonCrop = {
    x: crop.x,
    y: even(buttonY0),
    w: crop.w,
    h: even(Math.min(VH - even(buttonY0), meta.boxes.buttons.h + 24)),
  }
  const target = 980
  const scale = target / crop.w
  const boardX = Math.round((VW - target) / 2)
  const boardY = 312
  const buttonH = even(buttonCrop.h * scale)
  const buttonY = boardY + target + 28
  if (buttonY + buttonH > VH - 16) throw new Error(`Buttons fall off the frame at ${buttonY + buttonH}`)
  const framed = path.join(clipDir(clip), 'framed.mp4')
  const duration = probeDuration(path.join(clipDir(clip), 'gameplay.webm'))
  const graph = [
    `[0:v]crop=${crop.w}:${crop.h}:${crop.x}:${crop.y},scale=${target}:${target}:flags=lanczos[board]`,
    `[0:v]crop=${buttonCrop.w}:${buttonCrop.h}:${buttonCrop.x}:${buttonCrop.y},scale=${target}:${buttonH}:flags=lanczos[btns]`,
    `[1:v][board]overlay=${boardX}:${boardY}:shortest=1[mid]`,
    `[mid][btns]overlay=${boardX}:${buttonY}:shortest=1,fps=${FPS},format=yuv420p[vout]`,
  ].join(';')
  run('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-i', path.join(clipDir(clip), 'gameplay.webm'),
    '-f', 'lavfi', '-i', `color=c=0xfff9f0:s=${VW}x${VH}:r=${FPS}`,
    '-filter_complex', graph,
    '-map', '[vout]',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-t', duration.toFixed(3),
    framed,
  ])
  const map = (box) => ({
    x: (box.x - crop.x) * scale + boardX,
    y: (box.y - crop.y) * scale + boardY,
    w: box.w * scale,
    h: box.h * scale,
  })
  return { file: framed, forced: map(meta.boxes.forced), hole: map(meta.boxes.hole) }
}

const frameAt = (raw, at, file) => {
  run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', at.toFixed(3), '-i', raw, '-frames:v', '1', file])
}

const buildSfx = (hits, file) => {
  const sets = {
    place: [{ f: 740, d: 0.06, g: 0.5 }, { f: 988, d: 0.1, g: 0.45, o: 0.1 }],
    fail: [{ f: 196, d: 0.18, g: 0.7 }, { f: 146, d: 0.16, g: 0.5, o: 0.08 }],
  }
  const notes = []
  for (const hit of hits) {
    for (const note of sets[hit.type]) notes.push({ ...note, start: hit.at + (note.o ?? 0) })
  }
  const inputs = []
  const filters = []
  const labels = []
  notes.forEach((note, index) => {
    inputs.push('-f', 'lavfi', '-i', `sine=frequency=${note.f}:duration=${note.d}:sample_rate=${SR}`)
    const delay = Math.max(0, Math.round(note.start * 1000))
    filters.push(`[${index}:a]volume=${note.g},afade=t=out:st=0:d=${note.d}:curve=exp,adelay=${delay}|${delay}[a${index}]`)
    labels.push(`[a${index}]`)
  })
  const graph = `${filters.join(';')};${labels.join('')}amix=inputs=${labels.length}:duration=longest:normalize=0[out]`
  run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...inputs, '-filter_complex', graph, '-map', '[out]', '-t', String(TOTAL), '-ac', '1', file])
}

const buildTrend = () => {
  if (fs.existsSync(BED) && process.env.FORCE_AUDIO !== '1') return
  fs.mkdirSync(path.dirname(BED), { recursive: true })
  const beat = 60 / 132
  const bar = beat * 4
  const kick = `aevalsrc=0.95*exp(-32*t)*sin(2*PI*(168-120*t)*t):s=${SR}:d=0.14`
  const clap = `anoisesrc=d=0.045:c=white:r=${SR}:a=0.55,highpass=f=1600,afade=t=out:st=0.008:d=0.035`
  const hat = `anoisesrc=d=0.025:c=white:r=${SR}:a=0.3,highpass=f=5200,afade=t=out:st=0.003:d=0.02`
  const bass = `sine=frequency=50:duration=0.11:sample_rate=${SR},afade=t=out:st=0.015:d=0.09`
  const layers = [
    { src: kick, times: [0, beat, beat * 2, beat * 3], volume: 0.95 },
    { src: clap, times: [beat, beat * 3], volume: 0.48 },
    { src: hat, times: [beat * 0.5, beat * 1.5, beat * 2.5, beat * 3.5], volume: 0.2 },
    { src: bass, times: [0, beat * 2], volume: 0.42 },
  ]
  const inputs = []
  const filters = []
  const labels = []
  let index = 0
  for (const layer of layers) {
    for (const at of layer.times) {
      inputs.push('-f', 'lavfi', '-i', layer.src)
      const delay = Math.max(0, Math.round(at * 1000))
      filters.push(`[${index}:a]volume=${layer.volume},adelay=${delay}|${delay},apad=pad_dur=${bar.toFixed(3)}[a${index}]`)
      labels.push(`[a${index}]`)
      index += 1
    }
  }
  const barFile = path.join(path.dirname(BED), 'lesson-bar.wav')
  const barGraph = `${filters.join(';')};${labels.join('')}amix=inputs=${labels.length}:duration=longest:normalize=0,atrim=0:${bar.toFixed(3)}[out]`
  run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...inputs, '-filter_complex', barGraph, '-map', '[out]', '-t', bar.toFixed(3), '-ac', '2', '-ar', String(SR), barFile])
  const whoosh = `anoisesrc=d=0.4:c=pink:r=${SR}:a=0.45,highpass=f=600,lowpass=f=4800,afade=t=in:st=0:d=0.28,afade=t=out:st=0.2:d=0.2`
  const whooshGraph = `[0:a]volume=0.92,aloop=loop=12:size=${Math.round(bar * SR)}[bed];[1:a]volume=0.5,adelay=2350|2350[w1];[1:a]volume=0.5,adelay=10550|10550[w2];[bed][w1][w2]amix=inputs=3:duration=first:normalize=0,alimiter=limit=0.9,afade=t=in:st=0:d=0.04,afade=t=out:st=14.55:d=0.4,atrim=0:${TOTAL}[out]`
  run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', barFile, '-f', 'lavfi', '-i', whoosh, '-filter_complex', whooshGraph, '-map', '[out]', '-t', String(TOTAL), '-ac', '2', '-ar', String(SR), path.join(PROMO, 'audio/lesson-trend.wav')])
}

const mixAudio = (hits, file, track, trackAt, gain) => {
  const sfx = file.replace(/mix\.wav$/, 'sfx.wav')
  buildSfx(hits, sfx)
  const graph = `[0:a]volume=${gain}dB,afade=t=in:st=0:d=0.06,afade=t=out:st=14.45:d=0.5[bed];[1:a]volume=0.55,apad=pad_dur=${TOTAL}[sfx];[bed][sfx]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95,atrim=0:${TOTAL}[out]`
  run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', trackAt.toFixed(3), '-i', track, '-i', sfx, '-filter_complex', graph, '-map', '[out]', '-t', String(TOTAL), '-ac', '2', '-ar', String(SR), file])
}

const ringOverlay = (box) => {
  const pad = 18
  return {
    w: Math.round(box.w + pad),
    h: Math.round(box.h + pad),
    x: Math.round(box.x - pad / 2),
    y: Math.round(box.y - pad / 2),
  }
}

const compose = (clip) => {
  const dir = clipDir(clip)
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'events.json'), 'utf8'))
  const framed = reframe(clip, meta)
  const raw = framed.file
  const at = (type) => {
    const event = meta.events.find((item) => item.type === type)
    if (!event) throw new Error(`Missing ${type}`)
    return event.t
  }
  const ready = at('ready')
  const place = at('place')
  const fail = at('fail')
  const erase = at('erase')
  const placeStart = place - 0.62
  const placeEnd = place + 1.05
  const failStart = fail - 0.62
  const failEnd = fail + 0.72
  if (failEnd >= erase - 0.05) throw new Error('Fail clip runs into the erase')
  const beats = FORMATS[clip.format]
  if (!beats) throw new Error(`Unknown format ${clip.format}`)
  const span = (key) => beats[key][1] - beats[key][0]
  const placeSlot = span('place')
  const failSlot = span('fail')
  const placePad = placeSlot - (placeEnd - placeStart)
  const failPad = failSlot - (failEnd - failStart)
  if (placePad < 0.2 || failPad < 0.2) throw new Error(`Slots too short: place ${placePad.toFixed(2)} fail ${failPad.toFixed(2)}`)
  const work = path.join(dir, 'work')
  fs.mkdirSync(work, { recursive: true })
  const frameA = path.join(work, 'a.png')
  const frameB = path.join(work, 'b.png')
  frameAt(raw, ready + 0.25, frameA)
  frameAt(raw, at('hold') + 0.12, frameB)
  const mix = path.join(work, 'mix.wav')
  mixAudio([
    { type: 'place', at: beats.place[0] + (place - placeStart) },
    { type: 'fail', at: beats.fail[0] + (fail - failStart) },
  ], mix, path.join(AUDIO, clip.track), clip.trackAt, clip.gain)
  const forcedRing = ringOverlay(framed.forced)
  const holeRing = ringOverlay(framed.hole)
  const handAt = (box) => ({
    x: Math.round(box.x + box.w / 2 - TIP.x),
    y: Math.round(box.y + box.h / 2 - TIP.y),
  })
  const placeHand = handAt(framed.forced)
  const failHand = handAt(framed.hole)
  const boardY = 150
  const fadeCard = (label, start, end) =>
    `[${label}]format=rgba,fade=t=in:st=${start.toFixed(2)}:d=0.1:alpha=1,fade=t=out:st=${Math.max(start + 0.2, end - 0.14).toFixed(2)}:d=0.12:alpha=1[${label}o]`
  const hookLen = span('hook')
  const introAfterFail = beats.order.includes('intro') && beats.order.indexOf('fail') < beats.order.indexOf('intro')
  const introLen = beats.order.includes('intro') ? beats.place[0] - (introAfterFail ? beats.fail[1] : beats.hook[1]) : 0.24
  const personFile = path.join(PEOPLE, `${clip.id}.mp4`)
  const inputs = [
    '-ss', clip.personAt.toFixed(3), '-t', hookLen.toFixed(3), '-i', personFile,
    '-loop', '1', '-framerate', String(FPS), '-t', introLen.toFixed(3), '-i', frameA,
    '-i', raw,
    '-loop', '1', '-framerate', String(FPS), '-t', span('ask').toFixed(3), '-i', frameB,
    '-loop', '1', '-framerate', String(FPS), '-t', String(TOTAL), '-i', path.join(CARDS, `${clip.id}-hook.png`),
    '-loop', '1', '-framerate', String(FPS), '-t', String(TOTAL), '-i', path.join(CARDS, 'mouse.png'),
    '-loop', '1', '-framerate', String(FPS), '-t', String(TOTAL), '-i', path.join(CARDS, 'cat.png'),
    '-loop', '1', '-framerate', String(FPS), '-t', String(TOTAL), '-i', path.join(CARDS, 'apart.png'),
    '-loop', '1', '-framerate', String(FPS), '-t', String(TOTAL), '-i', path.join(CARDS, 'place.png'),
    '-loop', '1', '-framerate', String(FPS), '-t', String(TOTAL), '-i', path.join(CARDS, 'nope.png'),
    '-loop', '1', '-framerate', String(FPS), '-t', String(TOTAL), '-i', path.join(CARDS, 'question.png'),
    '-loop', '1', '-framerate', String(FPS), '-t', String(TOTAL), '-i', path.join(CARDS, 'ring.png'),
    '-loop', '1', '-framerate', String(FPS), '-t', String(TOTAL), '-i', HAND,
    '-loop', '1', '-framerate', String(FPS), '-t', String(TOTAL), '-i', LOGO,
    '-i', mix,
  ]
  const segments = { open: '[open]', intro: '[intro]', place: '[place]', fail: '[fail]', ask: '[ask]' }
  const ringIn = beats.mouse ? beats.mouse[0] : beats.place[0]
  const ringOut = beats.mouse ? beats.place[0] : beats.place[1] - 0.12
  const captionLayers = [
    beats.hook && { input: '4:v', start: 0.12, end: beats.hook[1] - 0.08, y: clip.hookY },
    beats.mouse && { input: '5:v', start: beats.mouse[0], end: beats.mouse[1], y: boardY },
    beats.cat && { input: '6:v', start: beats.cat[0], end: beats.cat[1], y: boardY },
    beats.apart && { input: '7:v', start: beats.apart[0], end: beats.apart[1], y: boardY },
    beats.place && { input: '8:v', start: beats.place[0] + 0.2, end: beats.place[1], y: boardY },
    beats.fail && { input: '9:v', start: beats.fail[0] + 0.28, end: beats.fail[1], y: boardY },
    beats.ask && { input: '10:v', start: beats.ask[0] + 0.1, end: beats.ask[1] - 0.05, y: boardY },
  ].filter(Boolean)
  const graph = [
    `[0:v]scale=${VW}:${VH}:force_original_aspect_ratio=increase,crop=${VW}:${VH},fps=${FPS},setsar=1,format=yuv420p[open]`,
    `[1:v]scale=${VW}:${VH}:flags=lanczos,fps=${FPS},setsar=1,format=yuv420p[intro]`,
    beats.order.includes('intro') ? null : '[intro]nullsink',
    `[2:v]trim=${placeStart.toFixed(3)}:${placeEnd.toFixed(3)},setpts=PTS-STARTPTS,fps=${FPS},scale=${VW}:${VH}:flags=lanczos,setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=${placePad.toFixed(3)}[place]`,
    `[2:v]trim=${failStart.toFixed(3)}:${failEnd.toFixed(3)},setpts=PTS-STARTPTS,fps=${FPS},scale=${VW}:${VH}:flags=lanczos,setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=${failPad.toFixed(3)}[fail]`,
    `[3:v]scale=${VW}:${VH}:flags=lanczos,fps=${FPS},setsar=1,format=yuv420p[ask]`,
    `${beats.order.map((name) => segments[name]).join('')}concat=n=${beats.order.length}:v=1:a=0,format=yuv420p[base]`,
    ...captionLayers.map((layer) => fadeCard(layer.input, layer.start, layer.end)),
    `[11:v]format=rgba,split[ringSrcA][ringSrcB]`,
    `[ringSrcA]scale=${forcedRing.w}:${forcedRing.h},fade=t=in:st=${ringIn.toFixed(2)}:d=0.1:alpha=1,fade=t=out:st=${ringOut.toFixed(2)}:d=0.12:alpha=1[ringA]`,
    `[ringSrcB]scale=${holeRing.w}:${holeRing.h},fade=t=in:st=${(beats.ask[0] + 0.08).toFixed(2)}:d=0.12:alpha=1[ringB]`,
    `[12:v]format=rgba,colorkey=0x00FF00:0.24:0.04,scale=${HAND_PX}:${HAND_PX},despill=type=green:mix=0.9:expand=0.5,split[handA][handB]`,
    `[handA]fade=t=in:st=${beats.place[0].toFixed(2)}:d=0.12:alpha=1,fade=t=out:st=${(beats.place[1] - 0.12).toFixed(2)}:d=0.1:alpha=1[handPlace]`,
    `[handB]fade=t=in:st=${beats.fail[0].toFixed(2)}:d=0.1:alpha=1,fade=t=out:st=${(beats.fail[1] - 0.12).toFixed(2)}:d=0.1:alpha=1[handFail]`,
  ]
  let cursor = 'base'
  captionLayers.forEach((layer, index) => {
    const next = `cap${index}`
    graph.push(`[${cursor}][${layer.input.split(':')[0]}:vo]overlay=x=(W-w)/2:y=${layer.y}:format=auto:eof_action=pass[${next}]`)
    cursor = next
  })
  graph.push(
    `[${cursor}][ringA]overlay=x=${forcedRing.x}:y=${forcedRing.y}:format=auto:eof_action=pass[v8]`,
    `[v8][ringB]overlay=x=${holeRing.x}:y=${holeRing.y}:format=auto:eof_action=pass[v9]`,
    `[v9][handPlace]overlay=x=${placeHand.x}:y=${placeHand.y}:format=auto:eof_action=pass[v10]`,
    `[13:v]format=rgba,scale=150:-1[logo]`,
    `[v10][handFail]overlay=x=${failHand.x}:y=${failHand.y}:format=auto:eof_action=pass[v11]`,
    `[v11][logo]overlay=x=36:y=28:format=auto:eof_action=pass,format=yuv420p[vout]`,
  )
  const filter = graph.filter(Boolean).join(';')
  fs.mkdirSync(OUT, { recursive: true })
  const outfile = path.join(OUT, `${clip.id}-${clip.slug}.mp4`)
  run('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    ...inputs,
    '-filter_complex', filter,
    '-map', '[vout]', '-map', '14:a',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart',
    '-c:a', 'aac', '-b:a', '160k', '-ac', '2',
    '-t', String(TOTAL),
    outfile,
  ])
  const duration = probeDuration(outfile)
  if (duration > 15.05) throw new Error(`Reel is ${duration.toFixed(2)}s`)
  run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', '1.1', '-i', outfile, '-frames:v', '1', '-q:v', '3', outfile.replace(/\.mp4$/, '.jpg')])
  const frames = path.join(OUT, 'frames', clip.id)
  fs.mkdirSync(frames, { recursive: true })
  const shots = clip.format === 'rush' ? [1.0, 3.2, 5.2, 8.5, 12.4] : clip.format === 'snap' ? [1.0, 3.2, 5.6, 8.6, 12.4] : [1.1, 3.3, 7.4, 9.6, 12.4]
  for (const second of shots) {
    run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', String(second), '-i', outfile, '-frames:v', '1', path.join(frames, `${second.toFixed(1)}.png`)])
  }
  console.log('built', path.basename(outfile), `${duration.toFixed(2)}s`, 'level', clip.level)
  return duration
}

const writeSheet = (clips) => {
  const sheet = path.join(OUT, 'captions.txt')
  if (fs.existsSync(sheet) && fs.readFileSync(sheet, 'utf8').includes('Shorts — название')) return
  const lines = [
    '01-only-1-percent.mp4 тоже постится. Ниже ролики, которые собирает этот скрипт.',
    'Разные люди и три подачи: урок, ошибка сразу, сразу ход. Без голоса, без плашек, логотип в углу.',
    'Музыка Kevin MacLeod. Backbeat — CC0. Остальные — CC BY 4.0, кредиты ниже, в описание поста.',
    '',
  ]
  for (const clip of clips) {
    const file = `${clip.id}-${clip.slug}.mp4`
    const full = path.join(OUT, file)
    const length = fs.existsSync(full) ? `${probeDuration(full).toFixed(1)} с` : 'ещё не собран'
    lines.push(`${clip.id}. ${file} · ${clip.format} · уровень ${clip.level} · ${length}`)
    lines.push(`Хук: ${clip.hook.replace(/<[^>]+>/g, '')}`)
    lines.push(`Музыка: ${clip.credit}`)
    lines.push('Дальше: Mouse = 2 / Cat = 3 / Same sizes stay apart / Two cells / nope / Which animal?')
    lines.push('Simple rules. Tricky board. Play free. https://crittermino.vercel.app')
    lines.push('#crittermino #logicpuzzle #brainteaser')
    lines.push('')
  }
  fs.writeFileSync(sheet, `${lines.join('\n')}\n`)
}

const selectedClips = () => {
  const wanted = process.argv.slice(2)
  if (wanted.length === 0) return CLIPS
  return CLIPS.filter((clip) => wanted.includes(clip.id) || wanted.includes(clip.slug))
}

const main = async () => {
  const clips = selectedClips()
  if (clips.length === 0) throw new Error('No clips selected')
  if (!fs.existsSync(HAND)) throw new Error(`Missing ${HAND}`)
  if (!fs.existsSync(LOGO)) throw new Error(`Missing ${LOGO}`)
  for (const clip of clips) {
    const person = path.join(PEOPLE, `${clip.id}.mp4`)
    const track = path.join(AUDIO, clip.track)
    if (!fs.existsSync(person)) throw new Error(`Missing ${person}`)
    if (!fs.existsSync(track)) throw new Error(`Missing ${track}`)
  }
  await renderCards(clips)
  fs.mkdirSync(OUT, { recursive: true })
  const needsCapture = clips.some((clip) => process.env.FORCE === '1' || !fs.existsSync(path.join(clipDir(clip), 'gameplay.webm')))
  const browser = needsCapture ? await chromium.launch() : null
  try {
    for (const clip of clips) {
      const raw = path.join(clipDir(clip), 'gameplay.webm')
      if (process.env.FORCE === '1' || !fs.existsSync(raw)) await capture(browser, clip)
      else console.log('reuse raw', clip.id)
      compose(clip)
    }
  } finally {
    if (browser) await browser.close()
  }
  writeSheet(clips)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
