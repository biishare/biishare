export type ToqueArea =
  | 'biologia'
  | 'matematica'
  | 'fisica'
  | 'quimica'

type ToqueVideo = {
  mediaType: 'video'
  videoUrl: string
  imageUrl?: never
}

type ToqueImage = {
  mediaType: 'image'
  imageUrl: string
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

export type CreateToquePayload = {
  area: ToqueArea
  title: string
  description: string
  mediaType: 'video'
  videoUrl: string
  isPublished?: boolean
}

export type UpdateToquePayload = Partial<CreateToquePayload>
