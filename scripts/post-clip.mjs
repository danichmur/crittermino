// One clip, three posts. Each platform gets its own text from captions.txt.
// A failure on one site does not cancel the other two.
//
// node scripts/post-clip.mjs login
// node scripts/post-clip.mjs check
// node scripts/post-clip.mjs fails 01
// node scripts/post-clip.mjs fails 04 --platform instagram
// node scripts/post-clip.mjs social 07 --dry-run
// node scripts/post-clip.mjs think 02 --platform tiktok
// node scripts/post-clip.mjs lesson 02 --dry-run
// node scripts/post-clip.mjs fails 01 --again

import { execFileSync, spawn } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PROMO = path.resolve(ROOT, '../crittermino-growth/promo')
const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const CHROME_DIR = path.join(os.homedir(), 'Library/Application Support/Google/Chrome')
const DEBUG_DIR = path.join(os.homedir(), '.crittermino-chrome')
const CDP_PORT = 9222
const CHROME_EPOCH_SECONDS = 11644473600
const SESSION_HOSTS = ['google.com', 'youtube.com', 'tiktok.com', 'instagram.com', 'facebook.com']
const LOG_PATH = path.join(PROMO, 'out/posted.jsonl')
const ERROR_DIR = path.join(PROMO, 'out/post-errors')
const SETS = ['fails', 'think', 'compare', 'social', 'lesson']
const PLATFORMS = ['youtube', 'tiktok', 'instagram']
const SECTION_HEADERS = ['Shorts — название', 'Shorts — описание', 'TikTok', 'Reels']
const TITLE_LIMIT = 100

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const readArgs = () => {
  const flags = new Set()
  const only = new Set(PLATFORMS)
  const words = []
  const argv = process.argv.slice(2)
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--dry-run' || arg === '--again') {
      flags.add(arg)
      continue
    }
    if (arg === '--only' || arg === '--platform') {
      const value = argv[index + 1] ?? ''
      index += 1
      const picked = value.split(',').map((item) => item.trim()).filter(Boolean)
      const unknown = picked.filter((item) => !PLATFORMS.includes(item))
      if (picked.length === 0 || unknown.length > 0) throw new Error(`--platform expects ${PLATFORMS.join(', ')}`)
      only.clear()
      picked.forEach((item) => only.add(item))
      continue
    }
    words.push(arg)
  }
  return { flags, only, words }
}

const parseSheet = (setName) => {
  const sheetPath = path.join(PROMO, 'out', setName, 'captions.txt')
  if (!fs.existsSync(sheetPath)) throw new Error(`Missing ${sheetPath}`)
  const blocks = fs.readFileSync(sheetPath, 'utf8').split(/^(?=\d{2}\. )/m)
  const clips = []
  for (const block of blocks) {
    const header = block.match(/^(\d{2})\. (\S+)/)
    if (!header) continue
    const sections = {}
    let current = ''
    for (const line of block.split('\n').slice(1)) {
      if (SECTION_HEADERS.includes(line.trim())) {
        current = line.trim()
        sections[current] = []
        continue
      }
      if (current) sections[current].push(line)
    }
    const text = (name) => (sections[name] ?? []).join('\n').trim()
    const missing = SECTION_HEADERS.filter((name) => !text(name))
    if (missing.length > 0) throw new Error(`${setName} ${header[1]} is missing ${missing.join(', ')}`)
    const title = text('Shorts — название').split('\n')[0].trim()
    if (title.length > TITLE_LIMIT) throw new Error(`${setName} ${header[1]} title is ${title.length} characters`)
    clips.push({
      id: header[1],
      fileName: header[2],
      filePath: path.join(PROMO, 'out', setName, header[2]),
      title,
      youtube: text('Shorts — описание'),
      tiktok: text('TikTok'),
      instagram: text('Reels'),
    })
  }
  if (clips.length === 0) throw new Error(`No clips in ${sheetPath}`)
  return clips
}

