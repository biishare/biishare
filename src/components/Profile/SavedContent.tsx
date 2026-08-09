'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { getSavedPosts } from '../../../services/post.service'
import { getSavedToques } from '../../../services/short.service'
import { SavedPostDTO, SavedPostsResponse } from '../../../types/post'
import { SavedToqueDTO, SavedToquesResponse } from '../../../types/Toque'
import { getContentTypeLabel, getLevelLabel, getSubjectLabels } from '../../../utils/labels'
import { getCloudinaryBlur } from '../../../utils/Post/CloudinaryBlur'
import SavePostButton from '../Post/SavePostButton'
import SaveToqueButton from '../Toque/SaveToqueButton'
import { ToquesCard } from '../Toque/Toques'

const PREVIEW_LIMIT = 6
const FULL_PAGE_SIZE = 48
const SAVED_POSTS_HREF = '/profile/guardados/posts'
const SAVED_TOQUES_HREF = '/profile/guardados/toques'

export function SavedContentPreview() {
  const {
    data: savedPostsData,
    isLoading: isLoadingPosts,
    isError: isPostsError,
  } = useQuery({
    queryKey: ['saved-posts', 'profile-preview'],
    queryFn: () => getSavedPosts({ limit: PREVIEW_LIMIT }),
  })
  const {
    data: savedToquesData,
    isLoading: isLoadingToques,
    isError: isToquesError,
  } = useQuery({
    queryKey: ['saved-toques', 'profile-preview'],
    queryFn: () => getSavedToques({ limit: PREVIEW_LIMIT }),
  })

  const savedPosts = savedPostsData?.data ?? []
  const savedToques = savedToquesData?.data ?? []
  const isLoading = isLoadingPosts || isLoadingToques
  const hasError = isPostsError || isToquesError
  const hasSavedContent = savedPosts.length > 0 || savedToques.length > 0

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        p: { xs: 1.5, md: 2 },
        background: '#fff',
      }}
    >
      {isLoading && (
        <Stack alignItems="center" py={4}>
          <CircularProgress size={28} />
        </Stack>
      )}

      {hasError && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Nao foi possivel carregar todos os guardados.
        </Alert>
      )}

      {!isLoading && !hasError && !hasSavedContent && (
        <Box sx={{ py: 0.5 }}>
          <Typography fontWeight={850}>Ainda nao guardaste conteudos.</Typography>
          <Typography color="text.secondary" fontSize={14} mt={0.5}>
            Quando guardares posts ou toques, eles vao aparecer aqui.
          </Typography>
        </Box>
      )}

      {!isLoading && !hasError && savedPosts.length > 0 && (
        <SavedPreviewSection
          title="Posts guardados"
          count={savedPostsData?.total ?? savedPosts.length}
          href={SAVED_POSTS_HREF}
          itemWidth={{ xs: '82%', sm: 300, md: 316 }}
        >
          {savedPosts.map((item) => (
            <SavedPostCard key={item.id} item={item} compact />
          ))}
        </SavedPreviewSection>
      )}

      {!isLoading && !hasError && savedToques.length > 0 && (
        <SavedPreviewSection
          title="Toques guardados"
          count={savedToquesData?.total ?? savedToques.length}
          href={SAVED_TOQUES_HREF}
          itemWidth={{ xs: '48%', sm: 188, md: 210 }}
          sx={{ mt: savedPosts.length > 0 ? 2.4 : 0 }}
        >
          {savedToques.map((item) => (
            <SavedToqueCard key={item.id} item={item} compact />
          ))}
        </SavedPreviewSection>
      )}
    </Paper>
  )
}

export function SavedPostsFullPage({ profileHref }: { profileHref: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['saved-posts', 'full'],
    queryFn: getAllSavedPosts,
  })

  const items = data?.data ?? []

  return (
    <SavedPageShell
      title="Posts guardados"
      count={data?.total ?? items.length}
      profileHref={profileHref}
    >
      {isLoading && <SavedLoading />}
      {isError && <SavedError />}
      {!isLoading && !isError && items.length === 0 && <SavedEmpty />}
      {!isLoading && !isError && items.length > 0 && (
        <Box
          sx={{
            mt: 2,
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 1.3,
          }}
        >
          {items.map((item) => (
            <SavedPostCard key={item.id} item={item} />
          ))}
        </Box>
      )}
    </SavedPageShell>
  )
}

