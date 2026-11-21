// Dumb-player reels: the last cell is obvious, and the tap still picks the wrong animal.
// node scripts/fail-reels.mjs
// node scripts/fail-reels.mjs 01

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PROMO = path.resolve(ROOT, '../crittermino-growth/promo')
const BASE = process.env.BASE ?? 'http://localhost:3000'
const RAW_ROOT = path.join(PROMO, 'raw/fails')
const CARD_ROOT = path.join(PROMO, 'fails/cards')
const OUT_ROOT = path.join(PROMO, 'out/fails')
const AUDIO_DIR = path.join(PROMO, 'audio')
const VW = 540
const VH = 960
const OUT_W = 1080
const OUT_H = 1920
const SR = 48000
const NAME_BY_SIZE = { 2: 'Mouse', 3: 'Cat', 4: 'Dog', 5: 'Panda', 6: 'Lion' }

const CLIPS = [
  { id: '01', slug: 'its-a-mouse', level: 6, row: 2, col: 3, correct: 2, wrongs: [4, 3], line1: "That's a mouse.", line2: 'He picks the dog.', caption: 'One cell left, and it is a mouse. He tries the dog, then the cat. Both turn red. The mouse fits immediately.' },
  { id: '02', slug: 'one-cell', level: 8, row: 1, col: 2, correct: 2, wrongs: [3, 4], line1: 'One cell left.', line2: 'Two wrong animals.', caption: 'The board is already solved except one cell. He still taps the cat, then the dog, and only then the mouse.' },
  { id: '03', slug: 'its-a-cat', level: 10, row: 0, col: 0, correct: 3, wrongs: [2, 4], line1: "That's a cat.", line2: 'He taps the mouse.', caption: 'The corner wants a cat. The mouse does not fit. The dog does not fit. The cat closes the home.' },
  { id: '04', slug: 'two-cells', level: 12, row: 0, col: 4, correct: 2, wrongs: [4, 3], line1: 'Mouse. Two cells.', line2: "He doesn't buy it.", caption: 'The mouse home is one cell short. A dog and a cat both refuse that hole.' },
  { id: '05', slug: 'stop-guessing', level: 14, row: 0, col: 0, correct: 2, wrongs: [3, 4], line1: "Don't guess.", line2: 'He guesses.', caption: 'Cat, then dog. The cell turns red both times. The mouse was the only move.' },
  { id: '06', slug: 'last-cell', level: 20, row: 4, col: 4, correct: 2, wrongs: [4, 3], line1: 'Last cell.', line2: 'Dog. Cat. Mouse.', caption: 'Last cell of the level. Two wrong animals, then the right one, and the homes are found.' },
]

