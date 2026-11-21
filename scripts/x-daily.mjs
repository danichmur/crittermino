// Daily grid cards for X. The unsolved board is the post.
// node scripts/x-daily.mjs
// node scripts/x-daily.mjs 14
// DATE=2026-11-18 node scripts/x-daily.mjs 7

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const GROWTH = path.resolve(ROOT, '../crittermino-growth')
const OUT = path.join(GROWTH, 'promo/out/x-daily')
const FONT = fs.readFileSync(
  path.join(ROOT, 'node_modules/@fontsource-variable/fredoka/files/fredoka-latin-wght-normal.woff2'),
).toString('base64')

const EPOCH_UTC = Date.UTC(2026, 0, 1)
const DAILY_FIRST = 6
const LEVEL_CAP = 300
const DAILY_COUNT = LEVEL_CAP - DAILY_FIRST + 1
const MS_PER_DAY = 86_400_000

const ANIMALS = {
  2: { emoji: '🐭', name: 'Mouse', fill: '#E8ECF1', ink: '#3E4856', accent: '#7C8796' },
  3: { emoji: '🐱', name: 'Cat', fill: '#FFF4CC', ink: '#8A6A00', accent: '#E6B325' },
  4: { emoji: '🐶', name: 'Dog', fill: '#F6E6D4', ink: '#6B4124', accent: '#C0844A' },
  5: { emoji: '🐼', name: 'Panda', fill: '#E8F5E8', ink: '#1B7A45', accent: '#3CB371' },
  6: { emoji: '🦁', name: 'Lion', fill: '#FFE5D9', ink: '#C05612', accent: '#FF8C42' },
}

const HOOKS = [
  ['Today\'s grid.', 'Same board for every player.', 'Reply with your time.'],
  ['New daily.', 'Mouse homes are 2 cells. Lions are 6.', 'Same sizes can\'t share a wall.'],
  ['One grid today.', 'Empty cells are not finished.', 'Corners are usually forced.'],
  ['Today\'s board.', 'Same puzzle worldwide until midnight UTC.', 'How many moves?'],
  ['Daily grid.', 'A wrong animal turns the cell red.', 'The right one was already forced.'],
  ['New board.', 'Every home is one connected piece.', 'Who clears it clean?'],
  ['Today\'s grid.', 'No ads. No account.', 'Just this board.'],
]

const { levels } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/levels.json'), 'utf8'))
const byNumber = new Map(levels.map((level) => [level.number, level]))

const parseStart = () => {
  const raw = process.env.DATE
  if (!raw) return new Date()
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
  if (!match) throw new Error('DATE must be YYYY-MM-DD')
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12))
}

const utcDateString = (date) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const dailyLevelNumber = (date) => {
  const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  const dayIndex = Math.floor((utc - EPOCH_UTC) / MS_PER_DAY)
  const index = ((dayIndex % DAILY_COUNT) + DAILY_COUNT) % DAILY_COUNT
  return DAILY_FIRST + index
}

const addDays = (date, days) => new Date(date.getTime() + days * MS_PER_DAY)

const weekday = (date) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(date)