export function SavedToquesFullPage({ profileHref }: { profileHref: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['saved-toques', 'full'],
    queryFn: getAllSavedToques,
  })

  const items = data?.data ?? []

  return (
    <SavedPageShell
      title="Toques guardados"
      count={data?.total ?? items.length}
      profileHref={profileHref}
    >
      {isLoading && <SavedLoading />}
      {isError && <SavedError />}
      {!isLoading && !isError && items.length === 0 && <SavedEmpty />}
      {!isLoading && !isError && items.length > 0 && (
        <Box
          sx={{
            mt: 2,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
              xl: 'repeat(5, minmax(0, 1fr))',
            },
            gap: 1.3,
          }}
        >
          {items.map((item) => (
            <SavedToqueCard key={item.id} item={item} />
          ))}
        </Box>
      )}
    </SavedPageShell>
  )
}

async function getAllSavedPosts(): Promise<SavedPostsResponse> {
  const firstPage = await getSavedPosts({ page: 1, limit: FULL_PAGE_SIZE })
  const totalPages = getTotalPages(firstPage.totalPages, firstPage.total, FULL_PAGE_SIZE)

  if (totalPages <= 1) {
    return firstPage
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getSavedPosts({ page: index + 2, limit: FULL_PAGE_SIZE })
    )
  )
  const data = firstPage.data.concat(remainingPages.flatMap((page) => page.data))

  return {
    ...firstPage,
    data,
    limit: data.length,
    page: 1,
    total: firstPage.total ?? data.length,
    totalPages: 1,
  }
}

async function getAllSavedToques(): Promise<SavedToquesResponse> {
  const firstPage = await getSavedToques({ page: 1, limit: FULL_PAGE_SIZE })
  const totalPages = getTotalPages(firstPage.totalPages, firstPage.total, FULL_PAGE_SIZE)

  if (totalPages <= 1) {
    return firstPage
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getSavedToques({ page: index + 2, limit: FULL_PAGE_SIZE })
    )
  )
  const data = firstPage.data.concat(remainingPages.flatMap((page) => page.data))

  return {
    ...firstPage,
    data,
    limit: data.length,
    page: 1,
    total: firstPage.total ?? data.length,
    totalPages: 1,
  }
}

function getTotalPages(totalPages: number | undefined, total: number | undefined, limit: number) {
  if (typeof totalPages === 'number') {
    return Math.max(1, totalPages)
  }

  if (typeof total === 'number') {
    return Math.max(1, Math.ceil(total / limit))
  }

  return 1
}
function SavedPreviewSection({
  children,
  count,
  href,
  itemWidth,
  sx,
  title,
}: {
  children: React.ReactNode
  count: number
  href: string
  itemWidth: { xs: string; sm: number; md: number }
  sx?: object
  title: string
}) {
  return (
    <Box sx={sx}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Stack direction="row" alignItems="center" gap={1} minWidth={0}>
          <Typography fontSize={18} fontWeight={900} noWrap>
            {title}
          </Typography>
          <Chip
            size="small"
            label={count}
            sx={{ height: 22, borderRadius: 1.2, fontWeight: 850 }}
          />
        </Stack>

        <Button
          component={Link}
          href={href}
          size="small"
          endIcon={<ArrowRight size={15} />}
          sx={{
            flexShrink: 0,
            borderRadius: 1.5,
            color: '#ea580c',
            fontWeight: 900,
            textTransform: 'none',
          }}
        >
          Ver mais
        </Button>
      </Stack>

      <Box
        sx={{
          mt: 1,
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: itemWidth,
          gap: 1.2,
          overflowX: 'auto',
          pb: 0.6,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          '& > *': {
            scrollSnapAlign: 'start',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

function SavedPageShell({
  children,
  count,
  profileHref,
  title,
}: {
  children: React.ReactNode
  count: number
  profileHref: string
  title: string
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1.5}>
        <Box minWidth={0}>
          <Typography fontSize={{ xs: 24, md: 30 }} fontWeight={950} lineHeight={1.05}>
            {title}
          </Typography>
          <Typography color="text.secondary" fontSize={14} mt={0.4}>
            {count} guardados
          </Typography>
        </Box>

        <Button
          component={Link}
          href={profileHref}
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
          sx={{
            flexShrink: 0,
            borderRadius: 1.5,
            fontWeight: 900,
            textTransform: 'none',
          }}
        >
          Perfil
        </Button>
      </Stack>

      {children}
    </main>
  )
}

function SavedPostCard({
  compact = false,
  item,
}: {
  compact?: boolean
  item: SavedPostDTO
}) {
  const post = item.post
  const previewImage = post.imageLink || '/opengraph-image.jpg'

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Link
        href={`/content/${post._id}`}
        scroll={false}
        style={{ color: 'inherit', textDecoration: 'none' }}
        aria-label={`Abrir conteudo: ${post.title}`}
      >
        <Box
          sx={{
            position: 'relative',
            aspectRatio: '16 / 9',
            width: '100%',
            bgcolor: '#e2e8f0',
          }}
        >
          <Image
            src={previewImage}
            alt={`Previsualizacao de ${post.title}`}
            fill
            placeholder={post.imageLink ? 'blur' : 'empty'}
            blurDataURL={post.imageLink ? getCloudinaryBlur(post.imageLink) : undefined}
            sizes={compact ? '316px' : '(max-width: 900px) 100vw, 33vw'}
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </Link>

      <Box sx={{ p: compact ? 1.2 : 1.5 }}>
        <Stack direction="row" justifyContent="space-between" gap={1} alignItems="center">
          <Chip size="small" label={getContentTypeLabel(post.contentType)} />
          <Typography fontSize={12} color="text.secondary" noWrap>
            {formatSavedDate(item.savedAt)}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: 0.8,
            alignItems: 'start',
            mt: 1.1,
          }}
        >
          <Link
            href={`/content/${post._id}`}
            scroll={false}
            style={{ color: 'inherit', display: 'block', minWidth: 0, textDecoration: 'none' }}
            aria-label={`Abrir conteudo: ${post.title}`}
          >
            <Typography fontWeight={900} fontSize={compact ? 14 : 15} lineHeight={1.35}>
              {post.title}
            </Typography>
          </Link>

          <SavePostButton
            postId={post._id}
            title={post.title}
            initialSaved
            sx={{
              width: 34,
              height: 34,
              mt: -0.6,
              flexShrink: 0,
              bgcolor: 'transparent',
              borderColor: 'transparent',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#f1f5f9',
              },
            }}
          />
        </Box>

        <Typography color="text.secondary" fontSize={13} mt={0.4} noWrap>
          {getSubjectLabels(post.subjectIds, post.subjectId)} - {getLevelLabel(post.level)}
        </Typography>
      </Box>
    </Paper>
  )
}

