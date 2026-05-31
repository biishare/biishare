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

    const shorts =
        data?.data || []

    return (
        <ReelModal
            open
            items={shorts}
            selectedIndex={shorts.findIndex(x => x._id === params.id)}
            useRouterNav
            onClose={() => { }}
        />
    )
}