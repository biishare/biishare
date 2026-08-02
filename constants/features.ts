export const PROFILE_PAGE_AVAILABLE = true
export const AUTH_PAGES_AVAILABLE = true

export function getLoginRedirectPath() {
  return AUTH_PAGES_AVAILABLE ? '/login' : '/toque'
}

export function getPostAuthRedirectPath(username?: string | null) {
  if (!PROFILE_PAGE_AVAILABLE) {
    return '/toque'
  }

  return username ? `/profile/${username}` : '/profile'
}
