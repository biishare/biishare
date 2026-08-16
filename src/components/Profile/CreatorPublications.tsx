'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import {
  ChevronDown,
  FileCheck,
  FileText,
  Globe2,
  ImageIcon,
  ListVideo,
  LockKeyhole,
  MoreVertical,
  Pencil,
  PlayCircle,
  Plus,
  Tag,
  Trash2,
  UploadCloud,
  Video,
  X,
} from 'lucide-react'

import { CURIOSITY_AREAS } from '../../../constants/shorts/subjects.shorts'
import { LEVELS } from '../../../constants/levels'
import { SUBJECTS } from '../../../constants/subjects'
import {
  createPost,
  deletePost,
  getMyPosts,
  updatePost,
  uploadPublicationMedia,
} from '../../../services/post.service'
import {
  createToque,
  deleteToque,
  getMyToques,
  updateToque,
} from '../../../services/short.service'
import type { AuthUser } from '../../../services/auth.service'
import type { CreatePostPayload, MediaItem, PostDTO } from '../../../types/post'
import type { CreateToquePayload, Toque } from '../../../types/Toque'
import { postPublicationSchema, toquePublicationSchema } from '../../../lib/validations/publication'
import { getContentTypeLabel, getLevelLabel, getSubjectLabels } from '../../../utils/labels'

const LEGACY_CREATOR_EMAIL = 'sir.a.l.marques@gmail.com'
const LEGACY_CREATOR_NAME = 'Saber Academico'
const PAGE_SIZE = 24

type ComposerMode = 'post' | 'playlist' | 'toque'
type PublicationKind = 'post' | 'toque'
type MediaCollection = 'videos' | 'documents' | 'images' | 'playlist'

type Publication =
  | { kind: 'post'; item: PostDTO }
  | { kind: 'toque'; item: Toque }

type PostFormState = {
  subjectIds: string[]
  title: string
  description: string
  level: string
  isPublished: boolean
  contentType: '' | 'video' | 'document' | 'image' | 'playlist'
  imageLink: string
  videos: MediaItem[]
  documents: MediaItem[]
  images: MediaItem[]
  playlist: MediaItem[]
}

type ToqueFormState = {
  area: string
  title: string
  description: string
  isPublished: boolean
  mediaType: '' | 'video' | 'image'
  videoUrl: string
  imageUrl: string
  images: MediaItem[]
}

type EditingState =
  | { kind: 'post'; item: PostDTO }
  | { kind: 'toque'; item: Toque }
  | null

type DeleteTarget = EditingState

type FieldErrors = Record<string, string>

const emptyVideo = (): MediaItem => ({ kind: 'video', title: '', url: '' })
const emptyDocument = (): MediaItem => ({ kind: 'document', title: '', url: '', totalPages: 1 })
const emptyImage = (): MediaItem => ({ kind: 'image', title: '', url: '' })
const emptyPlaylistVideo = (): MediaItem => ({ kind: 'video', title: '', url: '' })
const emptyPlaylistDocument = (): MediaItem => ({ kind: 'document', title: '', url: '', totalPages: 1 })

const getEmptyPostForm = (contentType: PostFormState['contentType'] = ''): PostFormState => ({
  subjectIds: [],
  title: '',
  description: '',
  level: '',
  isPublished: true,
  contentType,
  imageLink: '',
  videos: [emptyVideo()],
  documents: [emptyDocument()],
  images: [emptyImage()],
  playlist: [emptyPlaylistVideo()],
})

const getEmptyToqueForm = (): ToqueFormState => ({
  area: '',
  title: '',
  description: '',
  isPublished: true,
  mediaType: '',
  videoUrl: '',
  imageUrl: '',
  images: [],
})

