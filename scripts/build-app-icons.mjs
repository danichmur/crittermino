import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BG = '#FF8FB8'
const FONT = `<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap" rel="stylesheet">`

const html = (size) => {
  const k = size / 512
  const px = (v) => `${(v * k).toFixed(2)}px`
  return `<!doctype html><html><head><meta charset="utf-8">${FONT}
<style>
  * { margin:0; box-sizing:border-box; }
  body { width:${size}px; height:${size}px; font-family:'Fredoka',sans-serif; }
  .full { width:${size}px; height:${size}px; background:${BG}; padding:${px(30)};
          display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; gap:${px(22)}; }
  .cell { border-radius:${px(70)}; display:flex; align-items:center; justify-content:center; position:relative; }
  .cell span { line-height:1; font-size:${px(150)}; }
  .cell b { position:absolute; right:${px(18)}; bottom:${px(10)}; font-size:${px(40)}; }
</style></head>
<body><div class="full">
  <div class="cell" style="background:#D2D8E2;"><span>🐭</span><b style="color:#3E4856">2</b></div>
  <div class="cell" style="background:#FFE58A;"><span>🐱</span><b style="color:#8A6A00">3</b></div>
  <div class="cell" style="background:#E8CDB0;"><span>🐶</span><b style="color:#6B4124">4</b></div>
  <div class="cell" style="background:#C8EBC8;"><span>🐼</span><b style="color:#1B7A45">5</b></div>
</div></body></html>`
}

const TARGETS = [
  { size: 1024, out: 'promo/icons/icon-1024.png' },
  { size: 512, out: 'app/icon.png' },
  { size: 512, out: 'public/icon-512.png' },
  { size: 192, out: 'public/icon-192.png' },
  { size: 180, out: 'app/apple-icon.png' },
]

const run = async () => {
  const browser = await chromium.launch()
  for (const t of TARGETS) {
    const context = await browser.newContext({ viewport: { width: t.size, height: t.size }, deviceScaleFactor: 1 })
    const p = await context.newPage()
    await p.setContent(html(t.size), { waitUntil: 'networkidle' })
    await p.evaluate(() => document.fonts.ready)
    await p.waitForTimeout(300)
    const abs = path.resolve(ROOT, t.out)
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    await p.screenshot({ path: abs })
    await context.close()
    console.log('wrote', t.out, `${t.size}x${t.size}`)
  }
  await browser.close()
}

run().catch((e) => { console.error(e); process.exit(1) })
