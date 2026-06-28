import { NextRequest, NextResponse } from 'next/server'
import {
  AUTH_PAGES_AVAILABLE,
  getPostAuthRedirectPath,
} from '../../../../../constants/features'

const DEFAULT_GOOGLE_AUTH_PATH = '/auth/google'

export function GET(request: NextRequest) {
  if (!AUTH_PAGES_AVAILABLE) {
    return new NextResponse(null, { status: 404 })
  }

  const configuredUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const fallbackUrl = apiBaseUrl
    ? new URL(DEFAULT_GOOGLE_AUTH_PATH, apiBaseUrl).toString()
    : null

  const googleAuthUrl = configuredUrl || fallbackUrl

  if (!googleAuthUrl) {
    return NextResponse.redirect(new URL('/toque', request.url))
  }

  let redirectUrl: URL

  try {
    redirectUrl = new URL(googleAuthUrl)
  } catch {
    return NextResponse.redirect(new URL('/toque', request.url))
  }

  redirectUrl.searchParams.set(
    'redirect_uri',
    new URL(getPostAuthRedirectPath(), request.url).toString()
  )

  return NextResponse.redirect(redirectUrl)
}
