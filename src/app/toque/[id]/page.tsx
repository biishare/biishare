'use client'

import { useQuery } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

import { ToquesCard } from '@/components/Toque/Toques'
import { getShorts } from '../../../../services/short.service'



interface Props {
  params: {
    id: string
  }
}

export default function ToquePage({
  params,
}: Props) {

  const { data, isLoading } = useQuery({
    queryKey: ['shorts'],
    queryFn: () =>
      getShorts({
        page: 1,
        limit: 50,
      }),
  })

  const item = data?.data?.find(
    (short: any) =>
      short._id === params.id
  )

  if (isLoading) {
    return null
  }

  if (!item) {
    notFound()
  }

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