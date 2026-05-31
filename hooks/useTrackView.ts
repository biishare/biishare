'use client'

import { useEffect } from 'react'

export function useTrackView(postId: string) {
  useEffect(() => {
    fetch('/api/view', {
      method: 'POST',
      body: JSON.stringify({ postId }),
    })
  }, [postId])
}