export default function CreatorPublications({ authUser }: { authUser: AuthUser }) {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<ComposerMode>('post')
  const [choiceOpen, setChoiceOpen] = useState(false)
  const [composerOpen, setComposerOpen] = useState(false)
  const [postForm, setPostForm] = useState<PostFormState>(getEmptyPostForm)
  const [toqueForm, setToqueForm] = useState<ToqueFormState>(getEmptyToqueForm)
  const [postErrors, setPostErrors] = useState<FieldErrors>({})
  const [toqueErrors, setToqueErrors] = useState<FieldErrors>({})
  const [editing, setEditing] = useState<EditingState>(null)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const isCreator = authUser.isCreator || authUser.creatorStatus === 'approved'
  const isCompactComposer = useMediaQuery('(max-width: 640px)')

  const postsQuery = useQuery({
    queryKey: ['creator-posts', authUser.id],
    queryFn: () => getMyPosts({ limit: PAGE_SIZE }),
    enabled: isCreator,
  })

  const toquesQuery = useQuery({
    queryKey: ['creator-toques', authUser.id],
    queryFn: () => getMyToques({ limit: PAGE_SIZE }),
    enabled: isCreator,
  })

  const publications = useMemo<Publication[]>(() => {
    const posts = (postsQuery.data?.data ?? []).map((item) => ({ kind: 'post' as const, item }))
    const toques = (toquesQuery.data?.data ?? []).map((item) => ({ kind: 'toque' as const, item }))

    return [...posts, ...toques].sort(
      (a, b) => new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime()
    )
  }, [postsQuery.data?.data, toquesQuery.data?.data])

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => handleMutationSuccess('Post publicado.', 'post'),
    onError: () => setFeedback({ type: 'error', message: 'Nao foi possivel publicar o post.' }),
  })

  const createPlaylistMutation = useMutation({
    mutationFn: async (payloads: CreatePostPayload[]) => Promise.all(payloads.map((payload) => createPost(payload))),
    onSuccess: (items) => handleMutationSuccess(`${items.length} itens da playlist publicados.`, 'post'),
    onError: () => setFeedback({ type: 'error', message: 'Nao foi possivel publicar a playlist.' }),
  })

  const updatePostMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreatePostPayload }) => updatePost(id, payload),
    onSuccess: () => handleMutationSuccess('Post atualizado.', 'post'),
    onError: () => setFeedback({ type: 'error', message: 'Nao foi possivel atualizar o post.' }),
  })

  const createToqueMutation = useMutation({
    mutationFn: async (payload: CreateToquePayload | CreateToquePayload[]) => {
      if (Array.isArray(payload)) {
        return Promise.all(payload.map((item) => createToque(item)))
      }

      return createToque(payload)
    },
    onSuccess: (result) => {
      const count = Array.isArray(result) ? result.length : 1
      handleMutationSuccess(count > 1 ? count + ' Toques publicados.' : 'Toque publicado.', 'toque')
    },
    onError: () => setFeedback({ type: 'error', message: 'Nao foi possivel publicar o toque.' }),
  })

  const updateToqueMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateToquePayload }) => updateToque(id, payload),
    onSuccess: () => handleMutationSuccess('Toque atualizado.', 'toque'),
    onError: () => setFeedback({ type: 'error', message: 'Nao foi possivel atualizar o toque.' }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (target: Exclude<DeleteTarget, null>) => {
      if (target.kind === 'post') {
        await deletePost(target.item._id)
        return 'post' as const
      }

      await deleteToque(target.item._id)
      return 'toque' as const
    },
    onSuccess: (kind) => {
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: [kind === 'post' ? 'creator-posts' : 'creator-toques'] })
      setFeedback({ type: 'success', message: kind === 'post' ? 'Post apagado.' : 'Toque apagado.' })
    },
    onError: () => setFeedback({ type: 'error', message: 'Nao foi possivel apagar esta publicacao.' }),
  })

  function handleMutationSuccess(message: string, kind: PublicationKind) {
    queryClient.invalidateQueries({ queryKey: [kind === 'post' ? 'creator-posts' : 'creator-toques'] })
    setFeedback({ type: 'success', message })
    setEditing(null)
    setComposerOpen(false)
    setChoiceOpen(false)

    if (kind === 'post') {
      setPostForm(getEmptyPostForm())
      setPostErrors({})
      return
    }

    setToqueForm(getEmptyToqueForm())
    setToqueErrors({})
  }

  const isSaving =
    createPostMutation.isPending ||
    createPlaylistMutation.isPending ||
    updatePostMutation.isPending ||
    createToqueMutation.isPending ||
    updateToqueMutation.isPending

  const handleSubmitPost = () => {
    const formForSubmit = normalizePostFormForSubmit(applyAutoPostTitle(postForm, mode))
    const raw = {
      ...formForSubmit,
      videos: formForSubmit.contentType === 'video' ? cleanMediaItems(formForSubmit.videos).slice(0, 1) : [],
      documents: formForSubmit.contentType === 'document' ? cleanDocumentItems(formForSubmit.documents).slice(0, 1) : [],
      images: formForSubmit.contentType === 'image' ? cleanImageItems(formForSubmit.images) : [],
      playlist: formForSubmit.contentType === 'playlist' ? cleanPlaylistItems(formForSubmit.playlist) : [],
    }
    const parsed = postPublicationSchema.safeParse(raw)

    if (!parsed.success) {
      setPostErrors(toFieldErrors(parsed.error.flatten().fieldErrors))
      return
    }

    setPostErrors({})

    if (!editing && parsed.data.contentType === 'playlist') {
      createPlaylistMutation.mutate(buildPlaylistItemPayloads(parsed.data))
      return
    }

    const payload: CreatePostPayload = {
      subjectIds: parsed.data.subjectIds,
      title: parsed.data.title,
      description: parsed.data.description,
      level: parsed.data.level,
      contentType: parsed.data.contentType,
      imageLink: parsed.data.imageLink,
      isPublished: parsed.data.isPublished,
    }

    if (parsed.data.contentType === 'video') {
      payload.videos = parsed.data.videos ?? []
    }

    if (parsed.data.contentType === 'document') {
      payload.documents = parsed.data.documents ?? []
    }

    if (parsed.data.contentType === 'image') {
      payload.images = parsed.data.images ?? []
    }

    if (parsed.data.contentType === 'playlist') {
      payload.playlist = parsed.data.playlist ?? []
    }

    if (editing?.kind === 'post') {
      updatePostMutation.mutate({ id: editing.item._id, payload })
      return
    }

    createPostMutation.mutate(payload)
  }

  const handleSubmitToque = () => {
    const imageItems = cleanImageItems(toqueForm.images)
    const mediaType = toqueForm.mediaType || (toqueForm.videoUrl ? 'video' : imageItems.length ? 'image' : '')
    const formForSubmit = {
      ...toqueForm,
      title: toqueForm.title.trim() || getAutoToqueTitle(toqueForm),
      mediaType,
      imageUrl: toqueForm.imageUrl || imageItems[0]?.url || '',
      images: imageItems,
    }
    const parsed = toquePublicationSchema.safeParse(formForSubmit)

    if (!parsed.success) {
      setToqueErrors(toFieldErrors(parsed.error.flatten().fieldErrors))
      return
    }

    setToqueErrors({})

    const basePayload = {
      area: parsed.data.area as CreateToquePayload['area'],
      title: parsed.data.title,
      description: parsed.data.description,
      isPublished: parsed.data.isPublished,
    }

    if (parsed.data.mediaType === 'video') {
      const payload: CreateToquePayload = {
        ...basePayload,
        mediaType: 'video',
        videoUrl: parsed.data.videoUrl ?? '',
      }

      if (editing?.kind === 'toque') {
        updateToqueMutation.mutate({ id: editing.item._id, payload })
        return
      }

      createToqueMutation.mutate(payload)
      return
    }

    const imagePayloads = (parsed.data.images?.length
      ? parsed.data.images
      : [{ kind: 'image' as const, title: parsed.data.title, url: parsed.data.imageUrl ?? '' }]
    ).map((item) => ({
      ...basePayload,
      mediaType: 'image' as const,
      imageUrl: item.url,
    }))

    if (editing?.kind === 'toque') {
      updateToqueMutation.mutate({ id: editing.item._id, payload: imagePayloads[0] })
      return
    }

    createToqueMutation.mutate(imagePayloads.length === 1 ? imagePayloads[0] : imagePayloads)
  }
  const handleEdit = (publication: Publication) => {
    setEditing(publication)
    setFeedback(null)
    setChoiceOpen(false)
    setComposerOpen(true)

    if (publication.kind === 'post') {
      const nextForm = postToForm(publication.item)
      setPostForm(nextForm)
      setMode(nextForm.contentType === 'playlist' ? 'playlist' : 'post')
      setPostErrors({})
      return
    }

    setMode('toque')
    setToqueForm(toqueToForm(publication.item))
    setToqueErrors({})
  }

  const openComposer = (nextMode: ComposerMode) => {
    setMode(nextMode)
    setEditing(null)
    setFeedback(null)
    setPostErrors({})
    setToqueErrors({})
    setChoiceOpen(false)
    setComposerOpen(true)

    if (nextMode === 'playlist') {
      setPostForm(getEmptyPostForm('playlist'))
      return
    }

    if (nextMode === 'post') {
      setPostForm(getEmptyPostForm())
      return
    }

    setToqueForm(getEmptyToqueForm())
  }

  const handleCloseComposer = () => {
    setComposerOpen(false)
    setEditing(null)
    setPostErrors({})
    setToqueErrors({})
    setPostForm(getEmptyPostForm())
    setToqueForm(getEmptyToqueForm())
  }

  if (!isCreator) {
    return (
      <Paper
        elevation={0}
        sx={{ mt: 2, border: '1px solid #e5e7eb', borderRadius: 2, p: { xs: 2, md: 2.4 }, background: '#fff' }}
      >
        <Typography fontWeight={900}>Publicacoes</Typography>
        <Typography color="text.secondary" fontSize={14} mt={0.5}>
          Quando a tua conta de criador estiver ativa, vais poder publicar posts e Toques aqui.
        </Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      {feedback && !composerOpen && (
        <Alert severity={feedback.type} onClose={() => setFeedback(null)} sx={{ mb: 1.5, borderRadius: 2 }}>
          {feedback.message}
        </Alert>
      )}

      <CreateLauncher
        authUser={authUser}
        onOpen={() => {
          setFeedback(null)
          setChoiceOpen(true)
        }}
      />

      <Paper
        elevation={0}
        sx={{ mt: 2, border: '1px solid #e5e7eb', borderRadius: 2, p: { xs: 1.5, md: 2 }, background: '#fff' }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Typography fontWeight={900}>Publicacoes</Typography>
          {(postsQuery.isLoading || toquesQuery.isLoading) && <CircularProgress size={20} />}
        </Stack>

        {(postsQuery.isError || toquesQuery.isError) && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Nao foi possivel carregar as tuas publicacoes.
          </Alert>
        )}

        {!postsQuery.isLoading && !toquesQuery.isLoading && publications.length === 0 && (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography fontWeight={850}>Ainda nao tens publicacoes.</Typography>
            <Typography color="text.secondary" fontSize={14} mt={0.5}>
              Toca no botao de adicionar para criar a primeira.
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 1.4,
          }}
        >
          {publications.map((publication) => (
            <PublicationCard
              key={`${publication.kind}-${publication.item._id}`}
              authUser={authUser}
              publication={publication}
              onDelete={setDeleteTarget}
              onEdit={handleEdit}
            />
          ))}
        </Box>
      </Paper>

      <Dialog
        open={choiceOpen}
        onClose={() => setChoiceOpen(false)}
        fullWidth
        fullScreen={isCompactComposer}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            m: { xs: 0, sm: 2 },
            height: { xs: '100dvh', sm: 'auto' },
            maxHeight: { xs: '100dvh', sm: 'calc(100% - 64px)' },
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 950, px: { xs: 1.6, sm: 3 }, py: { xs: 1.4, sm: 2 } }}>Criar</DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 }, overflowY: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 1.4,
            }}
          >
            <CreationOptionCard
              icon={<Stack direction="row" alignItems="center" gap={0.4}><PlayCircle size={25} /><ImageIcon size={24} /></Stack>}
              title="Toque"
              onClick={() => openComposer('toque')}
            />
            <CreationOptionCard
              icon={<FileText size={28} />}
              title="Post individual"
              onClick={() => openComposer('post')}
            />
            <CreationOptionCard
              icon={<ListVideo size={28} />}
              title="Playlist"
              onClick={() => openComposer('playlist')}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={composerOpen}
        onClose={handleCloseComposer}
        fullWidth
        fullScreen={isCompactComposer}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            m: { xs: 0, sm: 2 },
            width: { xs: '100vw', sm: '100%' },
            height: { xs: '100dvh', sm: 'auto' },
            maxHeight: { xs: '100dvh', sm: 'calc(100% - 64px)' },
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 950, py: { xs: 1.2, sm: 1.35 }, px: { xs: 1.4, sm: 2 }, bgcolor: '#fff' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <Typography fontWeight={950} fontSize={18} lineHeight={1.2}>
              {getComposerTitle(mode, editing)}
            </Typography>
            <IconButton aria-label="Fechar" onClick={handleCloseComposer}>
              <X size={20} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 0, overflowY: 'auto', bgcolor: '#fff' }}>
          {feedback && (
            <Alert severity={feedback.type} onClose={() => setFeedback(null)} sx={{ mb: 1.5, borderRadius: 2 }}>
              {feedback.message}
            </Alert>
          )}

          {mode === 'toque' ? (
            <ToqueComposer
              authUser={authUser}
              form={toqueForm}
              errors={toqueErrors}
              isSaving={isSaving}
              isEditing={editing?.kind === 'toque'}
              onChange={setToqueForm}
              onSubmit={handleSubmitToque}
            />
          ) : (
            <PostComposer
              authUser={authUser}
              variant={mode === 'playlist' ? 'playlist' : 'post'}
              form={postForm}
              errors={postErrors}
              isSaving={isSaving}
              isEditing={editing?.kind === 'post'}
              onChange={setPostForm}
              onSubmit={handleSubmitPost}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 900 }}>Apagar publicacao</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" fontSize={14}>
            Tens a certeza que queres apagar {deleteTarget?.kind === 'toque' ? 'este Toque' : 'este post'}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: 'none', fontWeight: 850 }}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={!deleteTarget || deleteMutation.isPending}
            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
            sx={{ textTransform: 'none', fontWeight: 900 }}
          >
            {deleteMutation.isPending ? 'A apagar...' : 'Apagar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function CreateLauncher({ authUser, onOpen }: { authUser: AuthUser; onOpen: () => void }) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        background: '#fff',
        p: { xs: 1.25, sm: 1.5 },
      }}
    >
      <Stack direction="row" alignItems="center" gap={1.2}>
        <Avatar src={authUser.avatarUrl} alt={getAuthorName(authUser)} sx={{ width: 42, height: 42 }} />
        <Button
          fullWidth
          onClick={onOpen}
          startIcon={<Plus size={20} />}
          sx={{
            justifyContent: 'flex-start',
            minHeight: 44,
            borderRadius: 999,
            px: 1.6,
            bgcolor: '#f1f5f9',
            color: '#334155',
            fontWeight: 850,
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#e2e8f0',
              color: '#111827',
            },
          }}
        >
          Criar
        </Button>
      </Stack>
    </Paper>
  )
}

