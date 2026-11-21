// 20 vertical gameplay clips for TikTok and Instagram Reels.
// node scripts/social-clips.mjs
// node scripts/social-clips.mjs 01 02
// FORCE=1 recaptures gameplay even when a raw take already exists.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PROMO = path.resolve(ROOT, '../crittermino-growth/promo')
const BASE = process.env.BASE ?? 'http://localhost:3000'
const RAW_ROOT = path.join(PROMO, 'raw/social')
const CARD_ROOT = path.join(PROMO, 'social/cards')
const OUT_ROOT = path.join(PROMO, 'out/social')
const AUDIO_DIR = path.join(PROMO, 'audio')
const VW = 1080
const VH = 1920
const OUT_W = 1080
const OUT_H = 1920
const SR = 48000
const NAME_BY_SIZE = { 2: 'Mouse', 3: 'Cat', 4: 'Dog', 5: 'Panda', 6: 'Lion' }
const TAGS = [
  '#logicpuzzle #oddlysatisfying #brainteaser #indiegame',
  '#puzzlegame #satisfying #mobilegame #cozygaming',
  '#sudoku #dailypuzzle #freegame #casualgames',
  '#fillomino #logicgames #browsergame #nonguessing',
]

const CLIPS = [
  { id: '01', slug: 'mouse-cat-dog', level: 6, line1: 'Mouse = 2 cells', line2: 'Cat = 3. Dog = 4.', caption: 'Mouse homes are 2 cells. Cats take 3. Dogs take 4. Same-size homes cannot share a wall.' },
  { id: '02', slug: 'same-size', level: 8, line1: 'Same-size homes', line2: 'cannot share a wall.', caption: 'Corners may touch. A shared wall between two homes of the same size is illegal.' },
  { id: '03', slug: 'one-solution', level: 11, line1: 'This grid has', line2: 'exactly one solution.', caption: 'You do not guess the next cell. You prove it. Every Crittermino level works this way.' },
  { id: '04', slug: 'no-guessing', level: 13, line1: 'No guessing.', line2: 'Every cell is forced.', caption: 'If a cell still has two animals that fit, you are not looking at the right clue yet.' },
  { id: '05', slug: 'fill-every-cell', level: 15, line1: 'Empty cells', line2: 'are not finished.', caption: 'Every square becomes part of a home. The puzzle ends when the grid is full and legal.' },
  { id: '06', slug: 'homes-lock-in', level: 17, line1: 'Watch each home', line2: 'close itself.', caption: 'A home locks when it has the right number of connected cells. Then the next one starts.' },
  { id: '07', slug: 'not-sudoku', level: 19, line1: 'Not Sudoku.', line2: 'The rows do not matter.', caption: 'Rows and columns are not the rule. The homes are. Right size, connected, same sizes apart.' },
  { id: '08', slug: 'the-clue', level: 10, line1: 'The clue you need', line2: 'is already placed.', caption: 'The animals already on the board are the whole hint. Nothing else is hidden.' },
  { id: '09', slug: 'corners', level: 20, line1: 'Corners can touch.', line2: 'Walls cannot.', caption: 'Two homes of the same size may meet at a corner. They may not share a side.' },
  { id: '10', slug: 'every-critter', level: 12, line1: 'Every critter', line2: 'gets a home.', caption: 'Mouse, cat, and dog. Each one gets a connected home of the right size, and then the grid is full.' },
  { id: '11', slug: 'panda', level: 22, line1: 'A panda needs', line2: 'exactly 5 cells.', caption: 'Panda joins on the bigger boards. The home can bend. It still has to be exactly five connected cells.' },
  { id: '12', slug: 'homes-bend', level: 24, line1: 'A home can bend.', line2: 'It cannot split.', caption: 'A region may turn corners. It has to stay in one piece, edge to edge.' },
  { id: '13', slug: 'dogs-apart', level: 27, line1: 'Dogs take 4.', line2: 'And they stay apart.', caption: 'A dog home is four connected cells. Another dog cannot sit against the same wall.' },
  { id: '14', slug: 'no-ads', level: 30, line1: 'No ads. No account.', line2: 'Just the grid.', caption: 'Free in the browser. No download and no login. The daily board is the same for everyone.' },
  { id: '15', slug: 'hidden-pattern', level: 33, line1: 'The pattern is', line2: 'hiding in the clues.', caption: 'Count the open cells around a clue. The size of the home is already decided.' },
  { id: '16', slug: 'free-browser', level: 35, line1: 'Free in the browser.', line2: 'Nothing to install.', caption: 'Open it, play a level, leave. The progress stays on this device.' },
  { id: '17', slug: 'lion', level: 37, line1: 'A lion needs', line2: '6 cells, connected.', caption: 'Lion is the biggest home. Six cells, edge to edge, and no second lion against that wall.' },
  { id: '18', slug: 'count-first', level: 40, line1: 'Count the cells.', line2: 'Then place the animal.', caption: 'The number is the animal. Count the room first, then commit.' },
  { id: '19', slug: 'same-level', level: 44, line1: 'This level is the same', line2: 'for every player.', caption: 'Level 44 is level 44 for everybody. The daily grid works the same way, one board worldwide.' },
  { id: '20', slug: 'zero-hints', level: 48, line1: 'Zero hints.', line2: 'Still solved.', caption: 'The hint button stays unused. The givens are enough when each home is the right size.' },
]

