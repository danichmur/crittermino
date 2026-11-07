import { parentPort, workerData } from 'node:worker_threads'
import { generateLevel } from '../lib/generator'
import { assertPlayable } from '../lib/solver'

const levelNumber = workerData.levelNumber as number
const started = Date.now()

try {
  const level = generateLevel(levelNumber)
  assertPlayable(level)
  parentPort?.postMessage({ level, elapsed: Date.now() - started })
} catch (error) {
  const message = error instanceof Error ? error.message : 'Level generation failed'
  parentPort?.postMessage({ error: message, elapsed: Date.now() - started })
}