const findClip = (setName, query) => {
  const clips = parseSheet(setName)
  const clip = clips.find((item) => item.id === query || item.fileName === query || item.fileName.includes(query))
  if (!clip) throw new Error(`No clip "${query}" in ${setName}. Ids: ${clips.map((item) => item.id).join(', ')}`)
  if (!fs.existsSync(clip.filePath)) throw new Error(`Missing video ${clip.filePath}`)
  return clip
}

const checkSheets = () => {
  let count = 0
  for (const setName of SETS) {
    for (const clip of parseSheet(setName)) {
      if (!fs.existsSync(clip.filePath)) throw new Error(`Missing video ${clip.filePath}`)
      count += 1
      console.log(`${setName} ${clip.id}  ${clip.title}`)
    }
  }
  console.log(`ok ${count}`)
}

const printPlan = (setName, clip) => {
  console.log(clip.filePath)
  console.log('')
  console.log(`Shorts title: ${clip.title}`)
  console.log(clip.youtube)
  console.log('')
  console.log('TikTok')
  console.log(clip.tiktok)
  console.log('')
  console.log('Reels')
  console.log(clip.instagram)
  console.log('')
  console.log(`dry-run ${setName} ${clip.id}`)
}

const readLog = () => {
  if (!fs.existsSync(LOG_PATH)) return []
  return fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line))
}

const alreadyPosted = (clip, platform) => readLog().some((entry) => entry.ok && entry.file === clip.fileName && entry.platform === platform)

const appendLog = (entry) => {
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true })
  fs.appendFileSync(LOG_PATH, `${JSON.stringify(entry)}\n`)
}

const portOpen = (port) => new Promise((resolve) => {
  const socket = net.connect({ host: '127.0.0.1', port }, () => {
    socket.end()
    resolve(true)
  })
  socket.on('error', () => resolve(false))
})

const chromePid = () => {
  const lock = path.join(CHROME_DIR, 'SingletonLock')
  if (!fs.existsSync(lock)) return 0
  try {
    return Number(String(fs.readlinkSync(lock)).split('-').pop()) || 0
  } catch {
    return 0
  }
}

const pidAlive = (pid) => {
  if (!pid) return false
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

const waitForPort = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await portOpen(CDP_PORT)) return
    await sleep(500)
  }
  throw new Error('Chrome не открыл порт отладки.')
}

const debugChromePids = () => {
  const out = execFileSync('ps', ['-ax', '-o', 'pid=,command='], { encoding: 'utf8' })
  return out.split('\n').flatMap((line) => {
    const match = line.match(/^\s*(\d+)\s+(.*Google Chrome\.app\/Contents\/MacOS\/Google Chrome\s+.*)$/)
    if (!match) return []
    if (!match[2].includes(`--user-data-dir=${DEBUG_DIR}`)) return []
    return [Number(match[1])]
  })
}

const quitDebugChrome = async () => {
  const pids = debugChromePids().filter((pid) => pidAlive(pid))
  if (pids.length === 0) return
  pids.forEach((pid) => process.kill(pid, 'SIGTERM'))
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (debugChromePids().every((pid) => !pidAlive(pid))) return
    await sleep(300)
  }
}

const chromeKey = () => {
  console.log('Если Mac спросит доступ к связке ключей Chrome, нажми Allow.')
  const password = execFileSync('security', [
    'find-generic-password', '-w', '-s', 'Chrome Safe Storage', '-a', 'Chrome',
  ], { encoding: 'utf8' }).trim()
  return crypto.pbkdf2Sync(password, 'saltysalt', 1003, 16, 'sha1')
}

const decryptCookie = (hexValue, key) => {
  const blob = Buffer.from(hexValue, 'hex')
  if (!blob.subarray(0, 3).equals(Buffer.from('v10'))) return ''
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, Buffer.alloc(16, ' '))
  const plain = Buffer.concat([decipher.update(blob.subarray(3)), decipher.final()])
  const value = plain.subarray(32).toString('utf8')
  if (!value || /[\u0000-\u0008]/.test(value)) return ''
  return value
}

