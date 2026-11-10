import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.resolve(ROOT, 'promo/crazygames')

// Noto Color Emoji is OFL-licensed, unlike platform emoji sets, so it is safe on store artwork.
const FONT = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Noto+Color+Emoji&display=swap" rel="stylesheet">
`

const TILES = [
  { emoji: '🐭', size: 2, fill: '#D2D8E2', ink: '#3E4856', rotate: -7 },
  { emoji: '🐱', size: 3, fill: '#FFE58A', ink: '#8A6A00', rotate: 5 },
  { emoji: '🐶', size: 4, fill: '#E8CDB0', ink: '#6B4124', rotate: -4 },
  { emoji: '🐼', size: 5, fill: '#C8EBC8', ink: '#1B7A45', rotate: 6 },
  { emoji: '🦁', size: 6, fill: '#FFCDB3', ink: '#C05612', rotate: -5 },
]

const LAYOUTS = [
  { name: 'landscape', width: 1920, height: 1080, tile: 210, title: 176, direction: 'row', rows: [3, 2] },
  { name: 'portrait', width: 800, height: 1200, tile: 200, title: 132, direction: 'column', rows: [2, 3] },
  { name: 'square', width: 800, height: 800, tile: 150, title: 120, direction: 'column', rows: [3, 2] },
  { name: 'itch', width: 630, height: 500, tile: 100, title: 92, direction: 'column', rows: [3, 2] },
]

const tileHtml = (tile, px) => `
  <div class="tile" style="width:${px}px;height:${px}px;background:${tile.fill};transform:rotate(${tile.rotate}deg)">
    <span class="emoji" style="font-size:${Math.round(px * 0.56)}px">${tile.emoji}</span>
    <span class="num" style="font-size:${Math.round(px * 0.2)}px;color:${tile.ink}">${tile.size}</span>
  </div>`

const boardHtml = (layout) => {
  let index = 0
  return layout.rows
    .map((count) => {
      const row = TILES.slice(index, index + count).map((tile) => tileHtml(tile, layout.tile))
      index += count
      return `<div class="row">${row.join('')}</div>`
    })
    .join('')
}

const coverHtml = (layout) => `<!doctype html><html><head><meta charset="utf-8">${FONT}
<style>
  * { margin:0; box-sizing:border-box; }
  body { width:${layout.width}px; height:${layout.height}px; overflow:hidden; font-family:'Fredoka',sans-serif;
         background:
           radial-gradient(circle at 18% 22%, rgba(255,255,255,0.35) 0%, transparent 38%),
           radial-gradient(circle at 85% 80%, rgba(255,229,236,0.45) 0%, transparent 42%),
           linear-gradient(135deg, #FF9EBE 0%, #FF6B9D 100%);
         display:flex; flex-direction:${layout.direction}; align-items:center; justify-content:center;
         gap:${Math.round(layout.tile * 0.35)}px; padding-bottom:${Math.round(layout.height * 0.06)}px; }
  body::before { content:''; position:absolute; inset:0;
         background-image:radial-gradient(rgba(255,255,255,0.22) 3px, transparent 3.5px);
         background-size:${Math.round(layout.tile * 0.32)}px ${Math.round(layout.tile * 0.32)}px; }
  .title { position:relative; font-size:${layout.title}px; font-weight:700; color:#FFFFFF; letter-spacing:-1px; line-height:1;
           -webkit-text-stroke:${Math.round(layout.title * 0.09)}px #3D2C29; paint-order:stroke fill;
           filter:drop-shadow(0 ${Math.round(layout.title * 0.06)}px 0 rgba(61,44,41,0.35)); }
  .board { position:relative; display:flex; flex-direction:column; align-items:center; gap:${Math.round(layout.tile * 0.12)}px; }
  .row { display:flex; gap:${Math.round(layout.tile * 0.12)}px; }
  .tile { position:relative; border-radius:22%; display:flex; align-items:center; justify-content:center;
          border:${Math.max(4, Math.round(layout.tile * 0.03))}px solid rgba(255,255,255,0.85);
          box-shadow:0 ${Math.round(layout.tile * 0.08)}px ${Math.round(layout.tile * 0.16)}px rgba(61,44,41,0.22); }
  .emoji { font-family:'Noto Color Emoji',sans-serif; line-height:1; }
  .num { position:absolute; right:12%; bottom:8%; font-weight:700; line-height:1; }
</style></head>
<body>
  ${layout.direction === 'row' ? `<div class="title">Crittermino</div><div class="board">${boardHtml(layout)}</div>` : `<div class="board">${boardHtml(layout)}</div><div class="title">Crittermino</div>`}
</body></html>`

const run = async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  for (const layout of LAYOUTS) {
    await page.setViewportSize({ width: layout.width, height: layout.height })
    await page.setContent(coverHtml(layout), { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(400)
    const file = path.join(OUT, `cover-${layout.name}-${layout.width}x${layout.height}.png`)
    await page.screenshot({ path: file })
    console.log('cover ready', file)
  }
  await browser.close()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
