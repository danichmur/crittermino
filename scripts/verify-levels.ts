import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { generateLevel } from '../lib/generator'
import { assertPlayable } from '../lib/solver'
import type { Level } from '../types/game'

const main = (): void => {
  const path = resolve(process.cwd(), 'data/levels.json')
  const bank = JSON.parse(readFileSync(path, 'utf8')) as { levels: Level[] }
  if (bank.levels.length < 20) throw new Error('Expected at least 20 banked levels')
  for (const level of bank.levels) {
    assertPlayable(level)
    const again = generateLevel(level.number)
    if (JSON.stringify(again) !== JSON.stringify(level)) {
      throw new Error(`Level ${level.number} does not match generateLevel`)
    }
  }
  console.log(`Verified ${bank.levels.length} deterministic, uniquely solvable levels`)
}

main()
