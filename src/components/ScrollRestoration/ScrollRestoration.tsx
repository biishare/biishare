'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return

    const key = `scroll-${pathname}`

    // 🔥 RESTAURAÇÃO (com delay real de layout)
    const restore = () => {
      const saved = sessionStorage.getItem(key)

      if (saved) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, Number(saved))
          })
        })
      }
    }

    restore()

    // 🔥 SALVAR scroll continuamente
    const handleScroll = () => {
      sessionStorage.setItem(key, String(window.scrollY))
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  return null
}