function CreationOptionCard({
  icon,
  onClick,
  title,
}: {
  icon: ReactNode
  onClick: () => void
  title: string
}) {
  return (
    <Paper
      component="button"
      type="button"
      elevation={0}
      onClick={onClick}
      sx={{
        width: '100%',
        minHeight: { xs: 116, sm: 142 },
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        bgcolor: '#fff',
        color: '#0f172a',
        cursor: 'pointer',
        textAlign: 'left',
        p: { xs: 1.35, sm: 1.6 },
        transition: 'border-color .18s ease, background-color .18s ease, transform .18s ease',
        '&:hover': {
          bgcolor: '#f8fafc',
          borderColor: '#f97316',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Stack height="100%" justifyContent="space-between" gap={1.2}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 1.5,
            display: 'grid',
            placeItems: 'center',
            bgcolor: '#fff7ed',
            color: '#ea580c',
          }}
        >
          {icon}
        </Box>
        <Typography fontWeight={950} fontSize={17}>
          {title}
        </Typography>
      </Stack>
    </Paper>
  )
}

type ComposerMediaEntry = {
  collection: MediaCollection
  index: number
  item: MediaItem
}

function PostComposer({
  authUser,
  errors,
  form,
  isEditing,
  isSaving,
  onChange,
  onSubmit,
  variant,
}: {
  authUser: AuthUser
  errors: FieldErrors
  form: PostFormState
  isEditing: boolean
  isSaving: boolean
  onChange: (form: PostFormState) => void
  onSubmit: () => void
  variant: 'post' | 'playlist'
}) {
  const update = (patch: Partial<PostFormState>) => onChange({ ...form, ...patch })
  const selectedType = variant === 'playlist' ? 'playlist' : form.contentType
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [classifyOpen, setClassifyOpen] = useState(false)
  const uploadDisabled = isSaving || Boolean(uploadingKey)
  const mediaError = uploadError || errors.contentType || errors.imageLink || getMediaError(selectedType, errors)
  const entries = getUploadedMediaEntries(form, selectedType)
  const classificationLabel = getPostClassificationLabel(form)

  const toggleSubject = (subjectId: string) => {
    const subjectIds = form.subjectIds.includes(subjectId)
      ? form.subjectIds.filter((id) => id !== subjectId)
      : [...form.subjectIds, subjectId]

    update({ subjectIds })
  }

  const uploadFiles = async (files: File[], key: string) => {
    setUploadingKey(key)
    setUploadError(null)

    try {
      const uploaded = []

      for (const file of files) {
        uploaded.push(await uploadPublicationMedia(file))
      }

      return uploaded
    } catch (error) {
      setUploadError('Nao foi possivel carregar o ficheiro.')
      return []
    } finally {
      setUploadingKey(null)
    }
  }

  const handleIndividualFiles = async (files: File[]) => {
    if (files.length === 0) return

    const detectedKinds = files.map(detectLocalFileKind)

    if (detectedKinds.some((kind) => !kind)) {
      setUploadError('Escolhe uma imagem, video ou PDF.')
      return
    }

    if (files.length > 1 && detectedKinds.some((kind) => kind !== 'image')) {
      setUploadError('Post individual aceita varias imagens ou apenas um video/PDF.')
      return
    }

    const uploaded = await uploadFiles(files, 'post-file')

    if (uploaded.length === 0) return

    const first = uploaded[0]
    const items = uploaded.map(uploadToMediaItem)

    if (first.type === 'image') {
      const currentImages = form.contentType === 'image'
        ? form.images.filter((item) => item.url)
        : []

      update({
        contentType: 'image',
        images: [...currentImages, ...items],
        imageLink: form.imageLink || first.thumbnailUrl || first.url,
        title: form.title || first.title,
      })
      return
    }

    if (first.type === 'document') {
      update({
        contentType: 'document',
        documents: items,
        imageLink: first.thumbnailUrl || first.url,
        title: form.title || first.title,
      })
      return
    }

    update({
      contentType: 'video',
      videos: items,
      imageLink: first.thumbnailUrl || first.url,
      title: form.title || first.title,
    })
  }

  const handlePlaylistFiles = async (files: File[]) => {
    if (files.length === 0) return

    const detectedKinds = files.map(detectLocalFileKind)

    if (detectedKinds.some((kind) => !kind || kind === 'image')) {
      setUploadError('Playlist aceita apenas videos e PDFs.')
      return
    }

    const uploaded = await uploadFiles(files, 'playlist-file')

    if (uploaded.length === 0) return

    const currentItems = form.playlist.filter((item) => item.url)
    const uploadedItems = uploaded.map(uploadToMediaItem)
    const first = uploaded[0]

    update({
      contentType: 'playlist',
      playlist: [...currentItems, ...uploadedItems],
      imageLink: form.imageLink || first.thumbnailUrl || first.url,
      title: form.title || first.title,
    })
  }

  return (
    <>
      <Stack gap={0} minHeight={{ xs: '100%', sm: 'auto' }}>
        <Box sx={{ px: { xs: 1.6, sm: 2 }, pt: 1.7, pb: 1.35, flex: 1 }}>
          <ComposerIdentityBar
            authUser={authUser}
            isPublished={form.isPublished}
            mode={variant === 'playlist' ? 'playlist' : 'post'}
            onVisibilityChange={(isPublished) => update({ isPublished })}
          />

          <Stack gap={1} mt={1.55}>
            {variant === 'playlist' && (
              <TextField
                fullWidth
                variant="standard"
                placeholder="Titulo da playlist"
                value={form.title}
                onChange={(event) => update({ title: event.target.value })}
                error={Boolean(errors.title)}
                helperText={errors.title}
                InputProps={{ disableUnderline: true }}
                sx={{
                  '& input': {
                    fontSize: { xs: 18, sm: 19 },
                    fontWeight: 900,
                    lineHeight: 1.25,
                  },
                }}
              />
            )}
            <TextField
              fullWidth
              variant="standard"
              placeholder="Sobre o que queres partilhar?"
              value={form.description}
              onChange={(event) => update({ description: event.target.value })}
              error={Boolean(errors.description)}
              helperText={errors.description}
              multiline
              minRows={3}
              InputProps={{ disableUnderline: true }}
              sx={{
                '& textarea': {
                  fontSize: 16,
                  lineHeight: 1.45,
                },
              }}
            />
          </Stack>

          <ClassificationSummary
            error={errors.subjectIds || errors.level}
            label={classificationLabel}
            onClick={() => setClassifyOpen(true)}
          />

          <MediaPreviewStrip
            coverUrl={form.imageLink}
            entries={entries}
            onRemove={(entry) => removeMediaItem(form, onChange, entry.collection, entry.index)}
          />

          {selectedType === 'playlist' && (
            <PlaylistItemsEditor
              error={errors.playlist}
              form={form}
              onChange={onChange}
            />
          )}

          <ErrorText value={mediaError} />

          {uploadingKey && <UploadStatus label="A carregar ficheiro..." />}
        </Box>

        <Divider />

        <ComposerAddBar>
          {variant === 'post' ? (
            <>
              <InlineFileButton
                accept="image/*"
                disabled={uploadDisabled}
                icon={<ImageIcon size={20} />}
                label="Adicionar imagem"
                multiple
                onFiles={handleIndividualFiles}
              />
              <InlineFileButton
                accept="video/*"
                disabled={uploadDisabled}
                icon={<Video size={20} />}
                label="Adicionar video"
                onFiles={handleIndividualFiles}
              />
              <InlineFileButton
                accept="application/pdf"
                disabled={uploadDisabled}
                icon={<FileText size={20} />}
                label="Adicionar PDF"
                onFiles={handleIndividualFiles}
              />
            </>
          ) : (
            <>
              <InlineFileButton
                accept="video/*"
                disabled={uploadDisabled}
                icon={<Video size={20} />}
                label="Adicionar videos"
                multiple
                onFiles={handlePlaylistFiles}
              />
              <InlineFileButton
                accept="application/pdf"
                disabled={uploadDisabled}
                icon={<FileText size={20} />}
                label="Adicionar PDFs"
                multiple
                onFiles={handlePlaylistFiles}
              />
            </>
          )}
        </ComposerAddBar>

        <Box
          sx={{
            px: { xs: 1.6, sm: 2 },
            py: 1.5,
            bgcolor: '#fff',
            borderTop: { xs: '1px solid #eef2f7', sm: 'none' },
            position: { xs: 'sticky', sm: 'static' },
            bottom: 0,
            pb: { xs: 'calc(12px + env(safe-area-inset-bottom))', sm: 1.5 },
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            disabled={isSaving || Boolean(uploadingKey)}
            sx={{ minHeight: 42, bgcolor: '#2563eb', textTransform: 'none', fontWeight: 950, '&:hover': { bgcolor: '#1d4ed8' } }}
          >
            {isSaving ? 'A guardar...' : isEditing ? 'Guardar' : 'Publicar'}
          </Button>
        </Box>
      </Stack>

      <PostClassificationDialog
        errors={errors}
        form={form}
        onChange={update}
        onClose={() => setClassifyOpen(false)}
        onToggleSubject={toggleSubject}
        open={classifyOpen}
      />
    </>
  )
}

function ToqueComposer({
  authUser,
  form,
  errors,
  isEditing,
  isSaving,
  onChange,
  onSubmit,
}: {
  authUser: AuthUser
  form: ToqueFormState
  errors: FieldErrors
  isEditing: boolean
  isSaving: boolean
  onChange: (form: ToqueFormState) => void
  onSubmit: () => void
}) {
  const update = (patch: Partial<ToqueFormState>) => onChange({ ...form, ...patch })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [classifyOpen, setClassifyOpen] = useState(false)
  const areaLabel = form.area ? getAreaLabel(form.area) : ''

  const handleVideoFile = async (files: File[]) => {
    const file = files[0]

    if (!file) return

    if (detectLocalFileKind(file) !== 'video') {
      setUploadError('Escolhe um video.')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const uploaded = await uploadPublicationMedia(file)

      if (uploaded.type !== 'video') {
        setUploadError('Escolhe um video.')
        return
      }

      update({
        mediaType: 'video',
        videoUrl: uploaded.url,
        imageUrl: uploaded.thumbnailUrl || '',
        images: [],
        title: form.title || uploaded.title,
      })
    } catch (error) {
      setUploadError('Nao foi possivel carregar o video.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageFiles = async (files: File[]) => {
    if (files.length === 0) return

    if (files.some((file) => detectLocalFileKind(file) !== 'image')) {
      setUploadError('Escolhe apenas fotos.')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const uploaded = []

      for (const file of files) {
        const item = await uploadPublicationMedia(file)

        if (item.type !== 'image') {
          setUploadError('Escolhe apenas fotos.')
          return
        }

        uploaded.push(uploadToMediaItem(item))
      }

      const currentImages = form.mediaType === 'image'
        ? form.images.filter((item) => item.url)
        : []
      const nextImages = [...currentImages, ...uploaded]

      update({
        mediaType: 'image',
        videoUrl: '',
        imageUrl: nextImages[0]?.url || '',
        images: nextImages,
        title: form.title || nextImages[0]?.title || '',
      })
    } catch (error) {
      setUploadError('Nao foi possivel carregar as fotos.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeVideo = () => {
    update({ mediaType: form.images.length ? 'image' : '', videoUrl: '', imageUrl: form.images[0]?.url || '' })
  }

  const removeImage = (index: number) => {
    const nextImages = form.images.filter((_item, itemIndex) => itemIndex !== index)

    update({
      mediaType: nextImages.length ? 'image' : form.videoUrl ? 'video' : '',
      imageUrl: nextImages[0]?.url || '',
      images: nextImages,
    })
  }

  return (
    <>
      <Stack gap={0} minHeight={{ xs: '100%', sm: 'auto' }}>
        <Box sx={{ px: { xs: 1.6, sm: 2 }, pt: 1.7, pb: 1.35, flex: 1 }}>
          <ComposerIdentityBar
            authUser={authUser}
            isPublished={form.isPublished}
            mode="toque"
            onVisibilityChange={(isPublished) => update({ isPublished })}
          />

          <Stack gap={1} mt={1.55}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Sobre o que queres partilhar?"
              value={form.description}
              onChange={(event) => update({ description: event.target.value })}
              error={Boolean(errors.description)}
              helperText={errors.description}
              multiline
              minRows={4}
              InputProps={{ disableUnderline: true }}
              sx={{ '& textarea': { fontSize: 16, lineHeight: 1.45 } }}
            />
          </Stack>

          <ClassificationSummary
            error={errors.area}
            label={areaLabel}
            onClick={() => setClassifyOpen(true)}
          />

          <ToqueMediaPreview
            form={form}
            onRemoveImage={removeImage}
            onRemoveVideo={removeVideo}
          />

          <ErrorText value={uploadError || errors.videoUrl || errors.imageUrl || errors.images || errors.mediaType} />

          {isUploading && <UploadStatus label="A carregar..." />}
        </Box>

        <Divider />

        <ComposerAddBar>
          <InlineFileButton
            accept="video/*"
            disabled={isSaving || isUploading}
            icon={<Video size={20} />}
            label="Adicionar video"
            onFiles={handleVideoFile}
          />
          <InlineFileButton
            accept="image/*"
            disabled={isSaving || isUploading}
            icon={<ImageIcon size={20} />}
            label="Adicionar fotos"
            multiple
            onFiles={handleImageFiles}
          />
        </ComposerAddBar>

        <Box
          sx={{
            px: { xs: 1.6, sm: 2 },
            py: 1.5,
            bgcolor: '#fff',
            borderTop: { xs: '1px solid #eef2f7', sm: 'none' },
            position: { xs: 'sticky', sm: 'static' },
            bottom: 0,
            pb: { xs: 'calc(12px + env(safe-area-inset-bottom))', sm: 1.5 },
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            disabled={isSaving || isUploading}
            sx={{ minHeight: 44, bgcolor: '#2563eb', textTransform: 'none', fontWeight: 950, '&:hover': { bgcolor: '#1d4ed8' } }}
          >
            {isSaving ? 'A guardar...' : isEditing ? 'Guardar' : 'Publicar'}
          </Button>
        </Box>
      </Stack>

      <ToqueClassificationDialog
        errors={errors}
        form={form}
        onChange={update}
        onClose={() => setClassifyOpen(false)}
        open={classifyOpen}
      />
    </>
  )
}

function ComposerIdentityBar({
  authUser,
  isPublished,
  mode,
  onVisibilityChange,
}: {
  authUser: AuthUser
  isPublished: boolean
  mode: ComposerMode
  onVisibilityChange: (isPublished: boolean) => void
}) {
  return (
    <Stack direction="row" alignItems="center" gap={1.1}>
      <Avatar src={authUser.avatarUrl} alt={getAuthorName(authUser)} sx={{ width: 44, height: 44 }}>
        {getInitials(getAuthorName(authUser))}
      </Avatar>
      <Box minWidth={0}>
        <Typography fontWeight={950} fontSize={15.5} noWrap>
          {getAuthorName(authUser)}
        </Typography>
        <Stack direction="row" alignItems="center" gap={0.7} mt={0.45}>
          <PrivacySelector value={isPublished} onChange={onVisibilityChange} />
          <Chip
            size="small"
            label={getComposerModeLabel(mode)}
            sx={{ height: 24, borderRadius: 1, bgcolor: '#eef2ff', color: '#3730a3', fontWeight: 900 }}
          />
        </Stack>
      </Box>
    </Stack>
  )
}

function PrivacySelector({
  onChange,
  value,
}: {
  onChange: (isPublished: boolean) => void
  value: boolean
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const selectValue = (nextValue: boolean) => {
    onChange(nextValue)
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={value ? <Globe2 size={13} /> : <LockKeyhole size={13} />}
        endIcon={<ChevronDown size={13} />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          minHeight: 24,
          height: 24,
          px: 0.8,
          borderRadius: 1,
          borderColor: '#cbd5e1',
          color: '#334155',
          bgcolor: '#fff',
          textTransform: 'none',
          fontSize: 12,
          fontWeight: 900,
          '& .MuiButton-startIcon': { mr: 0.35 },
          '& .MuiButton-endIcon': { ml: 0.25 },
        }}
      >
        {value ? 'Publico' : 'Privado'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 0.6,
              minWidth: 180,
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              boxShadow: '0 18px 45px rgba(15,23,42,0.16)',
            },
          },
        }}
      >
        <MenuItem selected={value} onClick={() => selectValue(true)}>
          <ListItemIcon><Globe2 size={18} /></ListItemIcon>
          <ListItemText primary="Publico" secondary="Aparece no feed" primaryTypographyProps={{ fontWeight: 900 }} />
        </MenuItem>
        <MenuItem selected={!value} onClick={() => selectValue(false)}>
          <ListItemIcon><LockKeyhole size={18} /></ListItemIcon>
          <ListItemText primary="Privado" secondary="So no teu perfil" primaryTypographyProps={{ fontWeight: 900 }} />
        </MenuItem>
      </Menu>
    </>
  )
}

function ClassificationSummary({
  error,
  label,
  onClick,
}: {
  error?: string
  label: string
  onClick: () => void
}) {
  return (
    <Box sx={{ mt: 1.1 }}>
      {label ? (
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            minHeight: 38,
            borderTop: '1px solid #eef2f7',
            borderBottom: '1px solid #eef2f7',
            py: 0.7,
          }}
        >
          <Chip
            icon={<Tag size={15} />}
            label={label}
            sx={{
              maxWidth: 'calc(100% - 72px)',
              borderRadius: 1.3,
              bgcolor: '#f1f5f9',
              color: '#0f172a',
              fontWeight: 900,
              '& .MuiChip-icon': { color: '#2563eb' },
            }}
          />
          <Button onClick={onClick} sx={{ flexShrink: 0, textTransform: 'none', fontWeight: 900 }}>
            Editar
          </Button>
        </Paper>
      ) : (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Tag size={17} />}
          onClick={onClick}
          color={error ? 'error' : 'primary'}
          sx={{
            justifyContent: 'flex-start',
            minHeight: 40,
            borderStyle: 'dashed',
            borderColor: error ? '#ef4444' : '#cbd5e1',
            color: error ? '#dc2626' : '#334155',
            textTransform: 'none',
            fontWeight: 900,
          }}
        >
          Classificar conteudo
        </Button>
      )}
      <ErrorText value={error} />
    </Box>
  )
}

function ComposerAddBar({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={label ? 'space-between' : 'flex-end'}
      gap={1}
      sx={{ px: { xs: 1.6, sm: 2 }, py: 1.05, minHeight: 58 }}
    >
      {label && (
        <Typography fontSize={13.5} fontWeight={950} color="#0f172a">
          {label}
        </Typography>
      )}
      <Stack direction="row" alignItems="center" gap={0.4}>
        {children}
      </Stack>
    </Stack>
  )
}

function InlineFileButton({
  accept,
  disabled,
  icon,
  label,
  multiple = false,
  onFiles,
}: {
  accept: string
  disabled?: boolean
  icon: ReactNode
  label: string
  multiple?: boolean
  onFiles: (files: File[]) => void
}) {
  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          component="label"
          disabled={disabled}
          aria-label={label}
          sx={{
            width: 38,
            height: 38,
            color: disabled ? '#94a3b8' : '#2563eb',
            '&:hover': { bgcolor: '#eff6ff' },
          }}
        >
          {disabled ? <CircularProgress size={18} color="inherit" /> : icon}
          <input
            hidden
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(event) => {
              const files = Array.from(event.target.files ?? [])
              event.target.value = ''
              onFiles(files)
            }}
          />
        </IconButton>
      </span>
    </Tooltip>
  )
}

function PlaylistItemsEditor({
  error,
  form,
  onChange,
}: {
  error?: string
  form: PostFormState
  onChange: (form: PostFormState) => void
}) {
  const items = form.playlist.filter((item) => item.url)

  if (items.length === 0) return null

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 1.15,
        border: '1px solid #e2e8f0',
        borderRadius: 1.4,
        p: 1,
        bgcolor: '#fff',
      }}
    >
      <Typography fontSize={13} fontWeight={950} mb={0.85}>
        Titulos dos ficheiros
      </Typography>
      <Stack gap={0.85}>
        {form.playlist.map((item, index) => {
          if (!item.url) return null
          const itemKind = item.kind === 'document' ? 'document' : 'video'

          return (
            <Stack key={`${item.url}-${index}`} direction="row" alignItems="center" gap={0.8}>
              <Chip
                size="small"
                label={getMediaKindLabel(itemKind)}
                sx={{ flexShrink: 0, borderRadius: 1, fontWeight: 850 }}
              />
              <TextField
                fullWidth
                size="small"
                label={`Titulo do ficheiro ${index + 1}`}
                value={item.title}
                onChange={(event) => updateMediaItem(form, onChange, 'playlist', index, { title: event.target.value })}
              />
            </Stack>
          )
        })}
      </Stack>
      <ErrorText value={error} />
    </Paper>
  )
}
function MediaPreviewStrip({
  coverUrl,
  entries,
  onRemove,
}: {
  coverUrl?: string
  entries: ComposerMediaEntry[]
  onRemove: (entry: ComposerMediaEntry) => void
}) {
  if (entries.length === 0) return null

  const visibleEntries = entries.slice(0, 2)
  const hiddenCount = entries.length - visibleEntries.length

  return (
    <Box sx={{ mt: 1.15 }}>
      <Stack direction="row" gap={0.8} sx={{ overflowX: 'auto', pb: 0.2 }}>
        {visibleEntries.map((entry, visibleIndex) => (
          <MediaPreviewTile
            key={`${entry.item.url}-${entry.index}`}
            coverUrl={visibleIndex === 0 ? coverUrl : undefined}
            entry={entry}
            onRemove={() => onRemove(entry)}
          />
        ))}

        {hiddenCount > 0 && (
          <Paper
            elevation={0}
            sx={{
              width: 98,
              aspectRatio: '16 / 9',
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              border: '1px dashed #cbd5e1',
              borderRadius: 1.2,
              color: '#475569',
              bgcolor: '#f8fafc',
              fontWeight: 950,
            }}
          >
            +{hiddenCount}
          </Paper>
        )}
      </Stack>
      <Typography color="text.secondary" fontSize={12.5} mt={0.6}>
        {entries.length} {entries.length === 1 ? 'ficheiro carregado' : 'ficheiros carregados'}
      </Typography>
    </Box>
  )
}

