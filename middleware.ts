import { NextResponse, type NextRequest } from 'next/server'
import { isLocale, LOCALE_COOKIE, LOCALE_HEADER, localeFromAcceptLanguage, localeFromCountry } from '@/lib/locale'

export const middleware = (request: NextRequest): NextResponse => {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value
  const country = request.headers.get('x-vercel-ip-country')
  const locale = isLocale(saved) ? saved : country ? localeFromCountry(country) : localeFromAcceptLanguage(request.headers.get('accept-language'))
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(LOCALE_HEADER, locale)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|txt|xml|json|js|css|woff2|mp4|mp3)).*)'],
}
