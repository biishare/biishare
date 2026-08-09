import { z } from 'zod'

import { LEVELS } from '../../constants/levels'
import { SUBJECTS } from '../../constants/subjects'
import { CURIOSITY_AREAS } from '../../constants/shorts/subjects.shorts'

const subjectIds = SUBJECTS.map((subject) => subject.id) as [string, ...string[]]
const levelIds = LEVELS.map((level) => level.id) as [string, ...string[]]
const toqueAreaIds = CURIOSITY_AREAS.map((area) => area.id) as [string, ...string[]]
const postContentTypes = ['video', 'document', 'image', 'playlist'] as const

const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value)

const requiredPages = z.preprocess(
  (value) => Number(value),
  z.number().int('Numero de paginas invalido').min(1, 'Minimo 1 pagina')
)

const optionalPages = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? undefined : Number(value)),
  z.number().int('Numero de paginas invalido').min(1, 'Minimo 1 pagina').optional()
)

const mediaItemSchema = z.object({
  title: z.string().trim().min(1, 'Titulo obrigatorio'),
  url: z.string().trim().url('Link invalido'),
  thumbnailUrl: z.string().trim().url('Miniatura invalida').optional(),
})

const documentItemSchema = mediaItemSchema.extend({
  totalPages: requiredPages,
})

const imageItemSchema = mediaItemSchema.extend({
  kind: z.literal('image').optional(),
})

const playlistItemSchema = mediaItemSchema
  .extend({
    kind: z.enum(['video', 'document']),
    totalPages: optionalPages,
  })
  .superRefine((item, ctx) => {
    if (item.kind === 'document' && !item.totalPages) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['totalPages'],
        message: 'Numero de paginas obrigatorio',
      })
    }
  })

export const postPublicationSchema = z
  .object({
    subjectIds: z
      .array(z.enum(subjectIds))
      .min(1, 'Seleciona pelo menos uma disciplina')
      .transform((values) => Array.from(new Set(values))),
    title: z.string().trim().min(1, 'Titulo obrigatorio'),
    description: z.string().trim().min(1, 'Descricao obrigatoria'),
    level: z.preprocess(emptyToUndefined, z.enum(levelIds)),
    contentType: z.preprocess(emptyToUndefined, z.enum(postContentTypes)),
    imageLink: z.string().trim().min(1, 'Imagem obrigatoria').url('Link da imagem invalido'),
    isPublished: z.boolean().default(true),
    videos: z.array(mediaItemSchema).optional(),
    documents: z.array(documentItemSchema).optional(),
    images: z.array(imageItemSchema).optional(),
    playlist: z.array(playlistItemSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.contentType === 'video') {
      data.documents = undefined
      data.images = undefined
      data.playlist = undefined

      if (!data.videos || data.videos.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['videos'],
          message: 'Adiciona um video',
        })
      }
    }

    if (data.contentType === 'document') {
      data.videos = undefined
      data.images = undefined
      data.playlist = undefined

      if (!data.documents || data.documents.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['documents'],
          message: 'Adiciona um documento',
        })
      }
    }

    if (data.contentType === 'image') {
      data.videos = undefined
      data.documents = undefined
      data.playlist = undefined

      if (!data.images || data.images.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['images'],
          message: 'Adiciona pelo menos uma imagem',
        })
      }
    }

    if (data.contentType === 'playlist') {
      data.videos = undefined
      data.documents = undefined
      data.images = undefined

      if (!data.playlist || data.playlist.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['playlist'],
          message: 'Adiciona pelo menos um item',
        })
      }
    }
  })

export const toquePublicationSchema = z
  .object({
    area: z.preprocess(emptyToUndefined, z.enum(toqueAreaIds)),
    title: z.string().trim().min(3, 'Titulo muito curto').max(80, 'Maximo 80 caracteres'),
    description: z.string().trim().min(20, 'Descricao muito curta').max(600, 'Maximo 600 caracteres'),
    mediaType: z.preprocess(emptyToUndefined, z.literal('video')),
    videoUrl: z.preprocess(emptyToUndefined, z.string().trim().url('Link do video invalido').optional()),
    imageUrl: z.preprocess(emptyToUndefined, z.string().trim().url('Link da imagem invalido').optional()),
    isPublished: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    data.imageUrl = undefined

    if (!data.videoUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['videoUrl'],
        message: 'O link do video e obrigatorio',
      })
    }
  })

export type PostPublicationFormData = z.infer<typeof postPublicationSchema>
export type ToquePublicationFormData = z.infer<typeof toquePublicationSchema>
