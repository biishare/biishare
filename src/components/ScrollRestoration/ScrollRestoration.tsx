'use client'

import {
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  usePathname,
  useSearchParams,
} from 'next/navigation'

const SCROLL_KEY_PREFIX = 'biishare-scroll'
const RESTORE_ATTEMPTS = 45
const RESTORE_DELAY_MS = 80

function getPageHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  )
}

function getMaxScrollY() {
  return Math.max(0, getPageHeight() - window.innerHeight)
}

function readSavedScroll(key: string) {
  try {
    const saved = sessionStorage.getItem(key)
    if (!saved) return null

    const value = Number(saved)
    return Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}

function saveScroll(key: string) {
  try {
    sessionStorage.setItem(key, String(window.scrollY))
  } catch { }
}

export default function ScrollRestoration() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const frameRef = useRef<number | null>(null)
  const scrollKeyRef = useRef<string | null>(null)
  const restoringRef = useRef(false)

  const scrollKey = useMemo(() => {
    const query = searchParams.toString()
    return `${SCROLL_KEY_PREFIX}:${pathname}${query ? `?${query}` : ''}`
  }, [pathname, searchParams])

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return

    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  useEffect(() => {
    scrollKeyRef.current = scrollKey
  }, [scrollKey])

  useEffect(() => {
    const saveActiveRouteScroll = () => {
      if (scrollKeyRef.current) {
        saveScroll(scrollKeyRef.current)
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      saveActiveRouteScroll()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return

      saveActiveRouteScroll()
    }

    window.addEventListener('pointerdown', handlePointerDown, {
      capture: true,
      passive: true,
    })
    window.addEventListener('keydown', handleKeyDown, { capture: true })
    window.addEventListener('popstate', saveActiveRouteScroll, {
      capture: true,
    })

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, {
        capture: true,
      })
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      window.removeEventListener('popstate', saveActiveRouteScroll, {
        capture: true,
      })
    }
  }, [])

  useEffect(() => {
    if (!scrollKey) return

    let cancelled = false
    let retryTimer: number | null = null

    const saveCurrentScroll = () => saveScroll(scrollKey)
    const savedScroll = readSavedScroll(scrollKey)
    restoringRef.current = savedScroll !== null

    const finishRestore = () => {
      restoringRef.current = false
    }

    const restore = (attempt = 0) => {
      if (cancelled || savedScroll === null) {
        finishRestore()
        return
      }

      const maxScrollY = getMaxScrollY()
      const canReachSavedScroll = maxScrollY >= Math.max(savedScroll - 8, 0)

      if (canReachSavedScroll || attempt >= RESTORE_ATTEMPTS) {
        window.scrollTo({
          top: Math.min(savedScroll, maxScrollY),
          behavior: 'auto',
        })
        finishRestore()
        return
      }

      retryTimer = window.setTimeout(() => {
        window.requestAnimationFrame(() => restore(attempt + 1))
      }, RESTORE_DELAY_MS)
    }

    const scheduleSave = () => {
      if (restoringRef.current || frameRef.current !== null) return

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        saveCurrentScroll()
      })
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => restore())
    })

    window.addEventListener('scroll', scheduleSave, { passive: true })
    window.addEventListener('pagehide', saveCurrentScroll)

    return () => {
      cancelled = true

      if (retryTimer !== null) {
        window.clearTimeout(retryTimer)
      }

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      saveCurrentScroll()
      window.removeEventListener('scroll', scheduleSave)
      window.removeEventListener('pagehide', saveCurrentScroll)
    }
  }, [scrollKey])

  return null
}
