import { Suspense } from 'react'
import FeedClient from './FeedClient'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FeedClient />
    </Suspense>
  )
}