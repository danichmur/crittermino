import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const FONT = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
`

const COPY = {
  en: {
    hookTitle: 'Each critter needs',
    hookAccent: 'a home',
    tag: 'A cozy Fillomino logic puzzle',
    bullets: ['🧠 Pure logic · unique solutions', '🆓 Free · no ads · no login', '📱 Mobile PWA · daily challenge'],
  },
  ru: {
    hookTitle: 'Каждому зверьку —',
    hookAccent: 'свой домик',
    tag: 'Уютный логический пазл (филомино)',
    bullets: ['🧠 Чистая логика · одно решение', '🆓 Бесплатно · без рекламы · без входа', '📱 Мобильный PWA · испытание дня'],
  },
}

const hookHtml = (copy) => `<!doctype html><html><head><meta charset="utf-8">${FONT}
<style>
  * { margin:0; box-sizing:border-box; }
  html,body { background:transparent; }
  body { display:flex; justify-content:center; align-items:flex-start; padding-top:30px; font-family:'Fredoka',sans-serif; }
  .pill { background:#ffffff; border-radius:40px; padding:26px 46px; text-align:center;
          box-shadow:0 18px 50px rgba(61,44,41,0.18); border:3px solid #ffd0dc; }
  .title { font-size:46px; font-weight:700; color:#3D2C29; letter-spacing:-0.5px; }
  .accent { color:#E84B7F; }
  .emojis { margin-top:12px; font-size:48px; letter-spacing:8px; }
</style></head>
<body><div class="pill">
  <div class="title">${copy.hookTitle} <span class="accent">${copy.hookAccent}</span></div>
  <div class="emojis">🐭 🐱 🐶 🐼 🦁</div>
</div></body></html>`

const endHtml = (copy) => `<!doctype html><html><head><meta charset="utf-8">${FONT}
<style>
  * { margin:0; box-sizing:border-box; }
  body { width:1080px; height:1920px; background:#fff9f0; font-family:'Fredoka',sans-serif;
         display:flex; flex-direction:column; justify-content:center; align-items:center; padding:0 90px; }
  .animals { font-size:120px; letter-spacing:10px; margin-bottom:30px; }
  .brand { font-size:120px; font-weight:700; color:#3D2C29; letter-spacing:-1px; line-height:1; }
  .tag { font-size:38px; font-weight:500; color:#8C7468; margin-top:18px; text-align:center; }
  .bullets { margin-top:56px; display:flex; flex-direction:column; gap:26px; width:100%; }
  .b { font-size:42px; font-weight:500; color:#3D2C29; background:#ffffff; border:2px solid #E5D5C0;
       border-radius:28px; padding:22px 40px; box-shadow:0 10px 30px rgba(61,44,41,0.06); text-align:center; }
  .cta { margin-top:70px; background:#FF6B9D; color:#ffffff; font-size:52px; font-weight:700;
         padding:30px 70px; border-radius:999px; box-shadow:0 16px 40px rgba(232,75,127,0.35); }
</style></head>
<body>
  <div class="animals">🐭🐱🐶🐼🦁</div>
  <div class="brand">Crittermino</div>
  <div class="tag">${copy.tag}</div>
  <div class="bullets">
    ${copy.bullets.map((b) => `<div class="b">${b}</div>`).join('\n    ')}
  </div>
  <div class="cta">crittermino.vercel.app</div>
</body></html>`

const run = async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({ deviceScaleFactor: 2 })
  const page = await context.newPage()
  for (const [lang, copy] of Object.entries(COPY)) {
    const out = path.resolve(ROOT, 'promo/cards', lang)
    fs.mkdirSync(out, { recursive: true })
    await page.setViewportSize({ width: 1080, height: 360 })
    await page.setContent(hookHtml(copy), { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(400)
    await page.screenshot({ path: path.join(out, 'hook.png'), omitBackground: true })
    await page.setViewportSize({ width: 1080, height: 1920 })
    await page.setContent(endHtml(copy), { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(400)
    await page.screenshot({ path: path.join(out, 'endcard.png') })
    console.log('cards ready', lang)
  }
  await browser.close()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
