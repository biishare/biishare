import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { AuthUser } from './auth.service'

export async function getRequiredServerUser(): Promise<AuthUser> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!apiBaseUrl) {
    redirect('/login')
  }

  const cookieHeader = cookies().toString()

  if (!cookieHeader) {
    redirect('/login')
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
    redirect('/login')
  }

  if (!response.ok) {
    redirect('/login')
  }

  const data = (await response.json()) as { user: AuthUser }
  return data.user
}
