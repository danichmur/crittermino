import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const LEVEL = Number(process.env.LEVEL ?? 53)
const BASE = process.env.BASE ?? 'http://localhost:3000'
const OUT = path.resolve(ROOT, process.env.OUT ?? 'promo/raw')
const STEP = Number(process.env.STEP ?? 230)
const REGION_PAUSE = Number(process.env.REGION_PAUSE ?? 360)
const VW = Number(process.env.VW ?? 720)
const VH = Number(process.env.VH ?? 1280)
const EMOJI_FONT = process.env.EMOJI_FONT === 'noto'

const EMOJI_BY_SIZE = { 2: '🐭', 3: '🐱', 4: '🐶', 5: '🐼', 6: '🦁' }
const NAME_BY_SIZE = { 2: 'Mouse', 3: 'Cat', 4: 'Dog', 5: 'Panda', 6: 'Lion' }

const { levels } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/levels.json'), 'utf8'))
const level = levels.find((item) => item.number === LEVEL)
if (!level) throw new Error(`Level ${LEVEL} not found`)
const size = level.size

const neighbors = (row, col) =>
  [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ].filter(([r, c]) => r >= 0 && c >= 0 && r < size && c < size)

const buildRegionOrder = () => {
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
        for (const [nr, nc] of neighbors(r, c)) {
          if (!seen[nr][nc] && level.solution[nr][nc] === value) {
            seen[nr][nc] = true
            stack.push([nr, nc])
          }
        }
      }
      const empties = cells.filter(([r, c]) => !level.givens[r][c])
      if (empties.length === 0) continue
      const ordered = bfsOrder(cells, empties)
      regions.push({ value, cells: ordered, top: Math.min(...cells.map((x) => x[0])), left: Math.min(...cells.map((x) => x[1])) })
    }
  }
  regions.sort((a, b) => a.top - b.top || a.left - b.left)
  return regions
}

const bfsOrder = (cells, empties) => {
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
    for (const [nr, nc] of neighbors(r, c)) {
      const k = key(nr, nc)
      if (inRegion.has(k) && emptySet.has(k) && !visited.has(k)) {
        visited.add(k)
        queue.push([nr, nc])
      }
    }
  }
  for (const [r, c] of empties) if (!visited.has(key(r, c))) order.push([r, c])
  return order
}

const run = async () => {
  fs.mkdirSync(OUT, { recursive: true })
  for (const file of fs.readdirSync(OUT)) if (file.endsWith('.webm')) fs.rmSync(path.join(OUT, file))
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: 2,
    reducedMotion: 'no-preference',
    recordVideo: { dir: OUT, size: { width: VW, height: VH } },
  })
  await context.addInitScript((lvl) => {
    const completed = []
    for (let n = 1; n < lvl; n += 1) completed.push(n)
    window.localStorage.setItem(
      'crittermino-progress-v1',
      JSON.stringify({
        currentLevel: lvl,
        completedLevels: completed,
        bestMoves: {},
        hintsUsed: 0,
        totalMoves: 0,
        streak: 3,
        lastPlayed: '',
        lastDaily: '',
        soundEnabled: false,
        hapticsEnabled: false,
        tutorialCompleted: true,
      }),
    )
  }, LEVEL)
  if (EMOJI_FONT) {
    await context.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=block'
        const style = document.createElement('style')
        style.textContent = `:root {
          --font-fredoka: 'Fredoka Variable', 'Noto Color Emoji' !important;
          --font-inter: 'Inter Variable', 'Noto Color Emoji' !important;
        }`
        document.head.append(link, style)
      })
    })
  }

  const page = await context.newPage()
  const t0 = Date.now()
  const events = []
  const stamp = (type) => events.push({ t: (Date.now() - t0) / 1000, type })
  await page.goto(`${BASE}/?play=next`, { waitUntil: 'networkidle' })
  await page.waitForSelector('[data-row="0"][data-col="0"]', { timeout: 15000 })
  await page.waitForTimeout(700)

  const dismiss = page.getByText('Tap to dismiss')
  if (await dismiss.count()) {
    await dismiss.click().catch(() => {})
    await page.waitForTimeout(400)
  }
  await page.waitForTimeout(900)

  const regions = buildRegionOrder()
  let currentSize = null
  for (let ri = 0; ri < regions.length; ri += 1) {
    const region = regions[ri]
    const isLastRegion = ri === regions.length - 1
    if (region.value !== currentSize) {
      const name = NAME_BY_SIZE[region.value]
      await page.getByRole('button', { name: new RegExp(`^${name}, homes of ${region.value}`) }).click()
      currentSize = region.value
      await page.waitForTimeout(150)
    }
    for (let ci = 0; ci < region.cells.length; ci += 1) {
      const [r, c] = region.cells[ci]
      const isLastCell = ci === region.cells.length - 1
      await page.locator(`[data-row="${r}"][data-col="${c}"]`).click()
      stamp(isLastRegion && isLastCell ? 'win' : isLastCell ? 'complete' : 'place')
      await page.waitForTimeout(STEP)
    }
    await page.waitForTimeout(REGION_PAUSE)
  }
  fs.writeFileSync(
    path.join(OUT, `gameplay-${LEVEL}.events.json`),
    JSON.stringify({ t0ms: t0, totalMs: Date.now() - t0, events }, null, 2),
  )

  await page.waitForSelector('text=Homes found!', { timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(3200)

  await page.close()
  await context.close()
  await browser.close()

  const files = fs.readdirSync(OUT).filter((f) => f.endsWith('.webm'))
  const latest = files
    .map((f) => ({ f, t: fs.statSync(path.join(OUT, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t)[0]
  const target = path.join(OUT, `gameplay-${LEVEL}.webm`)
  if (latest) fs.renameSync(path.join(OUT, latest.f), target)
  console.log('saved', target)
  const emptyCount = regions.reduce((sum, region) => sum + region.cells.length, 0)
  console.log('regions', regions.length, 'placements', emptyCount)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
