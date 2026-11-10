import { useGame } from '@/hooks/useGame'
import { localeFromAcceptLanguage, type Locale } from '@/lib/locale'
import { setPlatformMuted } from '@/lib/sound'

interface CrazyGamesSettings {
  muteAudio: boolean
}

interface CrazyGamesSdk {
  environment: 'local' | 'crazygames' | 'disabled'
  init: () => Promise<void>
  game: {
    settings: CrazyGamesSettings
    gameplayStart: () => void
    gameplayStop: () => void
    addSettingsChangeListener: (listener: (settings: CrazyGamesSettings) => void) => void
  }
  user: {
    systemInfo: { locale?: string }
  }
}

declare global {
  interface Window {
    CrazyGames?: { SDK: CrazyGamesSdk }
  }
}

type GameState = ReturnType<typeof useGame.getState>

/** Returns the SDK when the game runs on CrazyGames or localhost, and null everywhere else. */
export const initCrazyGames = async (): Promise<CrazyGamesSdk | null> => {
  const sdk = window.CrazyGames?.SDK
  if (!sdk) return null
  try {
    await sdk.init()
  } catch {
    return null
  }
  return sdk.environment === 'disabled' ? null : sdk
}

export const resolvePortalLocale = (sdk: CrazyGamesSdk | null): Locale =>
  localeFromAcceptLanguage(sdk?.user.systemInfo.locale ?? navigator.language)

const isPlaying = (state: GameState): boolean =>
  state.view === 'play' && state.level !== null && !state.isGenerating && !state.isComplete && !state.menuOpen && !state.settingsOpen

const syncGameplay = (sdk: CrazyGamesSdk): void => {
  let playing = false
  const sync = (state: GameState): void => {
    const next = isPlaying(state)
    if (next === playing) return
    playing = next
    if (next) sdk.game.gameplayStart()
    else sdk.game.gameplayStop()
  }
  useGame.subscribe(sync)
  sync(useGame.getState())
}

/** Reports gameplay breaks to CrazyGames and follows its audio mute. */
export const connectCrazyGames = (sdk: CrazyGamesSdk): void => {
  setPlatformMuted(sdk.game.settings.muteAudio)
  sdk.game.addSettingsChangeListener((settings) => setPlatformMuted(settings.muteAudio))
  syncGameplay(sdk)
}
