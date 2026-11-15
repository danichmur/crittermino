// Comparison reels in the split-list format: other game vs Crittermino, then a real solve.
// node scripts/compare-reels.mjs
// node scripts/compare-reels.mjs 01

import { spawnSync } from 'node:child_process'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const RAW_ROOT = path.join(ROOT, 'promo/raw/compare')
const OUT_ROOT = path.join(ROOT, 'promo/out/compare')
const VOICE_ROOT = path.join(RAW_ROOT, 'voice')
const CHIP = path.join(ROOT, 'promo/social/cards/url-chip.png')
const MUSIC = path.join(ROOT, 'promo/audio/social-music.wav')
const FONT = fs.readFileSync(
  path.join(ROOT, 'node_modules/@fontsource-variable/fredoka/files/fredoka-latin-wght-normal.woff2'),
).toString('base64')
const SR = 48000
const VOICE = 'Samantha'
const RATE = '152'
const W = 1080
const H = 1920

const CLIPS = [
  {
    id: '01',
    slug: 'other-puzzle',
    left: ['Other', 'puzzle game'],
    leftSay: 'Other puzzle game.',
    right: 'Crittermino',
    rightSay: 'Critter mino.',
    rows: [
      ['Too many ads', 'No ads'],
      ['Needs an account', 'No account'],
      ['Pay to continue', 'Free to play'],
      ['Guess the cell', 'No guessing'],
    ],
    rawId: '01',
    lines: [
      ['A mouse home is 2 cells.', 'A mouse home is two cells.'],
      ['A cat home is 3.', 'A cat home is three.'],
      ['Same sizes stay apart.', 'Same sizes stay apart.'],
    ],
    blurb: 'Other puzzle games ask for an account, an ad, or a guess. Crittermino is free in the browser. Mouse homes are 2 cells, cat homes are 3, and same-size homes cannot share a wall.',
  },
  {
    id: '02',
    slug: 'other-sudoku',
    left: ['Other', 'sudoku'],
    leftSay: 'Other sudoku.',
    right: 'Crittermino',
    rightSay: 'Critter mino.',
    rows: [
      ['Only numbers', 'Five animals'],
      ['Check the rows', 'Connected homes'],
      ['Guess a digit', 'No guessing'],
      ['Same old boxes', 'Homes can bend'],
    ],
    rawId: '07',
    lines: [
      ['Rows are not the rule.', 'Rows are not the rule.'],
      ['Homes have to connect.', 'Homes have to connect.'],
      ['One solution. No guessing.', 'One solution. No guessing.'],
    ],
    blurb: 'Not another number grid. Five animals, connected homes, one solution. A home can bend. It cannot split, and same sizes stay apart.',
  },
  {
    id: '03',
    slug: 'other-brain-game',
    left: ['Other', 'brain game'],
    leftSay: 'Other brain game.',
    right: 'Crittermino',
    rightSay: 'Critter mino.',
    rows: [
      ['Ads every level', 'No ads'],
      ['Make an account', 'No account'],
      ['Pay to skip', 'Always free'],
      ['Download first', 'In the browser'],
    ],
    rawId: '06',
    lines: [
      ['Each home closes itself.', 'Each home closes itself.'],
      ['Right size. One piece.', 'Right size. One piece.'],
      ['Then the next home starts.', 'Then the next home starts.'],
    ],
    blurb: 'No ads, no account, no download. Each animal home closes when it is the right size and still in one piece. Then the next one starts.',
  },
]

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const fontFace = `@font-face{font-family:Fredoka;src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:400 700;font-display:block;}`

const run = (cmd, args, opts = {}) => {
  const result = spawnSync(cmd, args, { encoding: 'utf8', ...opts })
  if (result.status !== 0) {
    const detail = `${result.stderr ?? ''}\n${result.stdout ?? ''}`.trim()
    throw new Error(`${cmd} failed\n${detail}`)
  }
  return result
}

const probeDuration = (file) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }).trim())

const voicePath = (text) => {
  const hash = crypto.createHash('sha1').update(`${VOICE}|${RATE}|${text}`).digest('hex').slice(0, 12)
  return path.join(VOICE_ROOT, `${hash}.wav`)
}

