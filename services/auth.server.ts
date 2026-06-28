import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getLoginRedirectPath } from '../constants/features'
import type { AuthUser } from './auth.service'

export async function getRequiredServerUser(): Promise<AuthUser> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

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
