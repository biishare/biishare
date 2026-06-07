import { MetadataRoute } from 'next'

import { getPosts } from '../../services/post.service'
import { getShorts } from '../../services/short.service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const postsRes = await getPosts({ limit: 1000 })
  const toquesRes = await getShorts({ limit: 1000 })

  const posts = postsRes.data || []
  const toques = toquesRes.data || []

  /* ---------- STATIC PAGES ---------- */
  const staticPages = [
    '',
    '/about',
    '/faq',
    '/privacy',
    '/terms',
    '/toque',
  ]

  const staticUrls = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }))

  /* ---------- POSTS ---------- */
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/content/${post._id}`,
    lastModified: new Date(post.updatedAt),
  }))

  /* ---------- TOQUES ---------- */
  const toqueUrls = toques
    .filter((t) => t.isPublished)
    .map((toque) => ({
      url: `${baseUrl}/toque/${toque._id}`,
      lastModified: new Date(toque.updatedAt),
    }))

  return [
    ...staticUrls,
    ...postUrls,
    ...toqueUrls,
  ]
}