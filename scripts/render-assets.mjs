import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

const crcTable = new Uint32Array(256)
for (let index = 0; index < 256; index += 1) {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  crcTable[index] = value >>> 0
}

const crc32 = (buffer) => {
  let crc = 0xffffffff
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

const chunk = (type, data) => {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const name = Buffer.from(type)
  const checksum = Buffer.alloc(4)
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])))
  return Buffer.concat([length, name, data, checksum])
}

const encodePng = (width, height, pixels) => {
  const raw = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 4 + 1)] = 0
    pixels.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4)
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header[8] = 8
  header[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const createCanvas = (width, height, color) => {
  const pixels = Buffer.alloc(width * height * 4)
  fillRect(pixels, width, 0, 0, width, height, color)
  return { pixels, width, height }
}

const setPixel = (pixels, width, x, y, color) => {
  if (x < 0 || y < 0 || x >= width || y >= pixels.length / 4 / width) return
  const offset = (y * width + x) * 4
  const alpha = color[3] / 255
  const previous = pixels[offset + 3] / 255
  const next = alpha + previous * (1 - alpha)
  if (next <= 0) return
  for (let channel = 0; channel < 3; channel += 1) {
    pixels[offset + channel] = Math.round((color[channel] * alpha + pixels[offset + channel] * previous * (1 - alpha)) / next)
  }
  pixels[offset + 3] = Math.round(next * 255)
}

const fillRect = (pixels, width, x, y, w, h, color) => {
  for (let row = y; row < y + h; row += 1) {
    for (let col = x; col < x + w; col += 1) setPixel(pixels, width, col, row, color)
  }
}

const fillCircle = (pixels, width, cx, cy, radius, color) => {
  const r2 = radius * radius
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
      const dx = x + 0.5 - cx
      const dy = y + 0.5 - cy
      if (dx * dx + dy * dy <= r2) setPixel(pixels, width, x, y, color)
    }
  }
}

const roundRect = (pixels, width, x, y, w, h, radius, color) => {
  fillRect(pixels, width, x + radius, y, w - radius * 2, h, color)
  fillRect(pixels, width, x, y + radius, w, h - radius * 2, color)
  fillCircle(pixels, width, x + radius, y + radius, radius, color)
  fillCircle(pixels, width, x + w - radius, y + radius, radius, color)
  fillCircle(pixels, width, x + radius, y + h - radius, radius, color)
  fillCircle(pixels, width, x + w - radius, y + h - radius, radius, color)
}

const FONT = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01110'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
}

const drawText = (pixels, width, text, x, y, scale, color) => {
  let cursor = x
  for (const character of text) {
    const glyph = FONT[character] ?? FONT[' ']
    glyph.forEach((row, rowIndex) => {
      ;[...row].forEach((bit, colIndex) => {
        if (bit === '1') fillRect(pixels, width, cursor + colIndex * scale, y + rowIndex * scale, scale, scale, color)
      })
    })
    cursor += 6 * scale
  }
  return cursor
}

const textWidth = (text, scale) => text.length * 6 * scale - scale

const drawCritter = (pixels, width, size) => {
  const pink = [255, 107, 157, 255]
  const cream = [255, 249, 240, 255]
  const ink = [61, 44, 41, 255]
  const blush = [255, 170, 190, 255]
  roundRect(pixels, width, 0, 0, size, size, Math.round(size * 0.22), pink)
  fillCircle(pixels, width, size * 0.34, size * 0.34, size * 0.12, cream)
  fillCircle(pixels, width, size * 0.66, size * 0.34, size * 0.12, cream)
  fillCircle(pixels, width, size * 0.34, size * 0.34, size * 0.06, blush)
  fillCircle(pixels, width, size * 0.66, size * 0.34, size * 0.06, blush)
  fillCircle(pixels, width, size * 0.5, size * 0.56, size * 0.28, cream)
  fillCircle(pixels, width, size * 0.4, size * 0.52, size * 0.035, ink)
  fillCircle(pixels, width, size * 0.6, size * 0.52, size * 0.035, ink)
  fillCircle(pixels, width, size * 0.5, size * 0.62, size * 0.03, pink)
}

const save = (name, canvas) => {
  writeFileSync(new URL(`../public/${name}`, import.meta.url), encodePng(canvas.width, canvas.height, canvas.pixels))
}

const icon192 = createCanvas(192, 192, [255, 255, 255, 255])
drawCritter(icon192.pixels, 192, 192)
save('icon-192.png', icon192)

const icon512 = createCanvas(512, 512, [255, 255, 255, 255])
drawCritter(icon512.pixels, 512, 512)
save('icon-512.png', icon512)

const og = createCanvas(1200, 630, [255, 249, 240, 255])
roundRect(og.pixels, 1200, 70, 70, 280, 280, 64, [255, 107, 157, 255])
const badge = createCanvas(280, 280, [0, 0, 0, 0])
drawCritter(badge.pixels, 280, 280)
for (let y = 0; y < 280; y += 1) {
  for (let x = 0; x < 280; x += 1) {
    const source = (y * 280 + x) * 4
    if (badge.pixels[source + 3] === 0) continue
    setPixel(og.pixels, 1200, 70 + x, 150 + y, [
      badge.pixels[source],
      badge.pixels[source + 1],
      badge.pixels[source + 2],
      badge.pixels[source + 3],
    ])
  }
}
const title = 'CRITTERMINO'
const subtitle = 'BRAIN LOGIC PUZZLE'
drawText(og.pixels, 1200, title, 400, 190, 10, [61, 44, 41, 255])
drawText(og.pixels, 1200, subtitle, 400, 290, 5, [140, 116, 104, 255])
void textWidth
const colors = [
  [255, 229, 236, 255],
  [255, 244, 204, 255],
  [229, 244, 255, 255],
  [232, 245, 232, 255],
  [255, 229, 217, 255],
]
colors.forEach((color, index) => fillCircle(og.pixels, 1200, 460 + index * 90, 460, 28, color))
save('og-image.png', og)

console.log('Wrote icon-192.png, icon-512.png, and og-image.png')
