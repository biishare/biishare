import { Metadata } from 'next'

import { getToqueById } from '../../../services/short.service'
import { Toque } from '../../../types/Toque'

import { createMetadata } from '@/MetaData/baseMetadata'

const DEFAULT_OG_IMAGE = '/placeholder.jpg'

interface ToquePageProps {
  params: {
    idToque: string
  }
}

export async function generateMetadata({
  params,
}: ToquePageProps): Promise<Metadata> {

  const { idToque } = params

  let toque: Toque | null = null

  try {
    toque = await getToqueById(idToque)
  } catch {
    toque = null
  }

  // TOQUE NÃO ENCONTRADO
  if (!toque) {
    return createMetadata({
      title: 'Toque não encontrado | Biishare',
      description:
        'O Toque solicitado não foi encontrado ou não está disponível.',
      path: `/toques/${idToque}`,
      type: 'article',
    })
  }

  // 🔥 imagem correta baseada no teu type
  const ogImage =
    toque.mediaType === 'image'
      ? toque.imageUrl
      : DEFAULT_OG_IMAGE

  const description =
    toque.description ||
    toque.title ||
    'Leia este Toque na Biishare'

  // TOQUE ENCONTRADO
  return createMetadata({
    title: `${toque.title} | Biishare`,
    description,
    image: ogImage,
    path: `/toques/${idToque}`,
    type: 'article',
  })
}