const ensureVoice = (text) => {
  const file = voicePath(text)
  if (!fs.existsSync(file)) {
    fs.mkdirSync(VOICE_ROOT, { recursive: true })
    const aiff = file.replace(/\.wav$/, '.aiff')
    execFileSync('say', ['-v', VOICE, '-r', RATE, '-o', aiff, text])
    execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', aiff, '-ac', '2', '-ar', String(SR), file])
    fs.rmSync(aiff, { force: true })
  }
  return { file, duration: probeDuration(file) }
}

const placeLines = (items, startAt) => {
  let cursor = startAt
  return items.map((item) => {
    const voice = ensureVoice(item.say)
    const placed = { ...item, say: item.say, file: voice.file, duration: voice.duration, start: cursor }
    cursor += voice.duration + item.gap
    return placed
  })
}

const buildScript = (clip) => {
  const introItems = [
    { kind: 'left', say: clip.leftSay, gap: 0.28 },
    { kind: 'right', say: clip.rightSay, gap: 0.42 },
    ...clip.rows.flatMap(([bad, good]) => [
      { kind: 'bad', text: bad, say: `${bad}.`, gap: 0.06 },
      { kind: 'good', text: good, say: `${good}.`, gap: 0.36 },
    ]),
  ]
  const intro = placeLines(introItems, 0.45)
  const introDur = intro[intro.length - 1].start + intro[intro.length - 1].duration + 0.55
  const events = JSON.parse(fs.readFileSync(path.join(ROOT, 'promo/raw/social', clip.rawId, 'events.json'), 'utf8'))
  const first = events.events[0]
  const win = events.events.find((event) => event.type === 'win')
  const rawStart = Math.max(0.2, first.t - 0.65)
  const rawEnd = win.t + 1.45
  const rawLen = rawEnd - rawStart
  const spoken = clip.lines.map(([text, say]) => ensureVoice(say).duration)
  const slots = spoken.map((duration) => Math.max(rawLen / spoken.length, duration + 0.25))
  const section = slots.reduce((sum, slot) => sum + slot, 0)
  const speed = rawLen / section
  let cursor = 0
  const lines = clip.lines.map(([text, say], index) => {
    const voice = ensureVoice(say)
    const placed = { text, say, file: voice.file, duration: voice.duration, start: cursor }
    cursor += slots[index]
    return placed
  })
  const ctaVoice = ensureVoice('Play free.')
  const endDur = Math.max(3.15, ctaVoice.duration + 1.45)
  return { intro, introDur, rawStart, rawEnd, speed, section, lines, slots, cta: { ...ctaVoice, start: introDur + section }, endDur, events: events.events }
}

const rowFont = (rows) => {
  const longest = Math.max(...rows.flat().map((line) => line.length))
  if (longest >= 17) return 34
  if (longest >= 15) return 38
  return 42
}

