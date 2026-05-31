import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getToqueById } from '../../../../services/short.service'
import ToqueClient from './ToqueClient'
import { getToqueMetadata } from '@/MetaData/pages/toque'

interface Props {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  return getToqueMetadata(params.id)
}

export default async function Page({ params }: Props) {
  const toque = await getToqueById(params.id)

  if (!toque) {
    notFound()
  }

  return <ToqueClient item={toque} />
}