function MediaPreviewTile({
  coverUrl,
  entry,
  onRemove,
}: {
  coverUrl?: string
  entry: ComposerMediaEntry
  onRemove: () => void
}) {
  const kind = entry.item.kind === 'document' ? 'document' : entry.item.kind === 'image' ? 'image' : 'video'
  const imageUrl = kind === 'image' ? entry.item.url : entry.item.thumbnailUrl || coverUrl

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        width: 118,
        aspectRatio: '16 / 9',
        flexShrink: 0,
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        borderRadius: 1.2,
        bgcolor: '#0f172a',
      }}
    >
      {imageUrl ? (
        <Box component="img" src={imageUrl} alt={entry.item.title || 'Ficheiro'} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <Box sx={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#fff' }}>
          {kind === 'document' ? <FileText size={24} /> : <PlayCircle size={28} />}
        </Box>
      )}
      {kind !== 'image' && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            bgcolor: imageUrl ? 'rgba(15,23,42,0.22)' : 'transparent',
          }}
        >
          {kind === 'document' ? <FileText size={24} /> : <PlayCircle size={28} />}
        </Box>
      )}
      <IconButton
        aria-label="Remover ficheiro"
        onClick={onRemove}
        size="small"
        sx={{
          position: 'absolute',
          top: 3,
          right: 3,
          width: 24,
          height: 24,
          bgcolor: 'rgba(15,23,42,0.82)',
          color: '#fff',
          '&:hover': { bgcolor: '#0f172a' },
        }}
      >
        <X size={14} />
      </IconButton>
    </Paper>
  )
}

