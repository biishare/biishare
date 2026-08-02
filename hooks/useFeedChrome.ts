'use client'

import { useEffect, useState } from 'react'

export const FEED_HEADER_HEIGHT = 64

const KEEP_HEADER_VISIBLE_UNTIL = FEED_HEADER_HEIGHT + 32
const IGNORE_SCROLL_DELTA = 2
const HIDE_HEADER_SCROLL_DISTANCE = 18
const SHOW_HEADER_SCROLL_DISTANCE = 36

export function useFeedChrome() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

  useEffect(() => {
    let lastScrollY = Math.max(window.scrollY, 0)
    let scrollDownDistance = 0
    let scrollUpDistance = 0
    let frame = 0
    let visible = lastScrollY <= KEEP_HEADER_VISIBLE_UNTIL

    const setVisible = (nextVisible: boolean) => {
      if (visible === nextVisible) return

      visible = nextVisible
      setIsHeaderVisible(nextVisible)
    }

    setIsHeaderVisible(visible)

    const update = () => {
      const currentScrollY = Math.max(window.scrollY, 0)
      const delta = currentScrollY - lastScrollY

      if (currentScrollY <= KEEP_HEADER_VISIBLE_UNTIL) {
        scrollDownDistance = 0
        scrollUpDistance = 0
        setVisible(true)
      } else if (Math.abs(delta) >= IGNORE_SCROLL_DELTA) {
        if (delta > 0) {
          scrollDownDistance += delta
          scrollUpDistance = 0

          if (scrollDownDistance >= HIDE_HEADER_SCROLL_DISTANCE) {
            setVisible(false)
          }
        } else {
          scrollUpDistance -= delta
          scrollDownDistance = 0

          if (scrollUpDistance >= SHOW_HEADER_SCROLL_DISTANCE) {
            setVisible(true)
          }
        }
      }

      lastScrollY = currentScrollY
      frame = 0
    }

    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)

      if (frame) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  return {
    filterTop: isHeaderVisible ? FEED_HEADER_HEIGHT : 0,
    isHeaderVisible,
  }
}
