// seo/toqueMetadata.ts

import { Metadata } from 'next'

import { getToqueById } from '../../../services/short.service'
import { Toque } from '../../../types/Toque'

import { createMetadata } from '@/MetaData/baseMetadata'

const DEFAULT_OG_IMAGE = '/placeholder.jpg'

export async function getToqueMetadata(
  id: string,
): Promise<Metadata> {
  let toque: Toque | null = null

  try {
    toque = await getToqueById(id)
  } catch {
    toque = null
  }

  if (!toque) {
    return createMetadata({
      title: 'Toque não encontrado | Biishare',
      description:
        'O Toque solicitado não foi encontrado ou não está disponível.',
      path: `/toques/${id}`,
      type: 'article',
    })
  }

  const ogImage =
    toque.mediaType === 'image'
      ? toque.imageUrl
      : DEFAULT_OG_IMAGE

  const description =
    toque.description ||
    toque.title ||
    'Leia este Toque na Biishare'

  return createMetadata({
    title: `${toque.title} | Biishare`,
    description,
    image: ogImage,
    path: `/toques/${id}`,
    type: 'article',
  })
}