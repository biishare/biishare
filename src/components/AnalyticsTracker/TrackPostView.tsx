'use client'

import { useEffect } from 'react'
import { gaEvent } from '../../../lib/analytics'

export function TrackPostView({
  postId,
  title,
}: {
  postId: string
  title: string
}) {
  useEffect(() => {
    gaEvent('view_post', {
      post_id: postId,
      post_title: title,
    })
  }, [postId, title])

  return null
}