function ToqueMediaPreview({
  form,
  onRemoveImage,
  onRemoveVideo,
}: {
  form: ToqueFormState
  onRemoveImage: (index: number) => void
  onRemoveVideo: () => void
}) {
  const images = form.images.filter((item) => item.url)

  if (!form.videoUrl && images.length === 0) return null

  if (form.mediaType === 'video' && form.videoUrl) {
    return <SingleVideoPreview title={form.title || 'Video carregado'} onRemove={onRemoveVideo} />
  }

  const visibleImages = images.slice(0, 4)
  const hiddenCount = images.length - visibleImages.length

  return (
    <Box sx={{ mt: 1.15 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, minmax(0, 1fr))',
            sm: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 0.8,
        }}
      >
        {visibleImages.map((item, index) => (
          <Paper
            key={`${item.url}-${index}`}
            elevation={0}
            sx={{
              position: 'relative',
              aspectRatio: '9 / 16',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              borderRadius: 1.4,
              bgcolor: '#0f172a',
            }}
          >
            <Box
              component="img"
              src={item.url}
              alt={item.title || 'Foto carregada'}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <IconButton
              aria-label="Remover foto"
              onClick={() => onRemoveImage(index)}
              size="small"
              sx={{
                position: 'absolute',
                top: 5,
                right: 5,
                width: 26,
                height: 26,
                bgcolor: 'rgba(15,23,42,0.82)',
                color: '#fff',
                '&:hover': { bgcolor: '#0f172a' },
              }}
            >
              <X size={14} />
            </IconButton>
          </Paper>
        ))}

        {hiddenCount > 0 && (
          <Paper
            elevation={0}
            sx={{
              aspectRatio: '9 / 16',
              display: 'grid',
              placeItems: 'center',
              border: '1px dashed #cbd5e1',
              borderRadius: 1.4,
              bgcolor: '#f8fafc',
              color: '#475569',
              fontWeight: 950,
            }}
          >
            +{hiddenCount}
          </Paper>
        )}
      </Box>
    </Box>
  )
}

