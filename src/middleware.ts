import { NextResponse, type NextRequest } from 'next/server'

const AUTH_COOKIE_NAME =
  process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'biishare_session'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProfilePath = path === '/profile' || path.startsWith('/profile/')

  if (!isProfilePath) {
    return NextResponse.next()
  }

  const hasSessionCookie = Boolean(
    request.cookies.get(AUTH_COOKIE_NAME)?.value,
  )

  if (hasSessionCookie) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/profile/:path*'],
}
