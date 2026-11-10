import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.resolve(ROOT, 'promo/cards/x-banner-1500x500.png')
const WIDTH = 1500
const HEIGHT = 500
const CELL = 78
const INSET = 5

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">`

const ANIMALS = {
  M: { glyph: '🐭', size: 2, color: '#D2D8E2', ink: '#3E4856' },
  C: { glyph: '🐱', size: 3, color: '#FFE58A', ink: '#8A6A00' },
  D: { glyph: '🐶', size: 4, color: '#E8CDB0', ink: '#6B4124' },
  P: { glyph: '🐼', size: 5, color: '#C8EBC8', ink: '#1B7A45' },
  L: { glyph: '🦁', size: 6, color: '#FFCDB3', ink: '#C05612' },
}

const SOLVED_BOARD = ['LLLDD', 'LLLDD', 'PPPCM', 'PPCCM']

const GLYPH_CELLS = { L: [0, 1], D: [0, 3], P: [2, 1], C: [3, 3], M: [2, 4] }

const regionAt = (row, col) => SOLVED_BOARD[row]?.[col]

const renderCell = (row, col) => {
  const key = regionAt(row, col)
  const animal = ANIMALS[key]
  const isEdge = {
    top: regionAt(row - 1, col) !== key,
    right: regionAt(row, col + 1) !== key,
    bottom: regionAt(row + 1, col) !== key,
    left: regionAt(row, col - 1) !== key,
  }
  const inset = (side) => (isEdge[side] ? INSET : -1)
  const radius = (a, b) => (isEdge[a] && isEdge[b] ? 26 : 0)
  const [glyphRow, glyphCol] = GLYPH_CELLS[key]
  const content =
    glyphRow === row && glyphCol === col
      ? `<span>${animal.glyph}</span><b style="color:${animal.ink}">${animal.size}</b>`
      : ''
  return `<div class="cell"><div class="fill" style="
    background:${animal.color};
    top:${inset('top')}px; right:${inset('right')}px; bottom:${inset('bottom')}px; left:${inset('left')}px;
    border-radius:${radius('top', 'left')}px ${radius('top', 'right')}px ${radius('bottom', 'right')}px ${radius('bottom', 'left')}px;
  ">${content}</div></div>`
}

const boardCells = SOLVED_BOARD.flatMap((line, row) => [...line].map((_, col) => renderCell(row, col))).join('')

const html = `<!doctype html><html><head><meta charset="utf-8">${FONT}
<style>
  * { margin:0; box-sizing:border-box; }
  body {
    width:${WIDTH}px; height:${HEIGHT}px; overflow:hidden; position:relative;
    background:
      radial-gradient(circle at 8% 0%, #ffe5ec 0%, transparent 40%),
      radial-gradient(circle at 100% 100%, #f6e6d4 0%, transparent 45%),
      #fff9f0;
    font-family:'Fredoka',sans-serif; color:#3D2C29;
  }
  .copy { position:absolute; left:110px; top:96px; }
  .title { font-size:70px; font-weight:700; line-height:1.02; letter-spacing:-1px; }
  .title em { font-style:normal; color:#E84B7F; }
  .chips { display:flex; gap:12px; margin-top:30px; }
  .chip {
    font-size:24px; font-weight:600; padding:10px 20px; border-radius:999px;
    background:#ffffff; box-shadow:0 0 0 2px #E5D5C0;
  }
  .board {
    position:absolute; right:170px; top:50%; transform:translateY(-50%) rotate(-4deg);
    display:grid; grid-template-columns:repeat(5, ${CELL}px); grid-template-rows:repeat(4, ${CELL}px);
    padding:16px; background:#FF8FB8; border-radius:40px;
    box-shadow:0 22px 50px rgba(61,44,41,0.18);
  }
  .cell { position:relative; background:#FF8FB8; }
  .fill { position:absolute; display:flex; align-items:center; justify-content:center; }
  .fill span { font-size:50px; line-height:1; }
  .fill b { position:absolute; right:9px; bottom:3px; font-size:20px; font-weight:700; }
</style></head>
<body>
  <div class="copy">
    <div class="title">Cozy logic puzzles<br>with <em>cute critters</em></div>
    <div class="chips">
      <div class="chip">New daily puzzle</div>
      <div class="chip">Free, no ads</div>
      <div class="chip">Plays in browser</div>
    </div>
  </div>
  <div class="board">${boardCells}</div>
</body></html>`

const run = async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  await page.screenshot({ path: OUT })
  await browser.close()
  console.log(`wrote ${path.relative(ROOT, OUT)} ${WIDTH}x${HEIGHT}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
