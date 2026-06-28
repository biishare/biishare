import { Metadata } from 'next'

import { getPostById } from '../../../services/post.service'
import { PostDTO } from '../../../types/post' 

import { createMetadata }
from '@/MetaData/baseMetadata'

const DEFAULT_OG_IMAGE = '/placeholder.jpg'

interface ContentPageProps {
  params: {
    idPost: string
  }
}

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata> {

  const { idPost } = params

  let post: PostDTO | null = null

  try {
    post = await getPostById(idPost)
  } catch {
    post = null
  }

  // POST NÃO ENCONTRADO
  if (!post) {
    return createMetadata({
      title: 'Conteúdo não encontrado | Biishare',
      description:
        'O conteúdo solicitado não foi encontrado ou não está disponível.',
      path: `/content/${idPost}`,
      type: 'article',
    })
  }

  const ogImage =
    post.imageLink || DEFAULT_OG_IMAGE

  const description =
    post.description ||
    post.title ||
    'Leia este conteúdo na Biishare'

  // POST ENCONTRADO
  return createMetadata({
    title: `${post.title} | Biishare`,
    description,
    image: ogImage,
    path: `/content/${idPost}`,
    type: 'article',
  })
}
