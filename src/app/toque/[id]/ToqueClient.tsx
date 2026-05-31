'use client'

import { ToquesCard } from '@/components/Toque/Toques'

export default function ToqueClient({ item }: any) {
  return (
    <ToquesCard
      item={item}
      pageToque
      sx={{
        minHeight: '100vh',
        maxWidth: 520,
        mx: 'auto',
        background: '#000',
      }}
    />
  )
}