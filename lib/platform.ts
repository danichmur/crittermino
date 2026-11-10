/** True in the CrazyGames bundle, which must not link to the website or register a service worker. */
export const IS_PORTAL_BUILD = process.env.NEXT_PUBLIC_BUILD_TARGET === 'crazygames'
