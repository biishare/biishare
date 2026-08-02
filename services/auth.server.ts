import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getLoginRedirectPath } from '../constants/features'
import {
  getHostnameFromHostHeader,
  resolveApiBaseUrl,
} from '../lib/api-base-url'
import type { AuthUser } from './auth.service'

export async function getRequiredServerUser(): Promise<AuthUser> {
  const apiBaseUrl = resolveApiBaseUrl(
    getHostnameFromHostHeader(headers().get('host'))
  )

  if (!apiBaseUrl) {
    redirect(getLoginRedirectPath())
  }

  const cookieHeader = cookies().toString()

  if (!cookieHeader) {
    redirect(getLoginRedirectPath())
  }

  let response: Response

  try {
    response = await fetch(new URL('/auth/me', apiBaseUrl).toString(), {
      cache: 'no-store',
      headers: {
        cookie: cookieHeader,
      },
    })
  } catch {
    redirect(getLoginRedirectPath())
  }

  if (!response.ok) {
    redirect(getLoginRedirectPath())
  }

  const data = (await response.json()) as { user: AuthUser }
  return data.user
}
