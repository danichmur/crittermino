const buildTarget = process.env.NEXT_PUBLIC_BUILD_TARGET

/** CrazyGames portal: no site links, and the portal starts the player inside a level. */
export const IS_PORTAL_BUILD = buildTarget === 'crazygames'

/** A packaged shell (CrazyGames or the iOS app) with no website routes inside it. */
export const IS_APP_SHELL = buildTarget === 'crazygames' || buildTarget === 'ios'
