export const PROFILE_PAGE_AVAILABLE = false
export const AUTH_PAGES_AVAILABLE = false

export function getLoginRedirectPath() {
  return AUTH_PAGES_AVAILABLE ? '/login' : '/toque'
}

export function getPostAuthRedirectPath(username?: string | null) {
  if (!PROFILE_PAGE_AVAILABLE) {
    return '/toque'
  }

  return username ? `/profile/${username}` : '/profile'
}
