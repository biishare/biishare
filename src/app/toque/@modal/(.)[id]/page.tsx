import { Metadata } from 'next'

import { getToqueMetadata } from '@/MetaData/pages/toque'

import ModalPage from './ModalClient'

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

export default function Page({
  params,
}: Props) {
  return <ModalPage params={params} />
}