const FONT = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">
`

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const fontSizeFor = (line1, line2) => {
  const longest = Math.max(line1.length, line2.length)
  if (longest > 26) return 46
  if (longest > 22) return 50
  return 56
}

const hookHtml = (clip) => `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONT}
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { background: transparent; }
  body { width: 1080px; height: 420px; display: flex; justify-content: center; align-items: flex-start; padding-top: 8px; font-family: Fredoka, "Avenir Next", "Trebuchet MS", sans-serif; }
  .pill { max-width: 960px; background: #fff; border: 4px solid #ffd0dc; border-radius: 36px; padding: 22px 40px 26px; text-align: center; box-shadow: 0 18px 50px rgba(61,44,41,0.22); }
  .kicker { font-size: 22px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #E84B7F; }
  .line { margin-top: 6px; font-size: ${fontSizeFor(clip.line1, clip.line2)}px; font-weight: 700; color: #3D2C29; letter-spacing: -0.4px; line-height: 1.05; }
  .accent { color: #E84B7F; }
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
  body { width: 1080px; height: 140px; display: flex; justify-content: center; align-items: center; font-family: Fredoka, "Avenir Next", "Trebuchet MS", sans-serif; }
  .chip { background: rgba(255,255,255,0.96); border: 3px solid #ffd0dc; border-radius: 999px; padding: 14px 28px; font-size: 32px; font-weight: 700; color: #3D2C29; box-shadow: 0 10px 30px rgba(61,44,41,0.16); }
  .chip span { color: #E84B7F; }
</style></head>
<body><div class="chip"><span>Play free</span> · crittermino.vercel.app</div></body></html>`

const loadLevel = (levelNumber) => {
  const { levels } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/levels.json'), 'utf8'))
  const level = levels.find((item) => item.number === levelNumber)
  if (!level) throw new Error(`Level ${levelNumber} not found`)
  return level
}

const neighbors = (size, row, col) =>
  [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ].filter(([r, c]) => r >= 0 && c >= 0 && r < size && c < size)

const buildRegions = (level) => {
  const size = level.size
  const seen = Array.from({ length: size }, () => Array(size).fill(false))
  const regions = []
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (seen[row][col]) continue
      const value = level.solution[row][col]
      const cells = []
      const stack = [[row, col]]
      seen[row][col] = true
      while (stack.length > 0) {
        const [r, c] = stack.pop()
        cells.push([r, c])
        for (const [nr, nc] of neighbors(size, r, c)) {
          if (!seen[nr][nc] && level.solution[nr][nc] === value) {
            seen[nr][nc] = true
            stack.push([nr, nc])
          }
        }
      }
      const empties = cells.filter(([r, c]) => !level.givens[r][c])
      if (empties.length === 0) continue
      regions.push({
        value,
        cells: orderEmpties(size, cells, empties),
        top: Math.min(...cells.map(([r]) => r)),
        left: Math.min(...cells.map(([, c]) => c)),
      })
    }
  }
  regions.sort((a, b) => a.top - b.top || a.left - b.left)
  return regions
}

const orderEmpties = (size, cells, empties) => {
  const key = (r, c) => `${r}:${c}`
  const inRegion = new Set(cells.map(([r, c]) => key(r, c)))
  const emptySet = new Set(empties.map(([r, c]) => key(r, c)))
  const start = empties.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])[0]
  const visited = new Set([key(...start)])
  const queue = [start]
  const order = []
  while (queue.length > 0) {
    const [r, c] = queue.shift()
    order.push([r, c])
    for (const [nr, nc] of neighbors(size, r, c)) {
      const id = key(nr, nc)
      if (inRegion.has(id) && emptySet.has(id) && !visited.has(id)) {
        visited.add(id)
        queue.push([nr, nc])
      }
    }
  }
  for (const [r, c] of empties) if (!visited.has(key(r, c))) order.push([r, c])
  return order
}

const hideDevChrome = () => {
  const root = document.documentElement
  if (!root) return
  const style = document.createElement('style')
  style.textContent = 'nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay],[data-next-badge-root]{display:none!important}'
  root.append(style)
  const sweep = () => {
    document.querySelectorAll('nextjs-portal').forEach((node) => node.remove())
  }
  sweep()
  new MutationObserver(sweep).observe(document.documentElement, { childList: true, subtree: true })
}

const renderCards = async (clips) => {
  fs.mkdirSync(CARD_ROOT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 420 }, deviceScaleFactor: 1 })
  await page.setViewportSize({ width: 1080, height: 140 })
  await page.setContent(chipHtml(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
  const chip = page.locator('.chip')
  await chip.screenshot({ path: path.join(CARD_ROOT, 'url-chip.png'), omitBackground: true })
  for (const clip of clips) {
    await page.setViewportSize({ width: 1080, height: 420 })
    await page.setContent(hookHtml(clip), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(200)
    await page.locator('.pill').screenshot({ path: path.join(CARD_ROOT, `${clip.id}-hook.png`), omitBackground: true })
    console.log('card', clip.id)
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
  await page.waitForTimeout(70)
}

const captureClip = async (browser, clip) => {
  const level = loadLevel(clip.level)
  const regions = buildRegions(level)
  const empties = regions.reduce((sum, region) => sum + region.cells.length, 0)
  const step = empties <= 18 ? 300 : 210
  const regionPause = 480
  const dir = path.join(RAW_ROOT, clip.id)
  fs.mkdirSync(dir, { recursive: true })
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.webm') || file.endsWith('.json')) fs.rmSync(path.join(dir, file))
  }
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
    const bestMoves = {}
    bestMoves[lvl] = 999
    try {
    window.localStorage.setItem('crittermino-locale', 'en')
    document.cookie = 'crittermino-locale=en; Path=/; Max-Age=31536000; SameSite=Lax'
    window.localStorage.setItem(
      'crittermino-progress-v1',
      JSON.stringify({
        currentLevel: lvl,
        completedLevels: completed,
        bestMoves,
        hintsUsed: 0,
        totalMoves: 0,
        streak: 0,
        lastPlayed: '',
        lastDaily: '',
        soundEnabled: false,
        hapticsEnabled: false,
        tutorialCompleted: true,
      }),
    )
    } catch { /* about:blank has no storage; the real page runs this again */ }
  }, clip.level)
  const page = await context.newPage()
  const t0 = Date.now()
  const events = []
  const stamp = (type) => events.push({ t: (Date.now() - t0) / 1000, type })
  try {
    await page.goto(`${BASE}/?play=next`, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForSelector('[data-row="0"][data-col="0"]', { timeout: 20000 })
    await page.waitForFunction(() => document.fonts.ready)
    await page.addStyleTag({
      content: [
        '.max-w-3xl{max-width:none!important;padding:0 64px 280px!important}',
        '.max-w-3xl>header{display:none!important}',
        '.flex.min-h-0.flex-1.items-center{align-items:flex-end!important}',
        'nextjs-portal,[data-nextjs-toast]{display:none!important}',
      ].join(''),
    })
    await page.evaluate(hideDevChrome)
    await page.evaluate(() => {
      const pointer = document.createElement('div')
      pointer.id = 'tap-pointer'
      pointer.style.cssText = 'position:fixed;z-index:70;width:28px;height:28px;margin:-14px 0 0 -14px;border:3px solid #E84B7F;border-radius:999px;background:rgba(255,255,255,0.55);box-shadow:0 6px 14px rgba(61,44,41,0.18);pointer-events:none;transform:translate(-80px,-80px);transition:transform 70ms linear;'
      document.body.appendChild(pointer)
    })
    const dismiss = page.getByText('Tap to dismiss')
    if (await dismiss.count()) await dismiss.click({ timeout: 1000 }).catch(() => {})
    const levelLabel = await page.locator('header p').first().textContent()
    if (!levelLabel?.includes(String(clip.level))) throw new Error(`opened ${levelLabel}, expected level ${clip.level}`)
    await page.waitForTimeout(1100)
    let currentSize = null
    for (let ri = 0; ri < regions.length; ri += 1) {
      const region = regions[ri]
      const isLastRegion = ri === regions.length - 1
      if (region.value !== currentSize) {
        const name = NAME_BY_SIZE[region.value]
        const button = page.getByRole('button', { name: new RegExp(`^${name}, homes of ${region.value}`) })
        if ((await button.getAttribute('aria-pressed')) !== 'true') {
          await movePointer(page, button)
          await button.click({ timeout: 8000 })
          await page.waitForTimeout(160)
        }
        currentSize = region.value
      }
      for (let ci = 0; ci < region.cells.length; ci += 1) {
        const [r, c] = region.cells[ci]
        const isLastCell = ci === region.cells.length - 1
        const cell = page.locator(`[data-row="${r}"][data-col="${c}"]`)
        await movePointer(page, cell)
        await cell.click({ timeout: 8000 })
        const kind = isLastRegion && isLastCell ? 'win' : isLastCell ? 'complete' : 'place'
        stamp(kind)
        if (kind === 'win') {
          await page.waitForTimeout(260)
          await page.evaluate(() => {
            const pointer = document.getElementById('tap-pointer')
            if (pointer) pointer.style.opacity = '0'
          })
        }
        await page.waitForTimeout(step)
      }
      await page.waitForTimeout(regionPause)
    }
    await page.waitForSelector('text=Homes found!', { timeout: 8000 })
    await page.waitForTimeout(2300)
  } catch (error) {
    const shot = path.join(dir, 'fail.png')
    await page.screenshot({ path: shot }).catch(() => {})
    await context.close().catch(() => {})
    throw new Error(`${clip.id} capture failed (${shot}): ${error instanceof Error ? error.message : String(error)}`)
  }
  fs.writeFileSync(path.join(dir, 'events.json'), JSON.stringify({ level: clip.level, events }, null, 2))
  const video = page.video()
  await page.close()
  const target = path.join(dir, 'gameplay.webm')
  await video.saveAs(target)
  await context.close()
  const win = events.find((event) => event.type === 'win')
  if (!win) throw new Error(`${clip.id} finished without a win stamp`)
  console.log('captured', clip.id, 'level', clip.level, 'placements', empties, 'events', events.length)
  return target
}

const probeDuration = (file) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }).trim())

const buildMusic = () => {
  fs.mkdirSync(AUDIO_DIR, { recursive: true })
  const file = path.join(AUDIO_DIR, 'social-music.wav')
  if (fs.existsSync(file) && process.env.FORCE_AUDIO !== '1') return file
  const pattern = [523.25, 659.25, 783.99, 880, 783.99, 659.25, 587.33, 659.25]
  const step = 0.42
  const total = 18
  const notes = []
  for (let i = 0, t = 0; t < total; i += 1, t += step) notes.push({ f: pattern[i % pattern.length], d: 0.62, g: 0.16, start: t })
  const inputs = []
  const filters = []
  const labels = []
  notes.forEach((note, index) => {
    inputs.push('-f', 'lavfi', '-i', `sine=frequency=${note.f}:duration=${note.d}:sample_rate=${SR}`)
    const delay = Math.round(note.start * 1000)
    filters.push(`[${index}:a]volume=${note.g},afade=t=out:st=0:d=${note.d}:curve=exp,adelay=${delay}|${delay}[a${index}]`)
    labels.push(`[a${index}]`)
  })
  const silent = notes.length
  inputs.push('-f', 'lavfi', '-i', `anullsrc=r=${SR}:cl=mono`)
  filters.push(`[${silent}:a]atrim=0:${total}[sil]`)
  labels.push('[sil]')
  const graph = `${filters.join(';')};${labels.join('')}amix=inputs=${labels.length}:duration=longest:normalize=0,lowpass=f=2800,volume=0.9[out]`
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...inputs, '-filter_complex', graph, '-map', '[out]', '-t', String(total), '-ac', '1', file], { stdio: 'inherit' })
  console.log('music ready')
  return file
}

const buildSfx = (events, start, speed, duration, file) => {
  const tap = [{ f: 740, d: 0.05, g: 0.62 }]
  const complete = [
    { f: 523.25, d: 0.11, g: 0.5, o: 0 },
    { f: 659.25, d: 0.12, g: 0.5, o: 0.08 },
    { f: 783.99, d: 0.16, g: 0.5, o: 0.16 },
  ]
  const win = [
    { f: 523.25, d: 0.13, g: 0.58, o: 0 },
    { f: 659.25, d: 0.13, g: 0.58, o: 0.12 },
    { f: 783.99, d: 0.13, g: 0.58, o: 0.24 },
    { f: 1046.5, d: 0.28, g: 0.62, o: 0.36 },
  ]
  const notes = []
  for (const event of events) {
    if (event.t < start || event.t > start + duration * speed + 0.05) continue
    const at = (event.t - start) / speed
    const set = event.type === 'win' ? win : event.type === 'complete' ? complete : tap
    for (const note of set) notes.push({ ...note, start: at + (note.o ?? 0) })
  }
  if (notes.length === 0) notes.push({ f: 740, d: 0.05, g: 0.01, start: 0 })
  const inputs = []
  const filters = []
  const labels = []
  notes.forEach((note, index) => {
    inputs.push('-f', 'lavfi', '-i', `sine=frequency=${note.f}:duration=${note.d}:sample_rate=${SR}`)
    const delay = Math.max(0, Math.round(note.start * 1000))
    filters.push(`[${index}:a]volume=${note.g},afade=t=out:st=0:d=${note.d}:curve=exp,adelay=${delay}|${delay}[a${index}]`)
    labels.push(`[a${index}]`)
  })
  const silent = notes.length
  inputs.push('-f', 'lavfi', '-i', `anullsrc=r=${SR}:cl=mono`)
  filters.push(`[${silent}:a]atrim=0:${duration.toFixed(3)}[sil]`)
  labels.push('[sil]')
  const graph = `${filters.join(';')};${labels.join('')}amix=inputs=${labels.length}:duration=longest:normalize=0[out]`
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...inputs, '-filter_complex', graph, '-map', '[out]', '-t', duration.toFixed(3), '-ac', '1', file], { stdio: 'inherit' })
}

const composeClip = (clip, musicFile) => {
  const dir = path.join(RAW_ROOT, clip.id)
  const raw = path.join(dir, 'gameplay.webm')
  const { events } = JSON.parse(fs.readFileSync(path.join(dir, 'events.json'), 'utf8'))
  const first = events[0]
  const win = events.find((event) => event.type === 'win')
  if (!first || !win) throw new Error(`${clip.id} is missing timing events`)
  const videoDuration = probeDuration(raw)
  const start = Math.max(0.04, first.t - 0.85)
  const end = Math.min(videoDuration - 0.04, win.t + 2.15)
  const rawLen = end - start
  if (rawLen < 3) throw new Error(`${clip.id} gameplay window is ${rawLen.toFixed(2)}s`)
  const speed = rawLen > 17 ? Math.min(1.55, rawLen / 15.5) : 1
  const gpDur = rawLen / speed
  const sfxFile = path.join(dir, 'sfx.wav')
  const mixFile = path.join(dir, 'mix.wav')
  buildSfx(events, start, speed, gpDur, sfxFile)
  const fadeOut = Math.max(0, gpDur - 0.45)
  execFileSync(
    'ffmpeg',
    [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-i', musicFile, '-i', sfxFile,
      '-filter_complex',
      `[0:a]atrim=0:${gpDur.toFixed(3)},volume=0.55,afade=t=in:st=0:d=0.2,afade=t=out:st=${fadeOut.toFixed(3)}:d=0.4[m];[1:a]volume=1.15[s];[m][s]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.95[out]`,
      '-map', '[out]', '-t', gpDur.toFixed(3), '-ac', '2', '-ar', String(SR), mixFile,
    ],
    { stdio: 'inherit' },
  )
  const hook = path.join(CARD_ROOT, `${clip.id}-hook.png`)
  const chip = path.join(CARD_ROOT, 'url-chip.png')
  const outfile = path.join(OUT_ROOT, `${clip.id}-${clip.slug}.mp4`)
  const cover = path.join(OUT_ROOT, `${clip.id}-${clip.slug}.jpg`)
  const hookLife = Math.min(3.15, gpDur - 1.4)
  const graph = [
    `[0:v]trim=${start.toFixed(3)}:${end.toFixed(3)},setpts=(PTS-STARTPTS)/${speed},fps=30,scale=${OUT_W}:${OUT_H}:flags=lanczos,setsar=1,format=yuv420p[gp]`,
    `[1:v]format=rgba,fade=t=in:st=0:d=0.2:alpha=1[chip]`,
    `[2:v]format=rgba,fade=t=in:st=0.12:d=0.18:alpha=1,fade=t=out:st=${Math.max(0.4, hookLife - 0.35).toFixed(3)}:d=0.32:alpha=1[hook]`,
    `[gp][chip]overlay=x=(W-w)/2:y=128:format=auto:eof_action=pass[v1]`,
    `[v1][hook]overlay=x=(W-w)/2:y=236:format=auto:eof_action=pass,format=yuv420p[vout]`,
  ].join(';')
  execFileSync(
    'ffmpeg',
    [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-i', raw,
      '-loop', '1', '-framerate', '30', '-t', gpDur.toFixed(3), '-i', chip,
      '-loop', '1', '-framerate', '30', '-t', hookLife.toFixed(3), '-i', hook,
      '-i', mixFile,
      '-filter_complex', graph,
      '-map', '[vout]', '-map', '3:a',
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart',
      '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-ar', String(SR),
      '-t', gpDur.toFixed(3),
      '-metadata', `title=Crittermino ${clip.line1} ${clip.line2}`,
      '-metadata', 'comment=https://crittermino.vercel.app',
      outfile,
    ],
    { stdio: 'inherit' },
  )
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', '1.05', '-i', outfile, '-frames:v', '1', '-q:v', '3', cover], { stdio: 'inherit' })
  const duration = probeDuration(outfile)
  const bytes = fs.statSync(outfile).size
  console.log('built', path.basename(outfile), `${duration.toFixed(1)}s`, `${(bytes / 1024 / 1024).toFixed(1)}MB`, `speed ${speed.toFixed(2)}`)
  return { file: outfile, cover, duration, bytes }
}

const writeSheet = (made) => {
  const byId = new Map(made.map((item) => [item.id, item]))
  const lines = [
    '20 вертикальных роликов 1080×1920 для TikTok и Instagram Reels.',
    'Текст на видео английский: игра на английском, так ролики доходят дальше.',
    'Постить по одному в день, не все сразу. Ссылка в био: https://crittermino.vercel.app',
    'В описании TikTok ссылку лучше не ставить. Обложка — jpg с тем же именем, на ней виден хук.',
    'Если накладываешь трендовый звук, выключи оригинальную дорожку.',
    '',
  ]
  for (const [index, clip] of CLIPS.entries()) {
    const item = byId.get(clip.id)
    const file = `${clip.id}-${clip.slug}.mp4`
    const onDisk = path.join(OUT_ROOT, file)
    const seconds = item?.duration ?? (fs.existsSync(onDisk) ? probeDuration(onDisk) : null)
    const length = seconds ? `${seconds.toFixed(1)} с` : 'ещё не собран'
    lines.push(`${clip.id}. ${file} · уровень ${clip.level} · ${length}`)
    lines.push(`На экране: ${clip.line1} / ${clip.line2}`)
    lines.push(clip.caption)
    lines.push('Play free. Link in bio.')
    lines.push(`#crittermino ${TAGS[index % TAGS.length]}`)
    lines.push('')
  }
  fs.writeFileSync(path.join(OUT_ROOT, 'captions.txt'), lines.join('\n'))
}

const selectedClips = () => {
  const wanted = process.argv.slice(2)
  if (wanted.length === 0) return CLIPS
  const clips = CLIPS.filter((clip) => wanted.includes(clip.id) || wanted.includes(clip.slug))
  if (clips.length !== wanted.length) throw new Error(`Unknown clip id in: ${wanted.join(', ')}`)
  return clips
}

const run = async () => {
  const clips = selectedClips()
  fs.mkdirSync(OUT_ROOT, { recursive: true })
  await renderCards(clips)
  const musicFile = buildMusic()
  let browser = await chromium.launch()
  const failures = []
  const made = []
  let sinceLaunch = 0
  for (const clip of clips) {
    const raw = path.join(RAW_ROOT, clip.id, 'gameplay.webm')
    const attempt = async () => {
      const metaPath = path.join(RAW_ROOT, clip.id, 'events.json')
      const savedLevel = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')).level : null
      if (process.env.FORCE === '1' || !fs.existsSync(raw) || savedLevel !== clip.level) {
        if (sinceLaunch >= 1) {
          await browser.close().catch(() => {})
          browser = await chromium.launch()
          sinceLaunch = 0
        }
        await captureClip(browser, clip)
        sinceLaunch += 1
      } else console.log('reuse raw', clip.id)
      return composeClip(clip, musicFile)
    }
    try {
      made.push({ id: clip.id, ...(await attempt()) })
    } catch (error) {
      console.error(error)
      await browser.close().catch(() => {})
      browser = await chromium.launch()
      sinceLaunch = 0
      try {
        made.push({ id: clip.id, ...(await attempt()) })
      } catch (retryError) {
        failures.push(retryError instanceof Error ? retryError.message : String(retryError))
        console.error(retryError)
      }
    }
  }
  await browser.close()
  writeSheet(made)
  console.log('done', made.length, 'clips')
  if (failures.length > 0) {
    console.error(failures.join('\n'))
    process.exit(1)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