const snapshotCookies = () => {
  const source = path.join(CHROME_DIR, 'Default', 'Cookies')
  if (!fs.existsSync(source)) throw new Error('В обычном Chrome нет сохранённого входа.')
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'crittermino-cookies-'))
  for (const suffix of ['', '-wal', '-shm']) {
    const from = `${source}${suffix}`
    if (fs.existsSync(from)) fs.copyFileSync(from, path.join(dir, `Cookies${suffix}`))
  }
  return path.join(dir, 'Cookies')
}

const readSessionCookies = () => {
  const key = chromeKey()
  const database = snapshotCookies()
  const where = SESSION_HOSTS.map((host) => `host_key LIKE '%${host}'`).join(' OR ')
  const sql = `SELECT host_key, name, path, is_secure, is_httponly, expires_utc, samesite, hex(encrypted_value) FROM cookies WHERE ${where};`
  const raw = execFileSync('sqlite3', ['-separator', '\t', database, sql], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  const now = Date.now() / 1000
  const cookies = []
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue
    const [hostKey, name, cookiePath, secure, httpOnly, expiresUtc, sameSiteRaw, hexValue] = line.split('\t')
    const value = decryptCookie(hexValue ?? '', key)
    if (!name || !value) continue
    const sameSite = { 0: 'None', 1: 'Lax', 2: 'Strict' }[Number(sameSiteRaw)] ?? 'Lax'
    const expires = Number(expiresUtc) / 1e6 - CHROME_EPOCH_SECONDS
    const cookie = {
      name,
      value,
      domain: hostKey,
      path: cookiePath || '/',
      httpOnly: httpOnly === '1',
      secure: secure === '1' || sameSite === 'None',
      sameSite,
    }
    if (expires > now) cookie.expires = expires
    cookies.push(cookie)
  }
  const google = cookies.filter((cookie) => cookie.domain.includes('google.com') && cookie.name === 'SID').length
  const tiktok = cookies.filter((cookie) => cookie.domain.includes('tiktok') && cookie.name === 'sessionid').length
  const instagram = cookies.filter((cookie) => cookie.domain.includes('instagram') && cookie.name === 'sessionid').length
  console.log(`Сессия из обычного Chrome: google ${google}, tiktok ${tiktok}, instagram ${instagram}`)
  return cookies.filter((cookie) => !/google\.com|youtube\.com/.test(cookie.domain))
}

const openBrowser = async () => {
  const cookies = readSessionCookies()
  await quitDebugChrome()
  fs.mkdirSync(DEBUG_DIR, { recursive: true })
  const child = spawn(CHROME_BIN, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${DEBUG_DIR}`,
    '--remote-allow-origins=*',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ], { detached: true, stdio: 'ignore' })
  child.unref()
  await waitForPort()
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`)
  const context = browser.contexts()[0]
  if (!context) throw new Error('Chrome открылся без окна')
  for (const cookie of cookies) {
    await context.addCookies([cookie]).catch(() => {})
  }
  return context
}

const shot = async (page, platform) => {
  fs.mkdirSync(ERROR_DIR, { recursive: true })
  const file = path.join(ERROR_DIR, `${Date.now()}-${platform}.png`)
  await page.screenshot({ path: file, fullPage: true }).catch(() => {})
  return file
}

const replaceBox = async (page, locator, value) => {
  await locator.click()
  await sleep(200)
  await page.keyboard.press('ControlOrMeta+a')
  await page.keyboard.press('Backspace')
  await page.keyboard.insertText(value)
}

const assertLoggedIn = (page, platform, loginUrl) => {
  if (page.url().includes(loginUrl)) throw new Error(`${platform}: сессия не подхватилась`)
}

const youtubeRadioOn = async (page, name) => page.evaluate((radioName) => {
  const radio = document.querySelector(`tp-yt-paper-radio-button[name="${radioName}"]`)
  return radio?.getAttribute('aria-checked') === 'true'
}, name)

const selectYouTubeRadio = async (page, name) => {
  const radio = page.locator(`tp-yt-paper-radio-button[name="${name}"]`)
  await radio.waitFor({ state: 'visible', timeout: 60000 })
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (await youtubeRadioOn(page, name)) return
    await radio.click()
    await sleep(400)
  }
  if (!(await youtubeRadioOn(page, name))) throw new Error(`youtube: пункт ${name} не включился`)
}