function SavedToqueCard({
  compact = false,
  item,
}: {
  compact?: boolean
  item: SavedToqueDTO
}) {
  const toque = item.toque

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Link
        href={`/toque/${toque._id}`}
        scroll={false}
        style={{ color: 'inherit', textDecoration: 'none' }}
        aria-label={`Abrir toque: ${toque.title}`}
      >
        <ToquesCard
          item={toque}
          preload="metadata"
          sx={{
            borderRadius: 0,
          }}
        />
      </Link>

      <Box sx={{ p: compact ? 1 : 1.2 }}>
        <Stack direction="row" justifyContent="space-between" gap={1} alignItems="center">
          <Chip size="small" label={toque.mediaType === 'video' ? 'Video' : 'Imagem'} />
          <Typography fontSize={12} color="text.secondary" noWrap>
            {formatSavedDate(item.savedAt)}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: 0.8,
            alignItems: 'start',
            mt: 1,
          }}
        >
          <Link
            href={`/toque/${toque._id}`}
            scroll={false}
            style={{ color: 'inherit', display: 'block', minWidth: 0, textDecoration: 'none' }}
            aria-label={`Abrir toque: ${toque.title}`}
          >
            <Typography fontWeight={900} fontSize={compact ? 13 : 14} lineHeight={1.35}>
              {toque.title}
            </Typography>
          </Link>

          <SaveToqueButton
            toqueId={toque._id}
            title={toque.title}
            initialSaved
            iconSize={18}
            sx={{
              width: 34,
              height: 34,
              mt: -0.6,
              flexShrink: 0,
              color: '#f97316',
              bgcolor: 'transparent',
              borderColor: 'transparent',
              boxShadow: 'none',
              backdropFilter: 'none',
              '&:hover': {
                bgcolor: '#fff7ed',
              },
              '&.Mui-disabled': {
                color: '#f97316',
                bgcolor: 'transparent',
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  )
}

function SavedLoading() {
  return (
    <Stack alignItems="center" py={6}>
      <CircularProgress size={30} />
    </Stack>
  )
}

function SavedError() {
  return (
    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
      Nao foi possivel carregar os guardados.
    </Alert>
  )
}

function SavedEmpty() {
  return (
    <Paper elevation={0} sx={{ mt: 2, border: '1px solid #e5e7eb', borderRadius: 2, p: 2 }}>
      <Typography fontWeight={850}>Ainda nao existem guardados aqui.</Typography>
    </Paper>
  )
}

function formatSavedDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'recentemente'
  }

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