const FONT = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap" rel="stylesheet">
`

const escapeHtml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const fontSizeFor = (line1, line2) => {
  const longest = Math.max(line1.length, line2.length)
  if (longest > 24) return 48
  if (longest > 18) return 54
  return 60
}

const hookHtml = (clip) => `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONT}
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { background: transparent; }
  body { width: 1080px; height: 420px; display: flex; justify-content: center; align-items: flex-start; padding-top: 8px; font-family: Fredoka, "Avenir Next", sans-serif; }
  .pill { max-width: 960px; background: #fff; border: 4px solid #ffd0dc; border-radius: 36px; padding: 22px 40px 26px; text-align: center; box-shadow: 0 18px 50px rgba(61,44,41,0.22); }
  .kicker { font-size: 22px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #E84B7F; }
  .line { margin-top: 4px; font-size: ${fontSizeFor(clip.line1, clip.line2)}px; font-weight: 700; color: #3D2C29; line-height: 1.05; }
  .accent { color: #E11D48; }
</style></head>
<body><div class="pill">
  <div class="kicker">Level ${clip.level}</div>
  <div class="line">${escapeHtml(clip.line1)}</div>
  <div class="line accent">${escapeHtml(clip.line2)}</div>
</div></body></html>`

const chipHtml = () => `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONT}
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { background: transparent; }
  body { width: 1080px; height: 140px; display: flex; justify-content: center; align-items: center; font-family: Fredoka, "Avenir Next", sans-serif; }
  .chip { background: rgba(255,255,255,0.96); border: 3px solid #ffd0dc; border-radius: 999px; padding: 14px 28px; font-size: 32px; font-weight: 700; color: #3D2C29; box-shadow: 0 10px 30px rgba(61,44,41,0.16); }
  .chip span { color: #E84B7F; }
</style></head>
<body><div class="chip"><span>Play free</span> · crittermino.vercel.app</div></body></html>`

const nopeHtml = () => `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONT}
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { background: transparent; }
  body { width: 1080px; height: 180px; display: flex; justify-content: center; align-items: center; font-family: Fredoka, "Avenir Next", sans-serif; }
  .nope { background: #E11D48; color: #fff; border-radius: 999px; padding: 12px 36px; font-size: 54px; font-weight: 700; box-shadow: 0 12px 30px rgba(225,29,72,0.35); }
</style></head>
<body><div class="nope">nope.</div></body></html>`

const loadLevel = (levelNumber) => {
  const { levels } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/levels.json'), 'utf8'))
  const level = levels.find((item) => item.number === levelNumber)
  if (!level) throw new Error(`Level ${levelNumber} not found`)
  return level
}

const emptyCells = (level, trap) => {
  const cells = []
  for (let row = 0; row < level.size; row += 1) {
    for (let col = 0; col < level.size; col += 1) {
      if (level.givens[row][col]) continue
      if (row === trap.row && col === trap.col) continue
      cells.push({ row, col, value: level.solution[row][col] })
    }
  }
  return cells
}

const hideDevChrome = () => {
  const root = document.documentElement
  if (!root) return
  const style = document.createElement('style')
  style.textContent = 'nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay],[data-next-badge-root]{display:none!important}'
  root.append(style)
  const sweep = () => document.querySelectorAll('nextjs-portal').forEach((node) => node.remove())
  sweep()
  new MutationObserver(sweep).observe(root, { childList: true, subtree: true })
}

const renderCards = async (clips) => {
  fs.mkdirSync(CARD_ROOT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 420 }, deviceScaleFactor: 1 })
  await page.setViewportSize({ width: 1080, height: 140 })
  await page.setContent(chipHtml(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  await page.locator('.chip').screenshot({ path: path.join(CARD_ROOT, 'url-chip.png'), omitBackground: true })
  await page.setViewportSize({ width: 1080, height: 180 })
  await page.setContent(nopeHtml(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(200)
  await page.locator('.nope').screenshot({ path: path.join(CARD_ROOT, 'nope.png'), omitBackground: true })
  for (const clip of clips) {
    await page.setViewportSize({ width: 1080, height: 420 })
    await page.setContent(hookHtml(clip), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(200)
    await page.locator('.pill').screenshot({ path: path.join(CARD_ROOT, `${clip.id}-hook.png`), omitBackground: true })
  }
  await browser.close()
}

const movePointer = async (page, locator) => {
  const box = await locator.boundingBox()
  if (!box) return
  await page.evaluate(({ x, y }) => {
    const pointer = document.getElementById('tap-pointer')
    if (pointer) pointer.style.transform = `translate(${x}px, ${y}px)`
  }, { x: box.x + box.width / 2, y: box.y + box.height / 2 })
  await page.waitForTimeout(60)
}

const selectAnimal = async (page, size) => {
  const name = NAME_BY_SIZE[size]
  const button = page.getByRole('button', { name: new RegExp(`^${name}, homes of ${size}`) })
  if ((await button.getAttribute('aria-pressed')) === 'true') return
  await movePointer(page, button)
  await button.click({ timeout: 8000 })
  await page.waitForTimeout(120)
}

const captureClip = async (browser, clip) => {
  const level = loadLevel(clip.level)
  const trap = { row: clip.row, col: clip.col }
  if (level.solution[trap.row][trap.col] !== clip.correct) throw new Error(`${clip.id} trap is not a ${clip.correct}`)
  const setup = emptyCells(level, trap)
  const dir = path.join(RAW_ROOT, clip.id)
  fs.mkdirSync(dir, { recursive: true })
  const context = await browser.newContext({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: 1,
    locale: 'en-US',
    reducedMotion: 'no-preference',
    recordVideo: { dir, size: { width: VW, height: VH } },
  })
  await context.addInitScript(hideDevChrome)
  await context.addInitScript((lvl) => {
    const completed = []
    for (let n = 1; n < lvl; n += 1) completed.push(n)
    window.localStorage.setItem('crittermino-locale', 'en')
    document.cookie = 'crittermino-locale=en; Path=/; Max-Age=31536000; SameSite=Lax'
    window.localStorage.setItem('crittermino-progress-v1', JSON.stringify({
      currentLevel: lvl,
      completedLevels: completed,
      bestMoves: { [lvl]: 999 },
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
  const stamp = (type) => events.push({ t: (Date.now() - t0) / 1000, type })
  const cell = (row, col) => page.locator(`[data-row="${row}"][data-col="${col}"]`)
  try {
    await page.goto(`${BASE}/?play=next`, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForSelector('[data-row="0"][data-col="0"]', { timeout: 20000 })
    await page.getByText(`Level ${clip.level}`, { exact: true }).waitFor({ timeout: 8000 })
    await page.evaluate(hideDevChrome)
    await page.evaluate(() => {
      const pointer = document.createElement('div')
      pointer.id = 'tap-pointer'
      pointer.style.cssText = 'position:fixed;z-index:70;width:28px;height:28px;margin:-14px 0 0 -14px;border:3px solid #E11D48;border-radius:999px;background:rgba(255,255,255,0.55);pointer-events:none;transform:translate(-80px,-80px);'
      document.body.append(pointer)
    })
    await page.waitForTimeout(700)
    let current = null
    for (const spot of setup) {
      if (spot.value !== current) {
        await selectAnimal(page, spot.value)
        current = spot.value
      }
      const target = cell(spot.row, spot.col)
      await movePointer(page, target)
      await target.click({ timeout: 8000 })
      stamp('place')
      await page.waitForTimeout(150)
    }
    await page.waitForTimeout(450)
    const hole = cell(trap.row, trap.col)
    for (const wrong of clip.wrongs) {
      await selectAnimal(page, wrong)
      current = wrong
      await movePointer(page, hole)
      await hole.click({ timeout: 8000 })
      stamp('fail')
      await page.waitForTimeout(1000)
      await movePointer(page, hole)
      await hole.click({ timeout: 8000 })
      stamp('erase')
      await page.waitForTimeout(280)
    }
    await selectAnimal(page, clip.correct)
    await movePointer(page, hole)
    await hole.click({ timeout: 8000 })
    stamp('win')
    await page.evaluate(() => {
      const pointer = document.getElementById('tap-pointer')
      if (pointer) pointer.style.opacity = '0'
    })
    await page.waitForSelector('text=Homes found!', { timeout: 8000 })
    await page.waitForTimeout(2100)
  } catch (error) {
    const shot = path.join(dir, 'fail.png')
    await page.screenshot({ path: shot }).catch(() => {})
    await context.close().catch(() => {})
    throw new Error(`${clip.id} capture failed (${shot}): ${error instanceof Error ? error.message : String(error)}`)
  }
  fs.writeFileSync(path.join(dir, 'events.json'), JSON.stringify({ level: clip.level, events }, null, 2))
  const video = page.video()
  await page.close()
  await context.close()
  const recorded = await video.path()
  const target = path.join(dir, 'gameplay.webm')
  if (fs.existsSync(target)) fs.rmSync(target)
  fs.copyFileSync(recorded, target)
  console.log('captured', clip.id, 'level', clip.level, 'setup', setup.length, 'fails', clip.wrongs.length)
}

const probeDuration = (file) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }).trim())

const musicFile = () => {
  const file = path.join(AUDIO_DIR, 'social-music.wav')
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`)
  return file
}

const buildSfx = (events, start, speed, duration, file) => {
  const sets = {
    place: [{ f: 740, d: 0.05, g: 0.55 }],
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
    const at = (event.t - start) / speed
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

const composeClip = (clip, bed) => {
  const dir = path.join(RAW_ROOT, clip.id)
  const raw = path.join(dir, 'gameplay.webm')
  const { events } = JSON.parse(fs.readFileSync(path.join(dir, 'events.json'), 'utf8'))
  const first = events[0]
  const win = events.find((event) => event.type === 'win')
  const fails = events.filter((event) => event.type === 'fail')
  if (!first || !win || fails.length === 0) throw new Error(`${clip.id} is missing the fail`)
  const videoDuration = probeDuration(raw)
  const start = Math.max(0.04, first.t - 0.55)
  const end = Math.min(videoDuration - 0.04, win.t + 2.05)
  const rawLen = end - start
  const speed = rawLen > 16 ? Math.min(1.45, rawLen / 14.5) : 1
  const gpDur = rawLen / speed
  const sfxFile = path.join(dir, 'sfx.wav')
  const mixFile = path.join(dir, 'mix.wav')
  buildSfx(events, start, speed, gpDur, sfxFile)
  const fadeOut = Math.max(0, gpDur - 0.4)
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', bed, '-i', sfxFile, '-filter_complex', `[0:a]atrim=0:${gpDur.toFixed(3)},volume=0.42,afade=t=in:st=0:d=0.15,afade=t=out:st=${fadeOut.toFixed(3)}:d=0.35[m];[1:a]volume=1.2[s];[m][s]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.95[out]`, '-map', '[out]', '-t', gpDur.toFixed(3), '-ac', '2', '-ar', String(SR), mixFile], { stdio: 'inherit' })
  const firstFail = (fails[0].t - start) / speed
  const hookLife = Math.max(1.4, Math.min(3.1, firstFail - 0.25))
  const nopeEnable = fails.map((event) => {
    const at = (event.t - start) / speed
    return `between(t,${at.toFixed(2)},${(at + 0.85).toFixed(2)})`
  }).join('+')
  const outfile = path.join(OUT_ROOT, `${clip.id}-${clip.slug}.mp4`)
  const cover = path.join(OUT_ROOT, `${clip.id}-${clip.slug}.jpg`)
  const graph = [
    `[0:v]trim=${start.toFixed(3)}:${end.toFixed(3)},setpts=(PTS-STARTPTS)/${speed},fps=30,scale=${OUT_W}:${OUT_H}:flags=lanczos,setsar=1,format=yuv420p[gp]`,
    `[1:v]format=rgba,fade=t=in:st=0:d=0.15:alpha=1[chip]`,
    `[2:v]format=rgba,fade=t=in:st=0.1:d=0.16:alpha=1,fade=t=out:st=${Math.max(0.4, hookLife - 0.28).toFixed(3)}:d=0.25:alpha=1[hook]`,
    `[3:v]format=rgba[nope]`,
    `[gp][chip]overlay=x=(W-w)/2:y=118:format=auto:eof_action=pass[v1]`,
    `[v1][hook]overlay=x=(W-w)/2:y=220:format=auto:eof_action=pass[v2]`,
    `[v2][nope]overlay=x=(W-w)/2:y=250:enable='${nopeEnable}':format=auto:eof_action=pass,format=yuv420p[vout]`,
  ].join(';')
  execFileSync('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-i', raw,
    '-loop', '1', '-framerate', '30', '-t', gpDur.toFixed(3), '-i', path.join(CARD_ROOT, 'url-chip.png'),
    '-loop', '1', '-framerate', '30', '-t', hookLife.toFixed(3), '-i', path.join(CARD_ROOT, `${clip.id}-hook.png`),
    '-loop', '1', '-framerate', '30', '-t', gpDur.toFixed(3), '-i', path.join(CARD_ROOT, 'nope.png'),
    '-i', mixFile,
    '-filter_complex', graph,
    '-map', '[vout]', '-map', '4:a',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart',
    '-c:a', 'aac', '-b:a', '160k', '-ac', '2',
    '-t', gpDur.toFixed(3),
    outfile,
  ], { stdio: 'inherit' })
  const coverAt = Math.min(1.05, Math.max(0.4, hookLife * 0.45))
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', coverAt.toFixed(2), '-i', outfile, '-frames:v', '1', '-q:v', '3', cover], { stdio: 'inherit' })
  const duration = probeDuration(outfile)
  console.log('built', path.basename(outfile), `${duration.toFixed(1)}s`)
  return duration
}

const writeSheet = () => {
  const lines = [
    '6 рилсов, где ход очевидный, а тап всё равно не тот.',
    '1080×1920. Текст на видео английский. Ссылка на экране.',
    'Постить отдельно от обычных геймплейных. Ссылка в био: https://crittermino.vercel.app',
    'В описании TikTok ссылку лучше не ставить. Если накладываешь трендовый звук, выключи оригинальную дорожку.',
    '',
  ]
  for (const clip of CLIPS) {
    const file = `${clip.id}-${clip.slug}.mp4`
    const full = path.join(OUT_ROOT, file)
    const length = fs.existsSync(full) ? `${probeDuration(full).toFixed(1)} с` : 'ещё не собран'
    lines.push(`${clip.id}. ${file} · уровень ${clip.level} · ${length}`)
    lines.push(`На экране: ${clip.line1} / ${clip.line2}`)
    lines.push(clip.caption)
    lines.push('Play free. Link in bio.')
    lines.push('#crittermino #logicpuzzle #oddlysatisfying #brainteaser')
    lines.push('')
  }
  fs.writeFileSync(path.join(OUT_ROOT, 'captions.txt'), lines.join('\n'))
}

const selectedClips = () => {
  const wanted = process.argv.slice(2)
  if (wanted.length === 0) return CLIPS
  return CLIPS.filter((clip) => wanted.includes(clip.id) || wanted.includes(clip.slug))
}

const run = async () => {
  const clips = selectedClips()
  if (clips.length === 0) throw new Error('No clips selected')
  fs.mkdirSync(OUT_ROOT, { recursive: true })
  await renderCards(clips)
  const bed = musicFile()
  const needsCapture = clips.some((clip) => {
    const raw = path.join(RAW_ROOT, clip.id, 'gameplay.webm')
    const metaPath = path.join(RAW_ROOT, clip.id, 'events.json')
    const savedLevel = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')).level : null
    return process.env.FORCE === '1' || !fs.existsSync(raw) || savedLevel !== clip.level
  })
  const browser = needsCapture ? await chromium.launch() : null
  const failures = []
  for (const clip of clips) {
    try {
      const raw = path.join(RAW_ROOT, clip.id, 'gameplay.webm')
      const metaPath = path.join(RAW_ROOT, clip.id, 'events.json')
      const savedLevel = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')).level : null
      if (process.env.FORCE === '1' || !fs.existsSync(raw) || savedLevel !== clip.level) {
        await captureClip(browser, clip)
      } else console.log('reuse raw', clip.id)
      composeClip(clip, bed)
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error))
      console.error(error)
    }
  }
  if (browser) await browser.close()
  writeSheet()
  console.log('done', clips.length - failures.length, 'of', clips.length)
  if (failures.length > 0) process.exit(1)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
