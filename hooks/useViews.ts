'use client'

import { useEffect, useState } from 'react'

export function useViews(postId: string) {
  const [views, setViews] = useState(0)

  useEffect(() => {
    fetch('/api/view')
      .then(res => res.json())
      .then(data => setViews(data[postId] || 0))
  }, [postId])

  return views
}