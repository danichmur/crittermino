import type { Animal } from '@/types/game'

export const BOARD_LINES = [
  'Tap the glowing cell to give Mouse a 2-cell home.',
  'Cat needs more room than Mouse — exactly 3 cells.',
  "Same-size homes can't share a wall. Cat sits between these mice.",
  'First real puzzle. The givens are all you need.',
  'Panda needs a connected home of exactly 5 cells.',
  'Lion needs a roomy home of exactly 6 cells.',
] as const

export type BoardLine = (typeof BOARD_LINES)[number]

export interface NamedBlock {
  readonly title: string
  readonly body: string
}

export interface Copy {
  readonly metaTitle: string
  readonly metaDescription: string
  readonly language: string
  readonly howToPlay: string
  readonly blog: string
  readonly daily: string
  readonly about: string
  readonly privacy: string
  readonly home: string
  readonly freeInBrowser: string
  readonly logicPuzzle: string
  readonly tagline: string
  readonly play: string
  readonly continueLevel: string
  readonly comingSoon: string
  readonly levelSelect: string
  readonly installApp: string
  readonly clearedSummary: string
  readonly streakToday: string
  readonly streakKeep: string
  readonly seoTitle: string
  readonly seoBody: string
  readonly homesTitle: string
  readonly homesNote: string
  readonly cellCount: string
  readonly questions: string
  readonly faqs: readonly { readonly question: string; readonly answer: string }[]
  readonly folding: string
  readonly dailyLabel: string
  readonly levelName: string
  readonly homeCount: string
  readonly openMenu: string
  readonly tapToDismiss: string
  readonly sameSizeError: string
  readonly chooseAnimal: string
  readonly cellWhere: string
  readonly cellEmpty: string
  readonly cellGiven: string
  readonly cellComplete: string
  readonly cellError: string
  readonly animalButton: string
  readonly hint: string
  readonly closeDialog: string
  readonly onlyOne: string
  readonly lookHere: string
  readonly outlined: string
  readonly menu: string
  readonly continue: string
  readonly restartLevel: string
  readonly dailyPuzzle: string
  readonly dailyDoneToday: string
  readonly settings: string
  readonly moreAnimals: string
  readonly moreAnimalsBody: string
  readonly unlockAnimals: string
  readonly sound: string
  readonly haptics: string
  readonly on: string
  readonly off: string
  readonly resetWarning: string
  readonly confirmReset: string
  readonly cancel: string
  readonly resetProgress: string
  readonly dailyClear: string
  readonly tutorialComplete: string
  readonly levelClear: string
  readonly tutorialDone: string
  readonly homesFound: string
  readonly moveOne: string
  readonly moveFew: string
  readonly moveMany: string
  readonly dayOne: string
  readonly dayFew: string
  readonly dayMany: string
  readonly homeOne: string
  readonly homeFew: string
  readonly homeMany: string
  readonly cellOne: string
  readonly cellFew: string
  readonly cellMany: string
  readonly time: string
  readonly newBest: string
  readonly lastHome: string
  readonly ruleFill: string
  readonly ruleSize: string
  readonly ruleApart: string
  readonly todaysPage: string
  readonly playLevel6: string
  readonly nextLevel: string
  readonly share: string
  readonly replay: string
  readonly scoreCopied: string
  readonly pickAnimal: string
  readonly puzzleFailed: string
  readonly shareSentence: string
  readonly shareNext: string
  readonly shareShared: string
  readonly scoreNotFound: string
  readonly levels: string
  readonly chaseScore: string
  readonly previous: string
  readonly next: string
  readonly cleared: string
  readonly open: string
  readonly moveCount: string
  readonly capCleared: string
  readonly comingBody: string
  readonly shareLevelCleared: string
  readonly playYourNext: string
  readonly playLevel: string
  readonly everyCleared: string
  readonly opensNext: string
  readonly wandered: string
  readonly backToPuzzle: string
  readonly clearedDevice: string
  readonly strategies: string
  readonly aboutGame: string
  readonly boardLines: Record<BoardLine, string>
  readonly animals: Record<Animal, string>
  readonly howToMetaTitle: string
  readonly howToMetaDescription: string
  readonly howToLead: string
  readonly howToRules: readonly NamedBlock[]
  readonly howToNeighbors: string
  readonly howToCompare: string
  readonly howToCompareNote: string
  readonly howToCorner: NamedBlock
  readonly howToFour: NamedBlock
  readonly howToThree: NamedBlock
  readonly howToTry: string
  readonly howToTryNote: string
  readonly howToSolved: string
  readonly howToLongerBefore: string
  readonly howToSolveLink: string
  readonly howToLongerMiddle: string
  readonly howToDailyLink: string
  readonly howToLongerAfter: string
  readonly howToPlayCta: string
  readonly howToLegalName: string
  readonly howToLegalText: string
  readonly aboutMetaTitle: string
  readonly aboutMetaDescription: string
  readonly aboutLead: string
  readonly aboutHistoryTitle: string
  readonly aboutHistory: readonly string[]
  readonly aboutSourceBefore: string
  readonly aboutSourceAnd: string
  readonly aboutSourceAlso: string
  readonly aboutSourceAfter: string
  readonly aboutWhyTitle: string
  readonly aboutWhyBody: string
  readonly aboutCampaignBefore: string
  readonly aboutDailyLink: string
  readonly aboutCampaignAfter: string
  readonly aboutPlay: string
  readonly privacyMetaTitle: string
  readonly privacyMetaDescription: string
  readonly privacyHeading: string
  readonly privacyIntro: string
  readonly privacyQuestions: string
  readonly privacyPlay: string
  readonly privacySections: readonly NamedBlock[]
  readonly dailyMetaTitle: string
  readonly dailyMetaDescription: string
  readonly dailyEyebrow: string
  readonly dailyHeading: string
  readonly dailyLead: string
  readonly dailyJsonName: string
  readonly dailyJsonDescription: string
  readonly dailyCards: readonly NamedBlock[]
  readonly dailyRulesBefore: string
  readonly dailyHowLink: string
  readonly dailyRulesAfter: string
  readonly dailyPlay: string
  readonly blogMetaTitle: string
  readonly blogMetaDescription: string
  readonly blogLead: string
  readonly blogEnglishNote: string
  readonly blogName: string
  readonly articleNotFound: string
  readonly playALevel: string
  readonly playToday: string
  readonly moreNotes: string
}
