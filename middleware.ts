import { NextResponse, type NextRequest } from 'next/server'
import { isLocale, LOCALE_COOKIE, LOCALE_HEADER, PATH_LOCALE_HEADER, localeFromAcceptLanguage, localeFromCountry } from '@/lib/locale'

const PREFIX = /^\/(ru|es)(?=\/|$)/

export const middleware = (request: NextRequest): NextResponse => {
  const prefixed = request.nextUrl.pathname.match(PREFIX)
  const pathLocale = prefixed?.[1]
  const saved = request.cookies.get(LOCALE_COOKIE)?.value
  const country = request.headers.get('x-vercel-ip-country')
  const locale = isLocale(pathLocale)
    ? pathLocale
    : isLocale(saved)
      ? saved
      : country
        ? localeFromCountry(country)
        : localeFromAcceptLanguage(request.headers.get('accept-language'))
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(LOCALE_HEADER, locale)
  requestHeaders.set(PATH_LOCALE_HEADER, isLocale(pathLocale) ? pathLocale : '')
  if (!isLocale(pathLocale)) return NextResponse.next({ request: { headers: requestHeaders } })
  const url = request.nextUrl.clone()
  const stripped = request.nextUrl.pathname.replace(PREFIX, '')
  url.pathname = stripped === '' ? '/' : stripped
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|txt|xml|json|js|css|woff2|mp4|mp3)).*)'],
}
