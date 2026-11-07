export type Animal = '🐭' | '🐱' | '🐶' | '🐼' | '🦁'

export type Difficulty = 'tutorial' | 'easy' | 'medium' | 'hard'

export interface TutorialCue {
  message: string
  spotlight: Array<{ row: number; col: number }>
  /** Animal to preselect. Level 3 preselects the wrong one on purpose. */
  select?: Animal
}

export interface Level {
  number: number
  size: number
  difficulty: Difficulty
  solution: number[][]
  givens: boolean[][]
  palette: number[]
  tutorial?: TutorialCue
  intro?: string
}

export interface Cell {
  row: number
  col: number
  animal: Animal | null
  isHint: boolean
  regionId: number | null
  isComplete: boolean
  hasError: boolean
}

export interface GameState {
  level: number
  grid: Cell[][]
  selectedAnimal: Animal | null
  moves: number
  hints: number
  isComplete: boolean
}

export interface Progress {
  currentLevel: number
  completedLevels: number[]
  bestMoves: Record<number, number>
  hintsUsed: number
  totalMoves: number
  streak: number
  lastPlayed: string
  soundEnabled: boolean
  hapticsEnabled: boolean
  tutorialCompleted: boolean
}

export interface Burst {
  id: number
  row: number
  col: number
  color: string
}

export type Coach =
  | { kind: 'cell'; row: number; col: number; note: string }
  | { kind: 'region'; cells: Array<{ row: number; col: number }>; animal: Animal; note: string }