function SingleVideoPreview({ onRemove, title }: { onRemove: () => void; title: string }) {
  return (
    <Box sx={{ mt: 1.15 }}>
      <Stack direction="row" gap={0.8} alignItems="center">
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            width: 92,
            aspectRatio: '9 / 16',
            flexShrink: 0,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            borderRadius: 1.2,
            bgcolor: '#0f172a',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <PlayCircle size={28} />
          <IconButton
            aria-label="Remover video"
            onClick={onRemove}
            size="small"
            sx={{
              position: 'absolute',
              top: 3,
              right: 3,
              width: 24,
              height: 24,
              bgcolor: 'rgba(15,23,42,0.82)',
              color: '#fff',
              '&:hover': { bgcolor: '#0f172a' },
            }}
          >
            <X size={14} />
          </IconButton>
        </Paper>
        <Box minWidth={0}>
          <Typography fontWeight={900} fontSize={13.5} noWrap>
            {title}
          </Typography>
          <Typography color="text.secondary" fontSize={12.5}>
            Video carregado
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

function UploadStatus({ label }: { label: string }) {
  return (
    <Paper elevation={0} sx={{ mt: 1.1, border: '1px solid #dbeafe', borderRadius: 1.4, p: 1, bgcolor: '#eff6ff' }}>
      <Stack direction="row" alignItems="center" gap={1}>
        <CircularProgress size={18} />
        <Box flex={1} minWidth={0}>
          <Typography fontSize={13} fontWeight={900}>{label}</Typography>
          <LinearProgress sx={{ mt: 0.7, borderRadius: 999, height: 5 }} />
        </Box>
      </Stack>
    </Paper>
  )
}

function PostClassificationDialog({
  errors,
  form,
  onChange,
  onClose,
  onToggleSubject,
  open,
}: {
  errors: FieldErrors
  form: PostFormState
  onChange: (patch: Partial<PostFormState>) => void
  onClose: () => void
  onToggleSubject: (subjectId: string) => void
  open: boolean
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 950 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography fontWeight={950}>Classificar conteudo</Typography>
          <IconButton aria-label="Fechar" onClick={onClose}><X size={18} /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack gap={1.5}>
          <ChipOptionGroup
            label="Disciplina"
            options={SUBJECTS}
            values={form.subjectIds}
            multiple
            error={errors.subjectIds}
            onToggle={onToggleSubject}
          />
          <ChipOptionGroup
            label="Nivel"
            options={LEVELS}
            value={form.level}
            error={errors.level}
            onSelect={(level) => onChange({ level })}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 1.5 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 850 }}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={onClose} sx={{ textTransform: 'none', fontWeight: 900 }}>
          Concluir
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ToqueClassificationDialog({
  errors,
  form,
  onChange,
  onClose,
  open,
}: {
  errors: FieldErrors
  form: ToqueFormState
  onChange: (patch: Partial<ToqueFormState>) => void
  onClose: () => void
  open: boolean
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 950 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography fontWeight={950}>Classificar Toque</Typography>
          <IconButton aria-label="Fechar" onClick={onClose}><X size={18} /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <ChipOptionGroup
          label="Area"
          options={CURIOSITY_AREAS}
          value={form.area}
          error={errors.area}
          onSelect={(area) => onChange({ area })}
        />
      </DialogContent>
      <DialogActions sx={{ p: 1.5 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 850 }}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={onClose} sx={{ textTransform: 'none', fontWeight: 900 }}>
          Concluir
        </Button>
      </DialogActions>
    </Dialog>
  )
}

type ChipOption = {
  id: string
  label: string
}

function ChipOptionGroup({
  error,
  label,
  multiple = false,
  onSelect,
  onToggle,
  options,
  readonly = false,
  value,
  values = [],
}: {
  error?: string
  label: string
  multiple?: boolean
  onSelect?: (value: string) => void
  onToggle?: (value: string) => void
  options: readonly ChipOption[]
  readonly?: boolean
  value?: string
  values?: string[]
}) {
  return (
    <Box minWidth={0}>
      <Typography color="text.secondary" fontSize={13} fontWeight={850} mb={0.8}>
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 0.8,
          overflowX: 'auto',
          pb: 0.4,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {options.map((option) => {
          const selected = multiple ? values.includes(option.id) : value === option.id

          return (
            <Chip
              key={option.id}
              component="button"
              type="button"
              clickable={!readonly}
              aria-pressed={selected}
              label={option.label}
              onClick={
                readonly
                  ? undefined
                  : () => {
                      if (multiple) {
                        onToggle?.(option.id)
                        return
                      }

                      onSelect?.(option.id)
                    }
              }
              sx={{
                flexShrink: 0,
                height: 36,
                borderRadius: 999,
                border: '1px solid',
                borderColor: selected ? '#ea580c' : '#cbd5e1',
                bgcolor: selected ? '#ffedd5' : '#fff',
                color: selected ? '#9a3412' : '#475569',
                cursor: readonly ? 'default' : 'pointer',
                fontWeight: 850,
                '& .MuiChip-label': { px: 1.2 },
                '&:hover': {
                  bgcolor: selected ? '#fed7aa' : '#f8fafc',
                },
              }}
            />
          )
        })}
      </Box>
      <ErrorText value={error} />
    </Box>
  )
}

function FileUploadPanel({
  accept,
  disabled,
  help,
  label,
  multiple = false,
  onFiles,
}: {
  accept: string
  disabled?: boolean
  help: string
  label: string
  multiple?: boolean
  onFiles: (files: File[]) => void
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px dashed #cbd5e1',
        borderRadius: 2,
        p: 1.4,
        bgcolor: '#f8fafc',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" gap={1.2}>
        <Box minWidth={0}>
          <Typography fontWeight={900}>Ficheiro</Typography>
          <Typography color="text.secondary" fontSize={13}>
            {help}
          </Typography>
        </Box>
        <Button
          component="label"
          variant="outlined"
          disabled={disabled}
          startIcon={disabled ? <CircularProgress color="inherit" size={16} /> : <UploadCloud size={17} />}
          sx={{ flexShrink: 0, textTransform: 'none', fontWeight: 900 }}
        >
          {label}
          <input
            hidden
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(event) => {
              const files = Array.from(event.target.files ?? [])
              event.target.value = ''
              onFiles(files)
            }}
          />
        </Button>
      </Stack>
    </Paper>
  )
}

function DetectedType({ value }: { value: Exclude<PostFormState['contentType'], '' | 'playlist'> }) {
  return (
    <Box>
      <Chip
        icon={<FileCheck size={16} />}
        label={`Detectado: ${getContentTypeLabel(value)}`}
        sx={{
          borderRadius: 999,
          bgcolor: '#ecfdf5',
          color: '#047857',
          fontWeight: 900,
          '& .MuiChip-icon': { color: '#047857' },
        }}
      />
    </Box>
  )
}

function UploadedFileSummary({
  item,
  title,
  type,
}: {
  item?: MediaItem
  title?: string
  type: 'video' | 'document' | 'image'
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 0,
        border: '1px solid #e2e8f0',
        borderRadius: 1.5,
        px: 1.1,
        py: 0.85,
        bgcolor: '#fff',
      }}
    >
      <Stack direction="row" alignItems="center" gap={0.8} minWidth={0}>
        <FileCheck size={18} color="#16a34a" />
        <Box minWidth={0}>
          <Typography fontSize={13} fontWeight={900} noWrap>
            {title || getMediaKindLabel(type)}
          </Typography>
          <Typography color="text.secondary" fontSize={12} noWrap>
            {type === 'document' && item?.totalPages ? `${item.totalPages} paginas detectadas` : 'Ficheiro carregado'}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}

function MediaGroup({
  action,
  children,
  error,
  title,
}: {
  action?: ReactNode
  children: ReactNode
  error?: string
  title: string
}) {
  return (
    <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 2, p: 1.2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} mb={1}>
        <Typography fontWeight={850}>{title}</Typography>
        {action}
      </Stack>
      <ErrorText value={error} />
      {children}
    </Box>
  )
}

