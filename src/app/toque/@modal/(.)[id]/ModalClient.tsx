'use client'

import { useQuery } from '@tanstack/react-query'
import ReelModal from '@/components/Modal/Toque'
import { getShorts } from '../../../../../services/short.service'

interface Props {
  params: {
    id: string
  }
}

export default function ModalPage({
  params,
}: Props) {
  const { data } = useQuery({
    queryKey: ['shorts'],
    queryFn: () =>
      getShorts({
        page: 1,
        limit: 50,
      }),
  })

  const shorts = data?.data || []
  const selectedIndex = shorts.findIndex(
    x => x._id === params.id,
  )

  return (
    <ReelModal
      open
      items={shorts}
      selectedIndex={selectedIndex >= 0 ? selectedIndex : 0}
      useRouterNav
      onClose={() => {}}
    />
  )
}
