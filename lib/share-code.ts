import { LEVEL_CAP } from '@/lib/campaign'
import { formatTime } from '@/lib/format'
import { SITE } from '@/lib/site'

/** Level, move count, and whole seconds packed into a share link. */
export interface ShareScore {
  readonly level: number
  readonly moves: number
  readonly seconds: number
}

const VERSION = 1
const SALT_BYTES = 4
const PAYLOAD_BYTES = 6
const TOKEN_BYTES = 1 + SALT_BYTES + PAYLOAD_BYTES + 2
const SECRET = 'crittermino-share-v1'
const MAX_U16 = 65_535

const secretBytes = (): Uint8Array => Uint8Array.from(SECRET, (char) => char.charCodeAt(0))

const mix = (seed: number, salt: Uint8Array, extra: number): number => {
  let hash = seed >>> 0
  for (const byte of secretBytes()) hash = Math.imul(hash ^ byte, 0x01000193) >>> 0
  for (const byte of salt) hash = Math.imul(hash ^ byte, 0x01000193) >>> 0
  hash = Math.imul(hash ^ extra, 0x01000193) >>> 0
  return hash
}

const keyByte = (salt: Uint8Array, index: number): number => mix(0xbb67ae85, salt, index) & 0xff

const tagOf = (payload: Uint8Array, salt: Uint8Array): number => {
  let hash = mix(0x6a09e667, salt, payload.length)
  for (let index = 0; index < payload.length; index += 1) {
    hash = Math.imul(hash ^ (payload[index] ?? 0), 0x01000193) >>> 0
  }
  return hash & 0xffff
}

const toBase64Url = (bytes: Uint8Array): string => {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

const fromBase64Url = (code: string): Uint8Array | null => {
  if (!/^[A-Za-z0-9_-]{16,32}$/.test(code)) return null
  const padded = code.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (code.length % 4)) % 4)
  try {
    const binary = atob(padded)
    if (binary.length !== TOKEN_BYTES) return null
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
    return bytes
  } catch {
    return null
  }
}

const xorPayload = (payload: Uint8Array, salt: Uint8Array): Uint8Array => {
  const masked = new Uint8Array(payload.length)
  for (let index = 0; index < payload.length; index += 1) {
    masked[index] = (payload[index] ?? 0) ^ keyByte(salt, index)
  }
  return masked
}

/**
 * Hide a cleared-level score in an opaque token.
 * The page can read it back; a flipped character fails the tag check.
 */
export const encodeShareCode = (score: ShareScore): string => {
  if (!Number.isInteger(score.level) || score.level < 1 || score.level > LEVEL_CAP) {
    throw new Error('Share level is out of range')
  }
  if (!Number.isInteger(score.moves) || score.moves < 0 || score.moves > MAX_U16) {
    throw new Error('Share move count is out of range')
  }
  if (!Number.isInteger(score.seconds) || score.seconds < 0 || score.seconds > MAX_U16) {
    throw new Error('Share time is out of range')
  }
  const salt = new Uint8Array(SALT_BYTES)
  crypto.getRandomValues(salt)
  const payload = new Uint8Array(PAYLOAD_BYTES)
  const view = new DataView(payload.buffer)
  view.setUint16(0, score.level)
  view.setUint16(2, score.moves)
  view.setUint16(4, score.seconds)
  const tag = tagOf(payload, salt)
  const body = new Uint8Array(PAYLOAD_BYTES + 2)
  body.set(payload)
  body[PAYLOAD_BYTES] = tag >> 8
  body[PAYLOAD_BYTES + 1] = tag & 0xff
  const token = new Uint8Array(TOKEN_BYTES)
  token[0] = VERSION
  token.set(salt, 1)
  token.set(xorPayload(body, salt), 1 + SALT_BYTES)
  return toBase64Url(token)
}

/** Recover a score from a share token, or null when the token is forged or corrupt. */
export const decodeShareCode = (code: string): ShareScore | null => {
  const token = fromBase64Url(code)
  if (!token || toBase64Url(token) !== code || token[0] !== VERSION) return null
  const salt = token.subarray(1, 1 + SALT_BYTES)
  const body = xorPayload(token.subarray(1 + SALT_BYTES), salt)
  const payload = body.subarray(0, PAYLOAD_BYTES)
  const tag = ((body[PAYLOAD_BYTES] ?? 0) << 8) | (body[PAYLOAD_BYTES + 1] ?? 0)
  if (tag !== tagOf(payload, salt)) return null
  const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength)
  const level = view.getUint16(0)
  const moves = view.getUint16(2)
  const seconds = view.getUint16(4)
  if (level < 1 || level > LEVEL_CAP) return null
  return { level, moves, seconds }
}

export const shareSentence = (score: ShareScore): string => {
  const moveWord = score.moves === 1 ? 'move' : 'moves'
  return `I cleared Crittermino level ${score.level} in ${score.moves} ${moveWord} · ${formatTime(score.seconds * 1000)}!`
}

export const sharePageUrl = (code: string): string => `${SITE.url}/share/${code}`

export const shareLine = (score: ShareScore, code: string): string => `${shareSentence(score)} ${sharePageUrl(code)}`