const introHtml = (clip, script) => {
  const badAt = script.intro.filter((item) => item.kind === 'bad')
  const goodAt = script.intro.filter((item) => item.kind === 'good')
  const leftAt = Math.max(0, script.intro[0].start - 0.28)
  const rightAt = Math.max(0, script.intro[1].start - 0.16)
  const row = (text, at, tone) => `<div class="row reveal" style="--at:${at.toFixed(2)}s">
    ${tone === 'good' ? '<span class="mark good">✓</span>' : ''}
    <span class="label">${escapeHtml(text)}</span>
    ${tone === 'bad' ? '<span class="mark bad">✕</span>' : ''}
  </div>`
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
    ${fontFace}
    * { margin: 0; box-sizing: border-box; }
    html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #000; font-family: Fredoka, "Avenir Next", sans-serif; }
    .stage { opacity: 0; position: absolute; inset: 0; background: #FFF8F1; }
    body.go .stage { opacity: 1; }
    .bar { position: absolute; top: 128px; bottom: 230px; left: 50%; width: 22px; transform: translateX(-50%); border-radius: 999px; background: linear-gradient(180deg, #F7A8C4, #F6C56B 42%, #8FD6A0 72%, #7EC8E3); }
    .title { position: absolute; top: 138px; width: 50%; height: 230px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 68px; font-weight: 700; line-height: 0.98; letter-spacing: -0.8px; }
    .title.left { left: 0; color: #C23B4A; }
    .title.right { right: 0; color: #1E8E46; }
    .spark { color: #F0B429; font-size: 36px; letter-spacing: 10px; margin-bottom: 6px; }
    .col { position: absolute; top: 430px; bottom: 300px; width: 50%; display: flex; flex-direction: column; justify-content: space-evenly; padding: 0 28px; }
    .col.left { left: 0; }
    .col.right { right: 0; }
    .row { display: flex; align-items: center; justify-content: center; gap: 14px; }
    .label { font-size: ${rowFont(clip.rows)}px; font-weight: 700; line-height: 1.05; letter-spacing: -0.3px; }
    .col.left .label { color: #C23B4A; }
    .col.right .label { color: #1E8E46; }
    .mark { width: 64px; height: 64px; flex: none; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 700; }
    .mark.bad { background: #FDE8E8; color: #D64545; }
    .mark.good { background: #E5F6EA; color: #1E8E46; }
    .mascots { position: absolute; left: 0; right: 0; bottom: 78px; display: flex; justify-content: center; gap: 36px; font-size: 104px; }
    .reveal { opacity: 0; transform: translateY(18px); }
    body.go .reveal { animation: pop 0.42s ease forwards; animation-delay: var(--at); }
    @keyframes pop { to { opacity: 1; transform: none; } }
  </style></head><body><div class="stage">
    <div class="bar"></div>
    <div class="title left reveal" style="--at:${leftAt.toFixed(2)}s">${clip.left.map((line) => `<div>${escapeHtml(line)}</div>`).join('')}</div>
    <div class="title right reveal" style="--at:${rightAt.toFixed(2)}s"><div class="spark">✦ ✦</div><div>${escapeHtml(clip.right)}</div></div>
    <div class="col left">${badAt.map((item) => row(item.text, Math.max(0, item.start - 0.08), 'bad')).join('')}</div>
    <div class="col right">${goodAt.map((item) => row(item.text, Math.max(0, item.start - 0.08), 'good')).join('')}</div>
    <div class="mascots"><span>🐭</span><span>🐱</span><span>🐶</span></div>
  </div></body></html>`
}

const captionHtml = (text) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
  ${fontFace}
  * { margin: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: 220px; background: transparent; font-family: Fredoka, "Avenir Next", sans-serif; }
  body { display: flex; justify-content: center; align-items: flex-start; }
  .pill { max-width: 920px; background: #fff; border: 4px solid #ffd0dc; border-radius: 36px; padding: 22px 36px; text-align: center; font-size: 46px; font-weight: 700; color: #3D2C29; line-height: 1.08; box-shadow: 0 18px 50px rgba(61,44,41,0.18); }
</style></head><body><div class="pill">${escapeHtml(text)}</div></body></html>`

const endHtml = () => `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
  ${fontFace}
  * { margin: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; background: #FFF9F0; font-family: Fredoka, "Avenir Next", sans-serif; }
  body { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .animals { font-size: 92px; letter-spacing: 8px; }
  h1 { margin-top: 28px; font-size: 108px; font-weight: 700; color: #3D2C29; letter-spacing: -1.5px; }
  .url { margin-top: 28px; background: #FF6B9D; color: #fff; border-radius: 999px; padding: 22px 40px; font-size: 42px; font-weight: 700; box-shadow: 0 8px 0 #E84B7F; }
  .sub { margin-top: 28px; font-size: 36px; font-weight: 650; color: #8C7468; }
</style></head><body>
  <div class="animals">🐭🐱🐶🐼🦁</div>
  <h1>Play free</h1>
  <div class="url">crittermino.vercel.app</div>
  <div class="sub">No ads. No account.</div>
</body></html>`

const findContentStart = (file) => {
  const result = run('ffmpeg', ['-hide_banner', '-i', file, '-vf', 'blackframe=amount=90:threshold=16', '-an', '-f', 'null', '-'])
  const times = [...`${result.stderr}`.matchAll(/ t:([0-9.]+)/g)].map((match) => Number(match[1]))
  if (times.length === 0) return 0
  return Math.max(...times) + 1 / 30
}

const recordIntro = async (browser, clip, script) => {
  const dir = path.join(RAW_ROOT, clip.id)
  fs.mkdirSync(dir, { recursive: true })
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
    recordVideo: { dir, size: { width: W, height: H } },
  })
  const page = await context.newPage()
  await page.setContent('<style>html,body{margin:0;background:#000;height:100%}</style><body></body>')
  await page.waitForTimeout(350)
  await page.setContent(introHtml(clip, script), { waitUntil: 'load' })
  await page.evaluate(async () => {
    await document.fonts.ready
    document.body.classList.add('go')
  })
  await page.waitForTimeout(Math.ceil(script.introDur * 1000) + 700)
  const video = page.video()
  await page.close()
  const target = path.join(dir, 'intro.webm')
  await video.saveAs(target)
  await context.close()
  return target
}

const renderStills = async (browser, clip, script) => {
  const dir = path.join(RAW_ROOT, clip.id)
  fs.mkdirSync(dir, { recursive: true })
  const page = await browser.newPage({ viewport: { width: W, height: 220 }, deviceScaleFactor: 1 })
  const captions = []
  for (let index = 0; index < script.lines.length; index += 1) {
    const line = script.lines[index]
    await page.setContent(captionHtml(line.text), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(80)
    const file = path.join(dir, `cap-${index}.png`)
    await page.locator('.pill').screenshot({ path: file, omitBackground: true })
    captions.push(file)
  }
  await page.setViewportSize({ width: W, height: H })
  await page.setContent(endHtml(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(80)
  const end = path.join(dir, 'end.png')
  await page.screenshot({ path: end })
  await page.close()
  return { captions, end }
}

const buildSfx = (script, file) => {
  const tap = [{ f: 740, d: 0.05, g: 0.55 }]
  const complete = [
    { f: 523.25, d: 0.11, g: 0.48, o: 0 },
    { f: 659.25, d: 0.12, g: 0.48, o: 0.08 },
    { f: 783.99, d: 0.16, g: 0.48, o: 0.16 },
  ]
  const win = [
    { f: 523.25, d: 0.13, g: 0.55, o: 0 },
    { f: 659.25, d: 0.13, g: 0.55, o: 0.12 },
    { f: 783.99, d: 0.13, g: 0.55, o: 0.24 },
    { f: 1046.5, d: 0.28, g: 0.58, o: 0.36 },
  ]
  const notes = []
  for (const event of script.events) {
    if (event.t < script.rawStart || event.t > script.rawEnd) continue
    const at = (event.t - script.rawStart) / script.speed
    const set = event.type === 'win' ? win : event.type === 'complete' ? complete : tap
    for (const note of set) notes.push({ ...note, start: at + (note.o ?? 0) })
  }
  if (notes.length === 0) notes.push({ f: 740, d: 0.05, g: 0.01, start: 0 })
  const inputs = []
  const filters = []
  const labels = []
  notes.forEach((note, index) => {
    inputs.push('-f', 'lavfi', '-i', `sine=frequency=${note.f}:duration=${note.d}:sample_rate=${SR}`)
    const delay = Math.max(0, Math.round(note.start * 1000))
    filters.push(`[${index}:a]volume=${note.g},afade=t=out:st=0:d=${note.d}:curve=exp,adelay=${delay}|${delay}[a${index}]`)
    labels.push(`[a${index}]`)
  })
  const silent = notes.length
  inputs.push('-f', 'lavfi', '-i', `anullsrc=r=${SR}:cl=stereo`)
  filters.push(`[${silent}:a]atrim=0:${script.section.toFixed(3)},aformat=channel_layouts=stereo[sil]`)
  labels.push('[sil]')
  const graph = `${filters.join(';')};${labels.join('')}amix=inputs=${labels.length}:duration=longest:normalize=0[out]`
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...inputs, '-filter_complex', graph, '-map', '[out]', '-t', script.section.toFixed(3), '-ac', '2', file])
}

const buildMix = (clip, script, sfxFile, file) => {
  const voices = [
    ...script.intro.map((item) => ({ file: item.file, start: item.start })),
    ...script.lines.map((item) => ({ file: item.file, start: script.introDur + item.start })),
    { file: script.cta.file, start: script.cta.start },
  ]
  const total = script.introDur + script.section + script.endDur
  const inputs = []
  voices.forEach((voice) => inputs.push('-i', voice.file))
  inputs.push('-stream_loop', '-1', '-i', MUSIC, '-i', sfxFile)
  const filters = []
  const labels = []
  voices.forEach((voice, index) => {
    const delay = Math.max(0, Math.round(voice.start * 1000))
    filters.push(`[${index}:a]aformat=channel_layouts=stereo,adelay=${delay}|${delay},volume=1.25[v${index}]`)
    labels.push(`[v${index}]`)
  })
  const musicIndex = voices.length
  const sfxIndex = voices.length + 1
  const fadeOut = Math.max(0.2, total - 0.45)
  const sfxDelay = Math.round(script.introDur * 1000)
  filters.push(`[${musicIndex}:a]aformat=channel_layouts=stereo,atrim=0:${total.toFixed(3)},volume=0.16,afade=t=in:st=0:d=0.25,afade=t=out:st=${fadeOut.toFixed(3)}:d=0.4[m]`)
  filters.push(`[${sfxIndex}:a]aformat=channel_layouts=stereo,adelay=${sfxDelay}|${sfxDelay},volume=0.85[s]`)
  labels.push('[m]', '[s]')
  const graph = `${filters.join(';')};${labels.join('')}amix=inputs=${labels.length}:duration=longest:normalize=0,alimiter=limit=0.95,atrim=0:${total.toFixed(3)}[out]`
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...inputs, '-filter_complex', graph, '-map', '[out]', '-t', total.toFixed(3), '-ac', '2', '-ar', String(SR), file])
  return total
}

const compose = (clip, script, introFile, stills, mixFile) => {
  const lead = findContentStart(introFile)
  const introDur = script.introDur
  const recorded = probeDuration(introFile)
  if (lead + introDur > recorded - 0.05) {
    throw new Error(`${clip.id} intro is short: lead ${lead.toFixed(2)} dur ${recorded.toFixed(2)} need ${introDur.toFixed(2)}`)
  }
  const raw = path.join(ROOT, 'promo/raw/social', clip.rawId, 'gameplay.webm')
  const outfile = path.join(OUT_ROOT, `${clip.id}-${clip.slug}.mp4`)
  const cover = path.join(OUT_ROOT, `${clip.id}-${clip.slug}.jpg`)
  fs.mkdirSync(OUT_ROOT, { recursive: true })
  const filters = [
    `[0:v]trim=${lead.toFixed(3)}:${(lead + introDur).toFixed(3)},setpts=PTS-STARTPTS,fps=30,scale=${W}:${H}:flags=lanczos,setsar=1,format=yuv420p[intro]`,
    `[1:v]trim=${script.rawStart.toFixed(3)}:${script.rawEnd.toFixed(3)},setpts=(PTS-STARTPTS)/${script.speed.toFixed(4)},fps=30,scale=${W}:${H}:flags=lanczos,setsar=1,format=yuv420p[gp0]`,
    `[2:v]scale=${W}:${H},fps=30,format=yuv420p,trim=0:${script.endDur.toFixed(3)},setpts=PTS-STARTPTS[end]`,
    `[${3 + stills.captions.length}:v]format=rgba[chip]`,
  ]
  let current = 'gp0'
  filters.push(`[${current}][chip]overlay=x=(W-w)/2:y=128:format=auto[gpchip]`)
  current = 'gpchip'
  stills.captions.forEach((caption, index) => {
    const start = script.lines[index].start
    const end = index === stills.captions.length - 1 ? script.section : script.lines[index + 1].start
    filters.push(`[${3 + index}:v]format=rgba[cap${index}]`)
    const next = `gp${index + 1}`
    filters.push(`[${current}][cap${index}]overlay=x=(W-w)/2:y=250:enable='between(t,${start.toFixed(3)},${end.toFixed(3)})':format=auto[${next}]`)
    current = next
  })
  filters.push(`[${current}]format=yuv420p[gp]`)
  filters.push(`[intro][gp][end]concat=n=3:v=1:a=0[vout]`)
  const args = [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-i', introFile,
    '-i', raw,
    '-loop', '1', '-framerate', '30', '-t', script.endDur.toFixed(3), '-i', stills.end,
  ]
  for (const caption of stills.captions) args.push('-loop', '1', '-framerate', '30', '-t', script.section.toFixed(3), '-i', caption)
  args.push('-i', CHIP, '-i', mixFile, '-filter_complex', filters.join(';'), '-map', '[vout]', '-map', `${4 + stills.captions.length}:a`)
  args.push(
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart',
    '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-ar', String(SR),
    '-t', (script.introDur + script.section + script.endDur).toFixed(3),
    '-metadata', `title=Crittermino ${clip.left.join(' ')}`,
    '-metadata', 'comment=https://crittermino.vercel.app',
    outfile,
  )
  execFileSync('ffmpeg', args, { stdio: 'inherit' })
  const coverAt = Math.max(0.4, script.introDur - 0.4)
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', coverAt.toFixed(2), '-i', outfile, '-frames:v', '1', '-q:v', '3', cover])
  return { outfile, cover, duration: probeDuration(outfile) }
}

const writeSheet = (made) => {
  const lines = [
    '3 вертикальных рекламы 1080×1920, в формате сравнения как у ролика Zoodoku.',
    'Слева типичная чужая головоломка, справа Crittermino, потом живой уровень.',
    'На экране и в голосе английский. Голос — Samantha, текст на экране можно смотреть без звука.',
    'Ссылка: https://crittermino.vercel.app',
    'Не обещаем офлайн и «10 000 уровней». Справа только то, что игра реально делает: без рекламы, без аккаунта, бесплатно в браузере, без угадывания.',
    '',
  ]
  for (const clip of CLIPS) {
    const item = made.find((entry) => entry.id === clip.id)
    lines.push(`${clip.id}. ${clip.id}-${clip.slug}.mp4 · ${item ? `${item.duration.toFixed(1)} с` : ''}`)
    lines.push(`Слева: ${clip.left.join(' ')}`)
    for (const [bad, good] of clip.rows) lines.push(`  ${bad}  →  ${good}`)
    lines.push(`На поле: ${clip.lines.map(([text]) => text).join(' / ')}`)
    lines.push(clip.blurb)
    lines.push('Play free. Link in bio.')
    lines.push('#crittermino #logicpuzzle #puzzlegame #nobrainer #freegame')
    lines.push('')
  }
  fs.writeFileSync(path.join(OUT_ROOT, 'captions.txt'), lines.join('\n'))
}

const selectedClips = () => {
  const wanted = process.argv.slice(2)
  if (wanted.length === 0) return CLIPS
  const clips = CLIPS.filter((clip) => wanted.includes(clip.id) || wanted.includes(clip.slug))
  if (clips.length !== wanted.length) throw new Error(`Unknown clip id in: ${wanted.join(', ')}`)
  return clips
}

const main = async () => {
  if (!fs.existsSync(CHIP)) throw new Error('Missing promo/social/cards/url-chip.png')
  if (!fs.existsSync(MUSIC)) throw new Error('Missing promo/audio/social-music.wav')
  const clips = selectedClips()
  const plans = clips.map((clip) => ({ clip, script: buildScript(clip) }))
  const browser = await chromium.launch()
  const ready = []
  for (const plan of plans) {
    console.log('record', plan.clip.id, `intro ${plan.script.introDur.toFixed(1)}s`, `play ${plan.script.section.toFixed(1)}s`)
    const stills = await renderStills(browser, plan.clip, plan.script)
    const introFile = await recordIntro(browser, plan.clip, plan.script)
    ready.push({ ...plan, stills, introFile })
  }
  await browser.close()
  const made = []
  for (const plan of ready) {
    const dir = path.join(RAW_ROOT, plan.clip.id)
    const sfxFile = path.join(dir, 'sfx.wav')
    const mixFile = path.join(dir, 'mix.wav')
    buildSfx(plan.script, sfxFile)
    buildMix(plan.clip, plan.script, sfxFile, mixFile)
    const result = compose(plan.clip, plan.script, plan.introFile, plan.stills, mixFile)
    console.log('built', path.basename(result.outfile), `${result.duration.toFixed(1)}s`)
    made.push({ id: plan.clip.id, ...result })
  }
  if (clips.length === CLIPS.length) writeSheet(made)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
