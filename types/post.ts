/* ---------- MEDIA ---------- */

export type PostContentType = 'video' | 'document' | 'image' | 'playlist'
export type MediaKind = 'video' | 'document' | 'image'
export type PlaylistMediaKind = 'video' | 'document'

export type MediaItem = {
  title: string
  url: string
  thumbnailUrl?: string
  kind?: MediaKind | PlaylistMediaKind
  totalPages?: number
}

/* ---------- CREATOR ---------- */

export type PostCreatorDTO = {
  id: string
  name: string
  username?: string
  avatarUrl?: string
  email?: string
}

/* ---------- POST ---------- */

export type PostDTO = {
  _id: string
  creatorId?: string
  creator?: PostCreatorDTO
  subjectId?: string
  subjectIds: string[]
  title: string
  description: string
  level: string
  contentType: PostContentType
  imageLink: string
  isPublished?: boolean
  playlistTitle?: string
  playlistOrder?: number

  videos?: MediaItem[]
  documents?: MediaItem[]
  images?: MediaItem[]
  playlist?: MediaItem[]

  createdAt: string
  updatedAt: string
}

export type SavedPostDTO = {
  id: string
  savedAt: string
  post: PostDTO
}

export type SavedPostsResponse = {
  data: SavedPostDTO[]
  page?: number
  limit?: number
  total?: number
  totalPages?: number
}

/* ---------- FILTERS ---------- */

export type PostFiltersResponse = {
  subjects: string[]
  levels: string[]
  contentTypes: PostContentType[]
}

export type CreatePostPayload = {
  subjectIds: string[]
  title: string
  description: string
  level: string
  contentType: PostContentType
  imageLink: string
  isPublished?: boolean
  playlistTitle?: string
  playlistOrder?: number
  videos?: MediaItem[]
  documents?: MediaItem[]
  images?: MediaItem[]
  playlist?: MediaItem[]
}

export type UpdatePostPayload = Partial<CreatePostPayload>