function MediaItemFields({
  collection,
  form,
  index,
  item,
  onChange,
  removeDisabled,
  type,
}: {
  collection: MediaCollection
  form: PostFormState
  index: number
  item: MediaItem
  onChange: (form: PostFormState) => void
  removeDisabled?: boolean
  type: 'video' | 'document' | 'image'
}) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(180px, 240px) auto' }, gap: 1 }}>
      <TextField size="small" label="Titulo do ficheiro" value={item.title} onChange={(event) => updateMediaItem(form, onChange, collection, index, { title: event.target.value })} />
      <UploadedFileSummary item={item} type={type} />
      <IconButton aria-label="Remover" onClick={() => removeMediaItem(form, onChange, collection, index)} disabled={removeDisabled}>
        <Trash2 size={17} />
      </IconButton>
    </Box>
  )
}

function PlaylistItemFields({
  form,
  index,
  item,
  onChange,
  removeDisabled,
}: {
  form: PostFormState
  index: number
  item: MediaItem
  onChange: (form: PostFormState) => void
  removeDisabled?: boolean
}) {
  const itemKind = item.kind === 'document' ? 'document' : 'video'

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(180px, 240px) auto' }, gap: 1 }}>
      <TextField size="small" label="Titulo do ficheiro" value={item.title} onChange={(event) => updateMediaItem(form, onChange, 'playlist', index, { title: event.target.value })} />
      <UploadedFileSummary item={item} type={itemKind} />
      <IconButton aria-label="Remover" onClick={() => removeMediaItem(form, onChange, 'playlist', index)} disabled={removeDisabled}>
        <Trash2 size={17} />
      </IconButton>
    </Box>
  )
}
function PublicationCard({
  authUser,
  publication,
  onDelete,
  onEdit,
}: {
  authUser: AuthUser
  publication: Publication
  onDelete: (target: DeleteTarget) => void
  onEdit: (publication: Publication) => void
}) {
  const isPost = publication.kind === 'post'
  const item = publication.item
  const href = isPost ? `/content/${item._id}` : `/toque/${item._id}`
  const author = getPublicationAuthor(authUser, publication)

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 0,
        border: '1px solid #eef2f7',
        borderRadius: 2,
        overflow: 'hidden',
        background: '#fff',
        transition: 'background-color .18s ease, border-color .18s ease',
        '&:hover': {
          bgcolor: '#f8fafc',
          borderColor: '#dbe3ef',
        },
      }}
    >
      <Link href={href} scroll={false} style={{ color: 'inherit', textDecoration: 'none' }}>
        <PublicationMedia publication={publication} />
      </Link>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '42px minmax(0, 1fr) 44px',
          gap: 1,
          alignItems: 'start',
          p: { xs: 1.2, md: 1.35 },
        }}
      >
        <Avatar
          src={author.avatarUrl}
          alt={author.name}
          sx={{
            width: 40,
            height: 40,
            bgcolor: '#111827',
            color: '#fff',
            fontSize: 14,
            fontWeight: 900,
          }}
        >
          {getInitials(author.name)}
        </Avatar>

        <Box minWidth={0}>
          <Link href={href} scroll={false} style={{ color: 'inherit', textDecoration: 'none' }}>
            <Typography
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: 44,
                color: '#0f172a',
                fontSize: { xs: 16, md: 16.5 },
                fontWeight: 900,
                lineHeight: '22px',
                textOverflow: 'ellipsis',
              }}
            >
              {item.title}
            </Typography>
          </Link>

          <Typography
            sx={{
              mt: 0.25,
              color: '#64748b',
              fontSize: 13.5,
              fontWeight: 750,
              lineHeight: '18px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {author.name}
          </Typography>

          {isPost ? <PostMeta post={item as PostDTO} /> : <ToqueMeta toque={item as Toque} />}

          {isPost && (item as PostDTO).playlistTitle && (
            <Typography color="text.secondary" fontSize={12.8} fontWeight={850} mt={0.35} noWrap>
              Da playlist: {(item as PostDTO).playlistTitle}
            </Typography>
          )}

          {isPublicationPrivate(publication) && (
            <Chip
              size="small"
              icon={<LockKeyhole size={13} />}
              label="Privado"
              sx={{
                mt: 0.55,
                height: 24,
                borderRadius: 1,
                bgcolor: '#f1f5f9',
                color: '#334155',
                fontWeight: 900,
                '& .MuiChip-icon': { color: '#334155' },
              }}
            />
          )}

          <Typography
            sx={{
              mt: 0.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: '#64748b',
              fontSize: 13,
              lineHeight: '18px',
            }}
          >
            {item.description}
          </Typography>
        </Box>

        <PublicationActions onEdit={() => onEdit(publication)} onDelete={() => onDelete(publication)} />
      </Box>
    </Paper>
  )
}

function PublicationActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  return (
    <>
      <Tooltip title="Mais opcoes">
        <IconButton
          aria-label="Mais opcoes da publicacao"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            width: 44,
            height: 44,
            color: '#334155',
            '&:hover': { bgcolor: '#e2e8f0', color: '#111827' },
          }}
        >
          <MoreVertical size={24} strokeWidth={2.4} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              minWidth: 190,
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              boxShadow: '0 18px 45px rgba(15,23,42,0.16)',
            },
          },
        }}
      >
        <MenuItem onClick={() => { setAnchorEl(null); onEdit() }} sx={{ minHeight: 48 }}>
          <ListItemIcon><Pencil size={19} /></ListItemIcon>
          <ListItemText primary="Editar" primaryTypographyProps={{ fontWeight: 850 }} />
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); onDelete() }} sx={{ minHeight: 48, color: '#dc2626' }}>
          <ListItemIcon sx={{ color: '#dc2626' }}><Trash2 size={19} /></ListItemIcon>
          <ListItemText primary="Apagar" primaryTypographyProps={{ fontWeight: 850 }} />
        </MenuItem>
      </Menu>
    </>
  )
}

