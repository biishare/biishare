import { NextRequest, NextResponse } from 'next/server'
import {
  AUTH_PAGES_AVAILABLE,
  getPostAuthRedirectPath,
} from '../../../../../constants/features'
import { resolveRequestApiBaseUrl } from '../../../../../lib/api-base-url'

const DEFAULT_FACEBOOK_AUTH_PATH = '/auth/facebook'

function getProviderConfigErrorUrl(request: NextRequest) {
  const url = new URL('/login', request.url)
  url.searchParams.set('auth_error', 'provider_not_configured')
  return url
}

export function GET(request: NextRequest) {
  if (!AUTH_PAGES_AVAILABLE) {
    return new NextResponse(null, { status: 404 })
  }

  const configuredUrl = process.env.NEXT_PUBLIC_FACEBOOK_AUTH_URL
  const apiBaseUrl = resolveRequestApiBaseUrl(request.url)
  const fallbackUrl = apiBaseUrl
    ? new URL(DEFAULT_FACEBOOK_AUTH_PATH, apiBaseUrl).toString()
    : null

  const facebookAuthUrl = configuredUrl || fallbackUrl

  if (!facebookAuthUrl) {
    return NextResponse.redirect(getProviderConfigErrorUrl(request))
  }

  let redirectUrl: URL

  try {
    redirectUrl = new URL(facebookAuthUrl)
  } catch {
    return NextResponse.redirect(getProviderConfigErrorUrl(request))
  }

  redirectUrl.searchParams.set(
    'redirect_uri',
    new URL(getPostAuthRedirectPath(), request.url).toString()
  )

  return NextResponse.redirect(redirectUrl)
}
