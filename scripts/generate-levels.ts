import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { availableParallelism, tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { Worker } from 'node:worker_threads'
import type { Level } from '../types/game'
import { evaluatePuzzle } from '../lib/solver'

const require = createRequire(import.meta.url)
const esbuild = require('esbuild') as {
  build: (options: {
    entryPoints: string[]
    bundle: boolean
    platform: 'node'
    format: 'esm'
    outfile: string
  }) => Promise<void>
}

const assertSolver = (): void => {
  const square = evaluatePuzzle(
    [
      [4, 4],
      [4, 4],
    ],
    [4],
  )
  if (square.status !== 'unique') throw new Error(`Filled 2x2 should be unique, got ${square.status}`)
  const forced = evaluatePuzzle(
    [
      [0, 0],
      [0, 0],
    ],
    [4],
  )
  if (forced.status !== 'unique') throw new Error(`Empty 2x2 of dogs should be unique, got ${forced.status}`)
  const impossible = evaluatePuzzle(
    [
      [0, 0],
      [0, 0],
    ],
    [2],
  )
  if (impossible.status !== 'none') throw new Error(`2x2 of mice should be impossible, got ${impossible.status}`)
}

const outputPath = resolve(process.cwd(), 'data/levels.json')
const partialPath = resolve(process.cwd(), 'data/levels.partial.json')
const workerBundle = resolve(tmpdir(), 'crittermino-generate-worker.mjs')

const prepareWorker = async (): Promise<void> => {
  await esbuild.build({
    entryPoints: [resolve(process.cwd(), 'scripts/generate-worker.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: workerBundle,
  })
}

const readLevels = (path: string): Level[] => {
  if (!existsSync(path)) return []
  const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'))
  if (typeof parsed !== 'object' || parsed === null || !('levels' in parsed) || !Array.isArray(parsed.levels)) return []
  const levels: Level[] = []
  for (const level of parsed.levels) {
    if (typeof level !== 'object' || level === null || !('number' in level)) break
    if (level.number !== levels.length + 1) break
    levels.push(level as Level)
  }
  return levels
}

const writeLevels = (path: string, levels: readonly Level[]): void => {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify({ generatedAt: new Date().toISOString(), levels }, null, 2)}\n`)
}

const buildLevel = (levelNumber: number): Promise<{ level: Level; elapsed: number }> =>
  new Promise((resolveLevel, rejectLevel) => {
    const worker = new Worker(workerBundle, { workerData: { levelNumber } })
    const finish = (): void => {
      void worker.terminate()
    }
    worker.once('message', (message: { level?: Level; elapsed?: number; error?: string }) => {
      finish()
      if (message.error || !message.level) {
        rejectLevel(new Error(message.error ?? `Level ${levelNumber} failed`))
        return
      }
      resolveLevel({ level: message.level, elapsed: message.elapsed ?? 0 })
    })
    worker.once('error', (error) => {
      finish()
      rejectLevel(error)
    })
  })

const main = async (): Promise<void> => {
  assertSolver()
  await prepareWorker()
  const maxLevel = Number(process.argv[2] ?? 40)
  const partial = readLevels(partialPath)
  const shipped = readLevels(outputPath)
  const levels = partial.length > shipped.length ? partial : shipped
  const concurrency = Math.max(2, Math.min(4, availableParallelism() - 1))
  const started = Date.now()
  console.log(`Keeping ${levels.length} levels, building through ${maxLevel} with ${concurrency} workers`)
  while (levels.length < maxLevel) {
    const batchStart = levels.length + 1
    const batchEnd = Math.min(maxLevel, batchStart + concurrency - 1)
    const numbers = Array.from({ length: batchEnd - batchStart + 1 }, (_, index) => batchStart + index)
    const built = await Promise.all(numbers.map((levelNumber) => buildLevel(levelNumber)))
    for (const { level, elapsed } of built) {
      const clues = level.givens.flat().filter(Boolean).length
      console.log(
        `level ${String(level.number).padStart(3, ' ')}  ${level.size}x${level.size}  ${level.difficulty.padEnd(8)}  clues ${clues}/${level.size * level.size}  ${elapsed}ms`,
      )
      levels.push(level)
    }
    writeLevels(partialPath, levels)
  }
  writeLevels(outputPath, levels)
  rmSync(partialPath, { force: true })
  console.log(`Wrote ${levels.length} levels in ${Date.now() - started}ms`)
}

void main()
