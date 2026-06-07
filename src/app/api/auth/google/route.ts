import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_GOOGLE_AUTH_PATH = '/auth/google'

export function GET(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const fallbackUrl = apiBaseUrl
    ? new URL(DEFAULT_GOOGLE_AUTH_PATH, apiBaseUrl).toString()
    : null

  const googleAuthUrl = configuredUrl || fallbackUrl

  if (!googleAuthUrl) {
    return NextResponse.redirect(new URL('/register', request.url))
  }

  let redirectUrl: URL

  try {
    redirectUrl = new URL(googleAuthUrl)
  } catch {
    return NextResponse.redirect(new URL('/register', request.url))
  }

  redirectUrl.searchParams.set(
    'redirect_uri',
    new URL('/profile', request.url).toString()
  )

  return NextResponse.redirect(redirectUrl)
}
