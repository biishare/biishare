'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import ReelModal from '@/components/Modal/Toque'
import { Toque } from '../../../../types/Toque'
import { getShorts } from '../../../../services/short.service'

interface Props {
  item: Toque
}

export default function ToqueClient({ item }: Props) {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { data } = useQuery({
    queryKey: ['shorts', 'detail-context'],
    queryFn: () =>
      getShorts({
        page: 1,
        limit: 50,
      }),
    staleTime: 1000 * 60 * 5,
  })

  const items = useMemo(() => {
    const list = data?.data || []
    const hasCurrent = list.some(short => short._id === item._id)

    return hasCurrent ? list : [item, ...list]
  }, [data, item])

  useEffect(() => {
    const currentIndex = items.findIndex(short => short._id === item._id)
    setSelectedIndex(currentIndex >= 0 ? currentIndex : 0)
  }, [items, item._id])

  const handleChangeIndex = (index: number) => {
    const nextItem = items[index]
    if (!nextItem) return

    setSelectedIndex(index)
    router.replace(`/toque/${nextItem._id}`, {
      scroll: false,
    })
  }

  return (
    <ReelModal
      open
      items={items}
      selectedIndex={selectedIndex}
      onChangeIndex={handleChangeIndex}
      onClose={() => router.push('/toque')}
    />
  )
}
