
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
  area: ToqueArea
  title: string
  description: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
} & (ToqueVideo | ToqueImage)