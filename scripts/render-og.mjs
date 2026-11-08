import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.resolve(ROOT, 'public/og-image.png')

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap" rel="stylesheet">`

const html = `<!doctype html><html><head><meta charset="utf-8">${FONT}
<style>
  * { margin:0; box-sizing:border-box; }
  body {
    width:1200px; height:630px;
    display:flex; align-items:center; justify-content:center; gap:56px;
    background:
      radial-gradient(circle at 0% 0%, #ffe5ec 0%, transparent 38%),
      radial-gradient(circle at 100% 100%, #e5f4ff 0%, transparent 34%),
      #fff9f0;
    font-family:'Fredoka',sans-serif;
  }
  .mark {
    width:340px; height:340px; border-radius:76px; overflow:hidden; flex:none;
    box-shadow:0 18px 40px rgba(61,44,41,0.14);
  }
  .grid {
    width:340px; height:340px; background:#FF8FB8; padding:20px;
    display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; gap:14px;
  }
  .cell { border-radius:46px; display:flex; align-items:center; justify-content:center; position:relative; }
  .cell span { font-size:100px; line-height:1; }
  .cell b { position:absolute; right:12px; bottom:6px; font-size:28px; font-weight:700; }
  .name {
    font-size:92px; font-weight:700; line-height:0.95; letter-spacing:-1.5px; color:#3D2C29;
  }
</style></head>
<body>
  <div class="mark"><div class="grid">
    <div class="cell" style="background:#FFD0DC;"><span>🐭</span><b style="color:#A61E4D">2</b></div>
    <div class="cell" style="background:#FFE58A;"><span>🐱</span><b style="color:#8A6A00">3</b></div>
    <div class="cell" style="background:#C4E4FF;"><span>🐶</span><b style="color:#0B5CAD">4</b></div>
    <div class="cell" style="background:#C8EBC8;"><span>🐼</span><b style="color:#1B7A45">5</b></div>
  </div></div>
  <div class="name">Crittermino</div>
</body></html>`

const run = async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  await page.screenshot({ path: OUT })
  await browser.close()
  console.log('wrote public/og-image.png 1200x630')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
