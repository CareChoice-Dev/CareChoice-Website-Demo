import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectLocale } from './middleware-helpers'

export function middleware(request: NextRequest) {
  const locale = detectLocale(request.nextUrl.pathname)
  const response = NextResponse.next()
  response.headers.set('x-locale', locale)
  return response
}

export const config = {
  matcher: ['/((?!api|_next|admin|.*\\.).*)'],
}