function PublicationMedia({ publication }: { publication: Publication }) {
  if (publication.kind === 'post') {
    return (
      <Box
        component="img"
        src={getPostPreviewImage(publication.item)}
        alt={publication.item.title}
        sx={{
          width: '100%',
          aspectRatio: '16 / 9',
          display: 'block',
          objectFit: 'cover',
          bgcolor: '#e2e8f0',
        }}
      />
    )
  }

  const toque = publication.item

  if (toque.mediaType === 'image') {
    return (
      <Box
        component="img"
        src={toque.imageUrl || '/opengraph-image.jpg'}
        alt={toque.title}
        sx={{
          width: '100%',
          aspectRatio: '16 / 9',
          display: 'block',
          objectFit: 'cover',
          bgcolor: '#e2e8f0',
        }}
      />
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '16 / 9',
        bgcolor: '#111827',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <PlayCircle size={42} />
    </Box>
  )
}

function PostMeta({ post }: { post: PostDTO }) {
  return (
    <Typography
      sx={{
        mt: 0.2,
        color: '#64748b',
        fontSize: 13,
        lineHeight: '18px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {getSubjectLabels(post.subjectIds, post.subjectId)} &bull; {getLevelLabel(post.level)} &bull; {getContentTypeLabel(post.contentType)} &bull; {formatDate(post.createdAt)}
    </Typography>
  )
}

function ToqueMeta({ toque }: { toque: Toque }) {
  const area = CURIOSITY_AREAS.find((item) => item.id === toque.area)?.label ?? toque.area

  return (
    <Typography
      sx={{
        mt: 0.2,
        color: '#64748b',
        fontSize: 13,
        lineHeight: '18px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {area} &bull; {toque.mediaType === 'video' ? 'Video' : 'Imagem'} &bull; {formatDate(toque.createdAt)}
    </Typography>
  )
}

function ErrorText({ value }: { value?: string }) {
  if (!value) return null
  return <Typography color="error" fontSize={12}>{value}</Typography>
}


function getUploadedMediaEntries(form: PostFormState, contentType: PostFormState['contentType']): ComposerMediaEntry[] {
  if (contentType === 'video') return toMediaEntries(form.videos, 'videos')
  if (contentType === 'document') return toMediaEntries(form.documents, 'documents')
  if (contentType === 'image') return toMediaEntries(form.images, 'images')
  if (contentType === 'playlist') return toMediaEntries(form.playlist, 'playlist')
  return []
}

function toMediaEntries(items: MediaItem[], collection: MediaCollection): ComposerMediaEntry[] {
  return items.reduce<ComposerMediaEntry[]>((entries, item, index) => {
    if (item.url?.trim()) {
      entries.push({ collection, index, item })
    }

    return entries
  }, [])
}

function getPostClassificationLabel(form: PostFormState) {
  const subjects = form.subjectIds.length ? getSubjectLabels(form.subjectIds) : ''
  const level = form.level ? getLevelLabel(form.level) : ''

  return [subjects, level].filter(Boolean).join(' - ')
}

function getAreaLabel(area: string) {
  return CURIOSITY_AREAS.find((item) => item.id === area)?.label ?? area
}

function getComposerModeLabel(mode: ComposerMode) {
  if (mode === 'toque') return 'Toque'
  if (mode === 'playlist') return 'Playlist'
  return 'Post individual'
}

function isPublicationPrivate(publication: Publication) {
  if (publication.kind === 'post') {
    return publication.item.isPublished === false
  }

  return publication.item.isPublished === false
}
function applyAutoPostTitle(form: PostFormState, mode: ComposerMode): PostFormState {
  if (mode === 'playlist' || form.title.trim()) {
    return form
  }

  return {
    ...form,
    title: getAutoPostTitle(form),
  }
}

function getAutoPostTitle(form: PostFormState) {
  const mediaTitle = getFirstMediaTitle(form)
  const descriptionTitle = getDescriptionFallbackTitle(form.description)

  return mediaTitle || descriptionTitle || 'Publicacao educativa'
}

function getAutoToqueTitle(form: ToqueFormState) {
  return getDescriptionFallbackTitle(form.description) || form.title.trim() || 'Toque educativo'
}

function getFirstMediaTitle(form: PostFormState) {
  const groups = [form.videos, form.documents, form.images, form.playlist]
  const firstItem = groups.flat().find((item) => item.title?.trim())
  return firstItem?.title.trim() ?? ''
}

function getDescriptionFallbackTitle(description: string) {
  return description.trim().split(/\s+/).slice(0, 8).join(' ')
}

function buildPlaylistItemPayloads(data: {
  subjectIds: string[]
  title: string
  description: string
  level: string
  imageLink: string
  isPublished: boolean
  playlist?: MediaItem[]
}): CreatePostPayload[] {
  return (data.playlist ?? []).map((item, index) => {
    const contentType = item.kind === 'document' ? 'document' : 'video'
    const basePayload: CreatePostPayload = {
      subjectIds: data.subjectIds,
      title: item.title,
      description: data.description,
      level: data.level,
      contentType,
      imageLink: item.thumbnailUrl || data.imageLink || item.url,
      isPublished: data.isPublished,
      playlistTitle: data.title,
      playlistOrder: index + 1,
    }

    if (contentType === 'document') {
      basePayload.documents = [{
        ...item,
        kind: 'document',
        totalPages: Number(item.totalPages || 1),
      }]
      return basePayload
    }

    basePayload.videos = [{
      ...item,
      kind: 'video',
    }]
    return basePayload
  })
}

function detectLocalFileKind(file: File) {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()

  if (type.startsWith('image/')) return 'image' as const
  if (type.startsWith('video/')) return 'video' as const
  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'document' as const

  return null
}

function uploadToMediaItem(uploaded: Awaited<ReturnType<typeof uploadPublicationMedia>>): MediaItem {
  const kind = uploaded.type === 'document' ? 'document' : uploaded.type
  const item: MediaItem = {
    kind,
    title: uploaded.title,
    url: uploaded.url,
    thumbnailUrl: uploaded.thumbnailUrl,
  }

  if (kind === 'document') {
    item.totalPages = uploaded.totalPages ?? 1
  }

  return item
}

function getMediaError(contentType: PostFormState['contentType'], errors: FieldErrors) {
  if (contentType === 'video') return errors.videos
  if (contentType === 'document') return errors.documents
  if (contentType === 'image') return errors.images
  if (contentType === 'playlist') return errors.playlist
  return undefined
}

function getMediaKindLabel(type: 'video' | 'document' | 'image') {
  if (type === 'document') return 'Documento'
  if (type === 'image') return 'Imagem'
  return 'Video'
}
function cleanMediaItems(items: MediaItem[]) {
  return items.filter((item) => item.title.trim() || item.url.trim()).map((item) => ({ ...item, kind: 'video' as const }))
}

function cleanDocumentItems(items: MediaItem[]) {
  return items
    .filter((item) => item.title.trim() || item.url.trim())
    .map((item) => ({ ...item, kind: 'document' as const, totalPages: Number(item.totalPages || 1) }))
}

function cleanImageItems(items: MediaItem[]) {
  return items
    .filter((item) => item.title.trim() || item.url.trim())
    .map((item) => ({ ...item, kind: 'image' as const }))
}

function cleanPlaylistItems(items: MediaItem[]) {
  return items
    .filter((item) => item.title.trim() || item.url.trim())
    .map((item) => {
      const kind = item.kind === 'document' ? 'document' : 'video'
      return {
        ...item,
        kind,
        totalPages: kind === 'document' ? Number(item.totalPages || 1) : undefined,
      }
    })
}

function normalizePostFormForSubmit(form: PostFormState): PostFormState {
  if (form.contentType !== 'image' || form.imageLink.trim()) {
    return form
  }

  const firstImage = form.images.find((item) => item.url.trim())

  if (!firstImage) {
    return form
  }

  return {
    ...form,
    imageLink: firstImage.url,
  }
}

function addMediaItem(form: PostFormState, onChange: (form: PostFormState) => void, collection: MediaCollection, item: MediaItem) {
  onChange({
    ...form,
    [collection]: [...form[collection], item],
  } as PostFormState)
}

function updateMediaItem(form: PostFormState, onChange: (form: PostFormState) => void, collection: MediaCollection, index: number, patch: Partial<MediaItem>) {
  const currentItems = form[collection].length ? form[collection] : [getEmptyMediaItem(collection)]
  const nextItems = currentItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))

  onChange({
    ...form,
    [collection]: nextItems,
  } as PostFormState)
}

function removeMediaItem(form: PostFormState, onChange: (form: PostFormState) => void, collection: MediaCollection, index: number) {
  const nextItems = form[collection].filter((_item, itemIndex) => itemIndex !== index)

  onChange({
    ...form,
    [collection]: nextItems.length ? nextItems : [getEmptyMediaItem(collection)],
  } as PostFormState)
}

function getEmptyMediaItem(collection: MediaCollection) {
  if (collection === 'documents') return emptyDocument()
  if (collection === 'images') return emptyImage()
  if (collection === 'playlist') return emptyPlaylistVideo()
  return emptyVideo()
}

function postToForm(post: PostDTO): PostFormState {
  return {
    subjectIds: post.subjectIds?.length ? post.subjectIds : post.subjectId ? [post.subjectId] : [],
    title: post.title,
    description: post.description,
    level: post.level,
    isPublished: post.isPublished !== false,
    contentType: post.contentType,
    imageLink: post.imageLink,
    videos: post.videos?.length ? post.videos : [emptyVideo()],
    documents: post.documents?.length ? post.documents : [emptyDocument()],
    images: post.images?.length ? post.images : [emptyImage()],
    playlist: post.playlist?.length ? post.playlist : [emptyPlaylistVideo()],
  }
}

function toqueToForm(toque: Toque): ToqueFormState {
  return {
    area: toque.area,
    title: toque.title,
    description: toque.description,
    isPublished: toque.isPublished !== false,
    mediaType: toque.mediaType,
    videoUrl: toque.mediaType === 'video' ? toque.videoUrl : '',
    imageUrl: toque.mediaType === 'image' ? toque.imageUrl : '',
    images: toque.mediaType === 'image' ? [{ kind: 'image', title: toque.title, url: toque.imageUrl }] : [],
  }
}
function toFieldErrors(errors: Record<string, string[] | undefined>): FieldErrors {
  return Object.fromEntries(
    Object.entries(errors).map(([key, value]) => [key, value?.[0] ?? ''])
  )
}

function getPublicationAuthor(authUser: AuthUser, publication: Publication) {
  if (publication.kind === 'post') {
    const post = publication.item

    if (post.creator?.name) {
      return {
        name: post.creator.name,
        avatarUrl: post.creator.avatarUrl,
      }
    }

    if (!post.creatorId) {
      return { name: LEGACY_CREATOR_NAME }
    }
  }

  if (publication.kind === 'toque' && !publication.item.creatorId && authUser.email.toLowerCase() === LEGACY_CREATOR_EMAIL) {
    return { name: LEGACY_CREATOR_NAME }
  }

  return {
    name: authUser.name,
    avatarUrl: authUser.avatarUrl,
  }
}

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function getAuthorName(authUser: AuthUser) {
  if (authUser.email.toLowerCase() === LEGACY_CREATOR_EMAIL) {
    return LEGACY_CREATOR_NAME
  }

  return authUser.name
}

function getComposerTitle(mode: ComposerMode, editing: EditingState) {
  if (editing) {
    return editing.kind === 'toque' ? 'Editar Toque' : 'Editar post'
  }

  if (mode === 'toque') {
    return 'Novo Toque'
  }

  if (mode === 'playlist') {
    return 'Nova playlist'
  }

  return 'Novo post'
}

function getPostPreviewImage(post: PostDTO) {
  if (post.imageLink) {
    return post.imageLink
  }

  if (post.contentType === 'image') {
    return post.images?.[0]?.url || '/opengraph-image.jpg'
  }

  return '/opengraph-image.jpg'
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Publicado recentemente'
  }

  return `Publicado em ${new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)}`
}