const escapeHtml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const cardHtml = (level, date) => {
  const size = level.size
  const cell = Math.floor(Math.min(92, 760 / size))
  const gap = size >= 9 ? 6 : 8
  const font = Math.round(cell * 0.46)
  const num = Math.max(11, Math.round(cell * 0.16))
  const dot = Math.max(6, Math.round(cell * 0.1))
  const palette = [...level.palette].sort((a, b) => a - b)
  const cells = []
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!level.givens[row][col]) {
        cells.push('<div class="cell empty"></div>')
        continue
      }
      const value = level.solution[row][col]
      const animal = ANIMALS[value]
      cells.push(
        `<div class="cell" style="background:${animal.fill};color:${animal.ink}">` +
          `<span class="dot" style="background:${animal.accent}"></span>` +
          `<span class="emoji">${animal.emoji}</span>` +
          `<span class="num">${value}</span>` +
          `</div>`,
      )
    }
  }
  const legend = palette
    .map((value) => {
      const animal = ANIMALS[value]
      return `<span class="key"><b>${animal.emoji}</b> ${value}</span>`
    })
    .join('')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
    @font-face{font-family:Fredoka;src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:400 700;font-display:block;}
    * { margin: 0; box-sizing: border-box; }
    html, body { width: 1080px; height: 1080px; background: #FFF9F0; font-family: Fredoka, "Avenir Next", sans-serif; color: #3D2C29; }
    body { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 56px 40px; }
    .kicker { font-size: 22px; font-weight: 650; letter-spacing: 0.22em; text-transform: uppercase; color: #E84B7F; }
    h1 { margin-top: 8px; font-size: 54px; font-weight: 700; letter-spacing: -0.8px; line-height: 1; }
    .until { margin-top: 8px; font-size: 24px; font-weight: 560; color: #8C7468; }
    .board { margin-top: 28px; display: grid; gap: ${gap}px; grid-template-columns: repeat(${size}, ${cell}px); }
    .cell { position: relative; width: ${cell}px; height: ${cell}px; border-radius: ${Math.round(cell * 0.22)}px; border: 2px solid #E5D5C0; display: flex; align-items: center; justify-content: center; background: #fff; }
    .emoji { font-size: ${font}px; line-height: 1; }
    .num { position: absolute; right: ${Math.round(cell * 0.1)}px; bottom: ${Math.round(cell * 0.08)}px; font-size: ${num}px; font-weight: 700; line-height: 1; }
    .dot { position: absolute; left: ${Math.round(cell * 0.1)}px; top: ${Math.round(cell * 0.1)}px; width: ${dot}px; height: ${dot}px; border-radius: 99px; }
    .legend { margin-top: 26px; display: flex; gap: 18px; align-items: center; font-size: 28px; font-weight: 650; }
    .key b { font-weight: 400; }
    .rule { margin-top: 8px; font-size: 22px; font-weight: 560; color: #8C7468; }
  </style></head><body>
    <div class="kicker">Daily grid</div>
    <h1>${escapeHtml(weekday(date))}</h1>
    <div class="until">Same board worldwide · until midnight UTC</div>
    <div class="board">${cells.join('')}</div>
    <div class="legend">${legend}</div>
    <div class="rule">Same sizes can't share a wall</div>
  </body></html>`
}

const sheet = (posts) => {
  const lines = [
    '# Daily grid в X',
    '',
    'Каждый день одна картинка: нерешённая сетка этого UTC-дня. Текст короткий, ссылка только в первом ответе.',
    'Время: 17:00–19:00 МСК. Пропустил день — не догоняй.',
    'Картинки: `promo/out/x-daily/YYYY-MM-DD.png`',
    '',
  ]
  for (const post of posts) {
    lines.push(`## ${post.date} · ${post.weekday} · level ${post.level} · ${post.size}×${post.size}`)
    lines.push(`Медиа: \`promo/out/x-daily/${post.date}.png\``)
    lines.push('```')
    lines.push(post.hook.join('\n'))
    lines.push('```')
    lines.push('Первый ответ:')
    lines.push('```')
    lines.push("Play today's grid → crittermino.vercel.app/daily-challenge")
    lines.push('```')
    lines.push('')
  }
  return lines.join('\n')
}

const main = async () => {
  const count = Number(process.argv[2] ?? 7)
  if (!Number.isInteger(count) || count < 1 || count > 31) throw new Error('Pass a day count from 1 to 31')
  const start = parseStart()
  const startUtc = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 12))
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 })
  const posts = []
  for (let offset = 0; offset < count; offset += 1) {
    const date = addDays(startUtc, offset)
    const number = dailyLevelNumber(date)
    const level = byNumber.get(number)
    if (!level) throw new Error(`Level ${number} missing`)
    const dateKey = utcDateString(date)
    const dayIndex = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - EPOCH_UTC) / MS_PER_DAY)
    await page.setContent(cardHtml(level, date), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(40)
    const file = path.join(OUT, `${dateKey}.png`)
    await page.screenshot({ path: file })
    posts.push({
      date: dateKey,
      weekday: weekday(date),
      level: number,
      size: level.size,
      hook: HOOKS[((dayIndex + 1) % HOOKS.length + HOOKS.length) % HOOKS.length],
      file,
    })
    console.log(dateKey, 'level', number, `${level.size}x${level.size}`)
  }
  await browser.close()
  const markdown = path.join(GROWTH, 'x-daily.md')
  fs.writeFileSync(markdown, sheet(posts))
  console.log('wrote', markdown)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
