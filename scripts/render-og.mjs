import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.resolve(ROOT, 'public/og-image.png')
const ICON = fs.readFileSync(path.resolve(ROOT, 'app/icon.png')).toString('base64')

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
      radial-gradient(circle at 100% 100%, #f6e6d4 0%, transparent 34%),
      #fff9f0;
    font-family:'Fredoka',sans-serif;
  }
  .mark {
    width:340px; height:340px; border-radius:76px; object-fit:cover; flex:none;
    box-shadow:0 18px 40px rgba(61,44,41,0.14);
  }
  .name {
    font-size:92px; font-weight:700; line-height:0.95; letter-spacing:-1.5px; color:#3D2C29;
  }
</style></head>
<body>
  <img class="mark" alt="" src="data:image/png;base64,${ICON}" />
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
