import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectLocale } from './proxy-helpers'

const URL_PREFIXES = ['en', 'vi', 'zh', 'easy-read']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]

  // If first segment is not a known locale prefix, redirect to /en/<original-path>
  if (!first || !URL_PREFIXES.includes(first)) {
    const url = request.nextUrl.clone()
    url.pathname = `/en${pathname === '/' ? '' : pathname}`
    return NextResponse.redirect(url)
  }

  const locale = detectLocale(pathname)
  const response = NextResponse.next()
  response.headers.set('x-locale', locale)
  return response
}

export const config = {
  matcher: ['/((?!api|_next|admin|favicon\\.ico|fonts/|brand/|.*\\.).*)'],
}