const ensureYouTubeLogin = async (page) => {
  const uploadUrl = 'https://www.youtube.com/upload?hl=en'
  if (!page.url().includes('accounts.google.com')) return
  console.log('YouTube: в этом окне один раз нажми свой аккаунт и войди. Окно сохранится, следующий запуск уже без логина.')
  await page.waitForURL((url) => !url.href.includes('accounts.google.com'), { timeout: 240000 })
  if (!page.url().includes('youtube.com/upload')) {
    await page.goto(uploadUrl, { waitUntil: 'domcontentloaded', timeout: 45000 })
  }
  if (page.url().includes('accounts.google.com')) throw new Error('youtube: сессия не подхватилась')
}

const postYouTube = async (page, clip) => {
  await page.goto('https://www.youtube.com/upload?hl=en', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await ensureYouTubeLogin(page)
  await page.locator('input[type="file"]').first().setInputFiles(clip.filePath)
  const title = page.locator('#title-textarea #textbox')
  await title.waitFor({ timeout: 90000 })
  await replaceBox(page, title, clip.title)
  await replaceBox(page, page.locator('#description-textarea #textbox'), clip.youtube)
  await selectYouTubeRadio(page, 'VIDEO_MADE_FOR_KIDS_NOT_MFK')
  const publicRadio = page.locator('tp-yt-paper-radio-button[name="PUBLIC"]')
  for (let step = 0; step < 4; step += 1) {
    if (await publicRadio.isVisible().catch(() => false)) break
    await page.waitForFunction(() => {
      const button = document.querySelector('#next-button')
      if (!button || button.getAttribute('aria-disabled') === 'true') return false
      const inner = button.querySelector('button') ?? button.shadowRoot?.querySelector('button')
      return !inner?.disabled
    }, null, { timeout: 180000 })
    await page.locator('#next-button').click()
    await sleep(700)
  }
  await selectYouTubeRadio(page, 'PUBLIC')
  await page.waitForFunction(() => {
    const button = document.querySelector('#done-button')
    if (!button || button.getAttribute('aria-disabled') === 'true') return false
    const text = `${button.innerText} ${button.shadowRoot?.textContent ?? ''}`
    return /publish|опубликовать/i.test(text)
  }, null, { timeout: 180000 })
  await page.locator('#done-button').click()
  const stillProcessing = page.locator('ytcp-uploads-still-processing-dialog')
  if (await stillProcessing.waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false)) {
    await stillProcessing.getByRole('button', { name: /publish|опубликовать/i }).click()
  }
  await page.getByText(/video published|short published|опубликовано/i).first().waitFor({ timeout: 180000 })
  const link = page.locator('a[href*="youtu.be/"], a[href*="youtube.com/shorts/"]').first()
  await link.waitFor({ timeout: 30000 })
  await sleep(1500)
  return (await link.getAttribute('href')) ?? page.url()
}

