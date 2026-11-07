import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.resolve(ROOT, 'promo/icons')
fs.mkdirSync(OUT, { recursive: true })
const S = 512

const FONT = `<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">`

// Full-bleed mini Fillomino board — the board fills the whole icon, no outer background.
const board = (pad, gap, radius, bg) => `<!doctype html><html><head><meta charset="utf-8">${FONT}
<style>
  * { margin:0; box-sizing:border-box; }
  body { width:${S}px; height:${S}px; font-family:'Fredoka',sans-serif; }
  .full { width:${S}px; height:${S}px; background:${bg}; padding:${pad}px;
          display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; gap:${gap}px; }
  .cell { border-radius:${radius}px; display:flex; align-items:center; justify-content:center; position:relative; }
  .cell span { line-height:1; }
  .cell b { position:absolute; right:18px; bottom:10px; }
</style></head>
<body><div class="full">
  <div class="cell" style="background:#FFD0DC;"><span>🐭</span><b style="color:#A61E4D">2</b></div>
  <div class="cell" style="background:#FFE58A;"><span>🐱</span><b style="color:#8A6A00">3</b></div>
  <div class="cell" style="background:#C4E4FF;"><span>🐶</span><b style="color:#0B5CAD">4</b></div>
  <div class="cell" style="background:#C8EBC8;"><span>🐼</span><b style="color:#1B7A45">5</b></div>
</div></body></html>`

// Pink frame (brand) in two shades — thicker frame like the left variant.
const VARIANTS = {
  'Apink': { pad: 30, gap: 22, radius: 70, font: 150, bg: '#FF6B9D' },
  'Apink-soft': { pad: 30, gap: 22, radius: 70, font: 150, bg: '#FF8FB8' },
}

const run = async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: S, height: S }, deviceScaleFactor: 2 })
  const p = await context.newPage()
  for (const [name, v] of Object.entries(VARIANTS)) {
    const html = board(v.pad, v.gap, v.radius, v.bg).replace('.cell span { line-height:1; }', `.cell span { line-height:1; font-size:${v.font}px; } .cell b { font-size:40px; }`)
    await p.setContent(html, { waitUntil: 'networkidle' })
    await p.evaluate(() => document.fonts.ready)
    await p.waitForTimeout(350)
    await p.screenshot({ path: path.join(OUT, `concept-${name}.png`) })
    console.log('icon', name)
  }

  // Preview sheet: rounded big + 48 + 32 for each full-bleed variant.
  const toUrl = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, f)).toString('base64')
  const card = (name, label) => `<div class="card">
    <div class="tag">${label}</div>
    <img class="big" src="${toUrl(`concept-${name}.png`)}">
    <div class="smalls"><img class="s48" src="${toUrl(`concept-${name}.png`)}"><span>48</span><img class="s32" src="${toUrl(`concept-${name}.png`)}"><span>32</span></div>
  </div>`
  const sheet = `<!doctype html><html><head><meta charset="utf-8">${FONT}
  <style>* { margin:0; box-sizing:border-box; } body { width:1040px; background:#2b2b31; font-family:'Fredoka',sans-serif; padding:48px; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; }
  .card { background:#3a3a42; border-radius:28px; padding:32px; display:flex; flex-direction:column; align-items:center; gap:22px; position:relative; }
  .tag { position:absolute; top:16px; left:20px; color:#fff; font-size:24px; font-weight:600; opacity:0.85; }
  .big { width:240px; height:240px; border-radius:54px; box-shadow:0 16px 40px rgba(0,0,0,0.45); }
  .smalls { display:flex; align-items:center; gap:14px; color:#cfcfd6; font-size:20px; }
  .s48 { width:48px; height:48px; border-radius:11px; } .s32 { width:32px; height:32px; border-radius:8px; margin-left:16px; }
  </style></head><body><div class="grid">${card('Apink', 'Pink frame (brand #FF6B9D)')}${card('Apink-soft', 'Pink frame (soft #FF8FB8)')}</div></body></html>`
  await p.setViewportSize({ width: 1040, height: 760 })
  await p.setContent(sheet, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(350)
  await p.screenshot({ path: path.join(OUT, 'preview-afull.png'), fullPage: true })
  await browser.close()
  console.log('preview ready')
}

run().catch((e) => { console.error(e); process.exit(1) })
