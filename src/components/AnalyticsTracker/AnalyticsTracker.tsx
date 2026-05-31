'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { GA_ID } from '../../../lib/analytics'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!window.gtag) return

    window.gtag('config', GA_ID, {
      page_path: pathname,
    })
  }, [pathname])

  return null
}