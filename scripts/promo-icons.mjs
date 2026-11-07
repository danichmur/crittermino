import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.resolve(ROOT, 'promo/icons')
fs.mkdirSync(OUT, { recursive: true })
const S = 512

const FONT = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">
`

const page = (body, extra = '') => `<!doctype html><html><head><meta charset="utf-8">${FONT}
<style>
  * { margin:0; box-sizing:border-box; }
  body { width:${S}px; height:${S}px; font-family:'Fredoka',sans-serif; overflow:hidden; }
  .ic { width:${S}px; height:${S}px; display:flex; align-items:center; justify-content:center; position:relative; }
  ${extra}
</style></head><body>${body}</body></html>`

// A — mini Fillomino board (the clearest "animal puzzle" statement)
const A = page(
  `<div class="ic" style="background:linear-gradient(145deg,#FF6B9D,#FF9EC4);">
     <div class="board">
       <div class="cell" style="background:#FFD0DC;border-color:#FF6B9D;"><span>🐭</span><b style="color:#A61E4D">2</b></div>
       <div class="cell" style="background:#FFE58A;border-color:#E6B325;"><span>🐱</span><b style="color:#8A6A00">3</b></div>
       <div class="cell" style="background:#C4E4FF;border-color:#4DA3FF;"><span>🐶</span><b style="color:#0B5CAD">4</b></div>
       <div class="cell" style="background:#C8EBC8;border-color:#3CB371;"><span>🐼</span><b style="color:#1B7A45">5</b></div>
     </div>
   </div>`,
  `.board { width:340px; height:340px; background:#E5D5C0; border-radius:64px; padding:20px;
            display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; gap:16px;
            box-shadow:0 24px 50px rgba(61,44,41,0.28); }
   .cell { border-radius:40px; border:5px solid; display:flex; align-items:center; justify-content:center; position:relative; }
   .cell span { font-size:104px; line-height:1; }
   .cell b { position:absolute; right:14px; bottom:8px; font-size:34px; }`,
)

// B — single cozy home with the mascot mouse
const B = page(
  `<div class="ic" style="background:linear-gradient(145deg,#FF6B9D,#FFB0CE);">
     <div class="home"><span>🐭</span><b>2</b></div>
   </div>`,
  `.home { width:330px; height:330px; background:#FFFFFF; border:12px solid #FFD0DC; border-radius:84px;
           display:flex; align-items:center; justify-content:center; position:relative;
           box-shadow:0 24px 50px rgba(61,44,41,0.28); }
   .home span { font-size:200px; line-height:1; }
   .home b { position:absolute; right:34px; bottom:24px; font-size:60px; color:#A61E4D; }`,
)

// C — critter on a faint grid (playful, scales small)
const C = page(
  `<div class="ic" style="background:linear-gradient(145deg,#FF6B9D,#FF8FB8);">
     <div class="grid"></div>
     <span class="cat">🐱</span>
   </div>`,
  `.grid { position:absolute; inset:96px; border-radius:48px;
           background-image:linear-gradient(#ffffff55 6px,transparent 6px),linear-gradient(90deg,#ffffff55 6px,transparent 6px);
           background-size:106px 106px; background-position:center; opacity:0.6; }
   .cat { font-size:290px; line-height:1; filter:drop-shadow(0 18px 24px rgba(61,44,41,0.3)); position:relative; }`,
)

// D — Fredoka monogram with a peeking critter
const D = page(
  `<div class="ic" style="background:#fff9f0;">
     <div class="tile"><div class="c">C</div><span class="m">🐭</span></div>
   </div>`,
  `.tile { width:360px; height:360px; background:linear-gradient(145deg,#FF6B9D,#FF9EC4); border-radius:92px;
           display:flex; align-items:center; justify-content:center; position:relative;
           box-shadow:0 24px 50px rgba(232,75,127,0.35); }
   .c { font-size:260px; font-weight:700; color:#ffffff; line-height:1; margin-top:-10px; }
   .m { position:absolute; right:30px; bottom:22px; font-size:96px; }`,
)

const CONCEPTS = { A, B, C, D }

const run = async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: S, height: S }, deviceScaleFactor: 2 })
  const p = await context.newPage()
  for (const [name, html] of Object.entries(CONCEPTS)) {
    await p.setContent(html, { waitUntil: 'networkidle' })
    await p.evaluate(() => document.fonts.ready)
    await p.waitForTimeout(350)
    await p.screenshot({ path: path.join(OUT, `concept-${name}.png`) })
    console.log('icon', name)
  }
  await browser.close()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
