export type ToqueArea =
  | 'biologia'
  | 'matematica'
  | 'fisica'
  | 'quimica'

export type ToqueImageItem = {
  url: string
}

type ToqueVideo = {
  mediaType: 'video'
  videoUrl: string
  imageUrl?: never
  imageUrls?: never
  images?: never
}

type ToqueImage = {
  mediaType: 'image'
  imageUrl: string
  imageUrls?: string[]
  images?: ToqueImageItem[]
  videoUrl?: never
}

export type Toque = {
  _id: string
  creatorId?: string
  area: ToqueArea
  title: string
  description: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
} & (ToqueVideo | ToqueImage)

export type SavedToqueDTO = {
  id: string
  savedAt: string
  toque: Toque
}

export type SavedToquesResponse = {
  data: SavedToqueDTO[]
  page?: number
  limit?: number
  total?: number
  totalPages?: number
}

type ToquePayloadBase = {
  area: ToqueArea
  title: string
  description: string
  isPublished?: boolean
}

export type CreateToquePayload = ToquePayloadBase & (
  | {
      mediaType: 'video'
      videoUrl: string
      imageUrl?: never
      imageUrls?: never
      images?: never
    }
  | {
      mediaType: 'image'
      imageUrl: string
      imageUrls?: string[]
      images?: ToqueImageItem[]
      videoUrl?: never
    }
)

export type UpdateToquePayload = Partial<ToquePayloadBase> & {
  mediaType?: 'video' | 'image'
  videoUrl?: string
  imageUrl?: string
  imageUrls?: string[]
  images?: ToqueImageItem[]
}