const dismissTikTokDraft = async (page) => {
  const banner = page.getByText(/wasn't saved|не было сохранено/i)
  if (!(await banner.first().isVisible().catch(() => false))) return
  const discard = page.getByRole('button', { name: /discard|удалить|сбросить/i })
  if (await discard.first().isVisible().catch(() => false)) await discard.first().click()
  await sleep(400)
  if (await discard.last().isVisible().catch(() => false)) await discard.last().click()
}

const postTikTok = async (page, clip) => {
  await page.goto('https://www.tiktok.com/tiktokstudio/upload?from=upload&lang=en', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await clickIfVisible(page.getByRole('button', { name: /allow all/i }))
  if (page.url().includes('/login')) throw new Error('tiktok: сессия не подхватилась')
  await dismissTikTokDraft(page)
  await page.locator('input[type="file"]').first().setInputFiles(clip.filePath)
  const caption = page.locator('div[contenteditable="true"]').first()
  await caption.waitFor({ timeout: 90000 })
  await replaceBox(page, caption, clip.tiktok)
  await page.keyboard.press('Escape')
  const post = page.locator('button[data-e2e="post_video_button"]').first()
  await post.waitFor({ state: 'visible', timeout: 180000 })
  await page.waitForFunction(() => {
    const button = document.querySelector('button[data-e2e="post_video_button"]')
    return Boolean(button) && button.getAttribute('aria-disabled') !== 'true' && !button.disabled
  }, null, { timeout: 180000 })
  await post.click()
  await page.waitForURL(/tiktokstudio\/content/, { timeout: 120000 })
  return page.url()
}

const clickIfVisible = async (locator) => {
  if (await locator.isVisible().catch(() => false)) {
    await locator.click()
    return true
  }
  return false
}

const dismissInstagramPrompts = async (page, timeout = 2000) => {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    const reels = page.getByText(/video posts are now shared as reels/i).first()
    if (await reels.isVisible().catch(() => false)) {
      const dialog = page.locator('[role="dialog"]').filter({ hasText: /video posts are now shared as reels/i }).last()
      const scope = (await dialog.count()) > 0 ? dialog : page.locator('div').filter({ hasText: /video posts are now shared as reels/i }).last()
      const ok = scope.getByRole('button', { name: /^OK$/i })
      if (await ok.first().isVisible().catch(() => false)) await ok.first().click()
      else await scope.getByText(/^OK$/, { exact: true }).last().click()
      await reels.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
      continue
    }
    const notNow = page.getByRole('button', { name: /^(not now|не сейчас)$/i }).first()
    if (await notNow.isVisible().catch(() => false)) {
      await notNow.click()
      await sleep(300)
      continue
    }
    await sleep(300)
  }
}

const openInstagramComposer = async (page) => {
  await dismissInstagramPrompts(page)
  const postItem = page.getByText(/^Post$/, { exact: true }).or(page.getByText(/^Публикация$/, { exact: true }))
  if (!(await postItem.first().isVisible().catch(() => false))) {
    const create = page.getByText(/^Create$/, { exact: true }).or(page.getByText(/^Создать$/, { exact: true }))
    if (await create.first().isVisible().catch(() => false)) {
      await create.first().click()
    } else {
      await page.locator('svg[aria-label="New post"], svg[aria-label="Создать"]').locator('visible=true').first().click()
    }
  }
  await postItem.first().click()
  const file = page.locator('input[type="file"]').first()
  await file.waitFor({ state: 'attached', timeout: 15000 })
  return file
}

const instagramCaption = (dialog) => dialog.locator('[role="textbox"][aria-label*="caption" i], [contenteditable="true"][aria-label*="caption" i], [aria-placeholder*="caption" i]').first()

const postInstagram = async (page, clip) => {
  await page.goto('https://www.instagram.com/?hl=en', { waitUntil: 'domcontentloaded', timeout: 45000 })
  assertLoggedIn(page, 'instagram', '/accounts/login')
  await dismissInstagramPrompts(page, 3000)
  const file = await openInstagramComposer(page)
  await file.setInputFiles(clip.filePath)
  await dismissInstagramPrompts(page, 12000)
  await clickIfVisible(page.getByRole('button', { name: /original|оригинал/i }))
  const dialog = page.locator('div[role="dialog"]').last()
  for (let step = 0; step < 4; step += 1) {
    await dismissInstagramPrompts(page, 1500)
    if (await instagramCaption(dialog).isVisible().catch(() => false)) break
    if (await dialog.getByRole('button', { name: /^(Share|Поделиться)$/ }).isVisible().catch(() => false)) break
    const next = dialog.getByRole('button', { name: /^(Next|Далее)$/ })
    if (!(await next.isVisible().catch(() => false))) break
    await next.click()
    await sleep(700)
  }
  const field = instagramCaption(dialog)
  if (await field.isVisible().catch(() => false)) {
    await field.click()
  } else {
    await dialog.getByText(/Add a caption|Добавьте подпись/i).first().click()
  }
  await page.keyboard.insertText(clip.instagram)
  await sleep(400)
  const marker = clip.instagram.slice(0, 24)
  const written = await dialog.innerText()
  if (!written.includes(marker)) throw new Error('instagram: подпись не записалась')
  await dialog.getByRole('button', { name: /^(Share|Поделиться)$/ }).click()
  await page.getByText(/reel has been shared|post has been shared|ваша рилс|публикация опубликована/i).first().waitFor({ timeout: 120000 })
  return page.url()
}

const posters = {
  youtube: postYouTube,
  tiktok: postTikTok,
  instagram: postInstagram,
}

const login = async () => {
  console.log('TikTok и Instagram берутся из обычного Chrome.')
  console.log('YouTube туда не переносится. Первый пост откроет отдельное окно: войди в нём один раз, дальше оно сохраняется.')
}

const postClip = async ({ setName, clip, only, again }) => {
  const context = await openBrowser()
  const results = []
  let youtubePublished = !only.has('youtube')
  for (const platform of PLATFORMS) {
    if (!only.has(platform)) continue
    if (!again && alreadyPosted(clip, platform)) {
      console.log(`${platform} skip  уже постили ${clip.fileName}. Повторить: --again`)
      if (platform === 'youtube') youtubePublished = true
      results.push({ platform, ok: true, skipped: true })
      continue
    }
    const page = await context.newPage()
    const started = Date.now()
    try {
      const url = await posters[platform](page, clip)
      if (platform === 'youtube') youtubePublished = true
      appendLog({ at: new Date().toISOString(), set: setName, id: clip.id, file: clip.fileName, platform, ok: true, url })
      console.log(`${platform} ok  ${url}`)
      results.push({ platform, ok: true, url })
    } catch (error) {
      const picture = await shot(page, platform)
      const message = error instanceof Error ? error.message : String(error)
      appendLog({ at: new Date().toISOString(), set: setName, id: clip.id, file: clip.fileName, platform, ok: false, error: message, picture })
      console.log(`${platform} fail  ${message}`)
      console.log(`скрин ${picture}`)
      results.push({ platform, ok: false, error: message })
    } finally {
      if (platform !== 'youtube' || youtubePublished) await page.close().catch(() => {})
      console.log(`${platform} ${Math.round((Date.now() - started) / 1000)}s`)
    }
  }
  const failed = results.filter((item) => !item.ok)
  if (!youtubePublished) {
    console.log('youtube: окно не закрываю, Public не подтверждён. Закроешь сам — ролик станет черновиком.')
    process.exit(1)
  }
  await context.browser()?.close()
  if (failed.length > 0) process.exitCode = 1
}

const usage = () => {
  console.log(`node scripts/post-clip.mjs login`)
  console.log(`node scripts/post-clip.mjs check`)
  console.log(`node scripts/post-clip.mjs <fails|think|compare|social|lesson> <id> [--platform youtube|tiktok|instagram] [--dry-run] [--again]`)
}

const main = async () => {
  const { flags, only, words } = readArgs()
  const [command, query] = words
  if (!command) {
    usage()
    return
  }
  if (command === 'login') {
    await login()
    return
  }
  if (command === 'session') {
    const context = await openBrowser()
    const page = await context.newPage()
    await page.goto('https://studio.youtube.com/?hl=en', { waitUntil: 'domcontentloaded', timeout: 45000 })
    console.log(`youtube ${page.url()}`)
    await page.goto('https://www.tiktok.com/tiktokstudio/upload?lang=en', { waitUntil: 'domcontentloaded', timeout: 45000 })
    await clickIfVisible(page.getByRole('button', { name: /allow all/i }))
    console.log(`tiktok ${page.url()}`)
    await page.close()
    await context.browser()?.close()
    return
  }
  if (command === 'check') {
    checkSheets()
    return
  }
  if (!SETS.includes(command) || !query) {
    usage()
    throw new Error('Нужны набор и номер ролика, например: fails 01')
  }
  const clip = findClip(command, query)
  if (flags.has('--dry-run')) {
    printPlan(command, clip)
    return
  }
  await postClip({ setName: command, clip, only, again: flags.has('--again') })
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
