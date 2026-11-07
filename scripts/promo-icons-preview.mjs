import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ICONS = path.resolve(ROOT, 'promo/icons')
const names = ['A', 'B', 'C', 'D']
const toUrl = (p) => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64')

const card = (name) => {
  const src = toUrl(path.join(ICONS, `concept-${name}.png`))
  return `<div class="card">
    <div class="tag">${name}</div>
    <img class="big" src="${src}">
    <div class="smalls">
      <img class="s48" src="${src}"><span>48</span>
      <img class="s32" src="${src}"><span>32</span>
    </div>
  </div>`
}

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; box-sizing:border-box; }
  body { width:1200px; background:#2b2b31; font-family:'Fredoka',sans-serif; padding:48px; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; }
  .card { background:#3a3a42; border-radius:28px; padding:32px; display:flex; flex-direction:column; align-items:center; gap:22px; position:relative; }
  .tag { position:absolute; top:18px; left:22px; color:#fff; font-size:30px; font-weight:700; opacity:0.85; }
  .big { width:240px; height:240px; border-radius:54px; box-shadow:0 16px 40px rgba(0,0,0,0.45); }
  .smalls { display:flex; align-items:center; gap:14px; color:#cfcfd6; font-size:20px; }
  .s48 { width:48px; height:48px; border-radius:11px; }
  .s32 { width:32px; height:32px; border-radius:8px; margin-left:16px; }
</style></head>
<body><div class="grid">${names.map(card).join('')}</div></body></html>`

const run = async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 })
  const p = await context.newPage()
  await p.setContent(html, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(400)
  await p.screenshot({ path: path.join(ICONS, 'preview-all.png'), fullPage: true })
  await browser.close()
  console.log('preview ready')
}

run().catch((e) => { console.error(e); process.exit(1) })
