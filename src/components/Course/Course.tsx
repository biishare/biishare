'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import {
  Box,
  Button,
  IconButton,
  Skeleton,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChevronDown, RefreshCw, SearchX } from 'lucide-react'

import theme from '../../../theme'
import { PostContentType, PostDTO } from '../../../types/post'
import { getPosts } from '../../../services/post.service'
import ContentCardSkeleton from '../Skeleton/Course.Skeleton'
import { buildFeed } from '../../../utils/buildFeed'
import { FeedBlock } from '../../../types/feed'
import { ToqueRow } from '../Toque/ToqueRow'
import ContentCard from './ContentCard'
import { getLevelLabel, getSubjectLabels } from '../../../utils/labels'

const LIMIT = 10

export default function ContentList() {
  const searchParams = useSearchParams()
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const subjectId = searchParams.get('subjectId') || undefined
  const level = searchParams.get('level') || undefined
  const searchQuery = searchParams.get('q')?.trim() || undefined
  const contentType = parseContentType(searchParams.get('contentType'))
  const pageLimit = searchQuery ? 1000 : LIMIT

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['posts', { subjectId, level, contentType, searchQuery }],

    queryFn: async ({ pageParam }) => {
      return getPosts({
        subjectId,
        level,
        contentType,
        q: searchQuery,
        page: searchQuery ? 1 : pageParam,
        limit: pageLimit,
      })
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      if (searchQuery) {
        return undefined
      }

      const total = lastPage.total ?? 0
      const loaded = allPages.length * LIMIT

      return loaded >= total ? undefined : allPages.length + 1
    },

    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })

  const fetchedPosts: PostDTO[] = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  )

  const posts: PostDTO[] = useMemo(() => {
    if (!searchQuery) {
      return fetchedPosts
    }

    const normalizedQuery = normalizeSearchValue(searchQuery)

    return fetchedPosts.filter((post) =>
      postMatchesSearch(post, normalizedQuery),
    )
  }, [fetchedPosts, searchQuery])

  const feed: FeedBlock[] = useMemo(
    () =>
      searchQuery
        ? [
            {
              type: 'content',
              items: posts,
            },
          ]
        : buildFeed(posts, subjectId),
    [posts, searchQuery, subjectId],
  )

  const isInitialLoading = isLoading && posts.length === 0
  const isRefreshingFeed = isFetching && !isFetchingNextPage && posts.length > 0

  useEffect(() => {
    const sentinel = loadMoreRef.current

    if (
      !sentinel ||
      !hasNextPage ||
      isFetching ||
      isFetchingNextPage ||
      isLoading ||
      searchQuery
    ) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void fetchNextPage()
        }
      },
      {
        rootMargin: '520px 0px',
        threshold: 0.01,
      },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    searchQuery,
  ])

  const handleLoadMore = () => {
    void fetchNextPage()
  }

  const handleRetry = () => {
    void refetch()
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        aria-busy={isInitialLoading || isRefreshingFeed}
        sx={{
          display: 'grid',
          gap: { xs: 2, md: 2.5 },
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          alignItems: 'stretch',
        }}
      >
        {isInitialLoading && (
          <FeedLoadingState searchQuery={searchQuery} />
        )}

        {isError && posts.length === 0 && !isInitialLoading && (
          <FeedErrorState onRetry={handleRetry} />
        )}

        {!isInitialLoading && !isError && isRefreshingFeed && (
          <FeedActivityBar ariaLabel="Feed a atualizar" />
        )}

        {!isInitialLoading &&
          feed.map((block, index) => {
            if (block.type === 'content') {
              return block.items.map((post) => (
                <ContentCard key={post._id} post={post} />
              ))
            }

            return (
              <Box
                key={index}
                sx={{
                  gridColumn: '1 / -1',
                  minWidth: 0,
                  width: '100%',
                }}
              >
                <ToqueRow area={block.area} page={block.page} />
              </Box>
            )
          })}

        {!isInitialLoading && !isError && posts.length === 0 && (
          <FeedEmptyState searchQuery={searchQuery} />
        )}

        {!isInitialLoading && posts.length > 0 && (
          <FeedLoadMore
            refElement={loadMoreRef}
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={handleLoadMore}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}

function FeedLoadingState({ searchQuery }: { searchQuery?: string }) {
  return (
    <>
      <FeedActivityBar
        ariaLabel={searchQuery ? 'Resultados a carregar' : 'Feed a carregar'}
      />
      <ContentCardSkeleton count={8} mobileCount={4} />
      {!searchQuery && <ToqueRailSkeleton />}
    </>
  )
}
function FeedActivityBar({ ariaLabel }: { ariaLabel: string }) {
  return (
    <Box
      role="status"
      aria-label={ariaLabel}
      sx={{
        gridColumn: '1 / -1',
        height: 3,
        overflow: 'hidden',
        borderRadius: 999,
        bgcolor: '#f1f5f9',
        '&::before': {
          content: '""',
          display: 'block',
          width: '34%',
          height: '100%',
          borderRadius: 999,
          bgcolor: '#f97316',
          animation: 'feedActivity 1.15s ease-in-out infinite',
        },
        '@keyframes feedActivity': {
          '0%': {
            transform: 'translateX(-120%)',
          },
          '100%': {
            transform: 'translateX(330%)',
          },
        },
      }}
    />
  )
}
function FeedErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        display: 'grid',
        justifyItems: 'center',
        gap: 1.2,
        border: '1px solid #fecaca',
        borderRadius: 2,
        bgcolor: '#fff',
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Typography fontSize={18} fontWeight={950} color="#991b1b">
        Nao foi possivel carregar a feed.
      </Typography>
      <Typography maxWidth={420} color="#64748b" fontSize={14} lineHeight={1.55}>
        Verifique a ligacao e tente novamente.
      </Typography>
      <Button
        type="button"
        variant="contained"
        onClick={onRetry}
        startIcon={<RefreshCw size={16} />}
        sx={{
          mt: 0.4,
          borderRadius: 2,
          bgcolor: '#f97316',
          boxShadow: 'none',
          fontWeight: 900,
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#ea580c',
            boxShadow: 'none',
          },
        }}
      >
        Tentar novamente
      </Button>
    </Box>
  )
}

function FeedEmptyState({ searchQuery }: { searchQuery?: string }) {
  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        display: 'grid',
        justifyItems: 'center',
        gap: 1,
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        bgcolor: '#fff',
        px: 2,
        py: 6,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          width: 48,
          height: 48,
          placeItems: 'center',
          borderRadius: '50%',
          bgcolor: '#f8fafc',
          color: '#64748b',
        }}
      >
        <SearchX size={22} />
      </Box>
      <Typography fontSize={18} fontWeight={950} color="#0f172a">
        {searchQuery
          ? `Nada encontrado para "${searchQuery}"`
          : 'Nenhum conteudo encontrado'}
      </Typography>
      <Typography maxWidth={420} color="#64748b" fontSize={14} lineHeight={1.55}>
        {searchQuery
          ? 'Experimente outro termo ou limpe alguns filtros.'
          : 'Novos conteudos vao aparecer aqui quando estiverem disponiveis.'}
      </Typography>
    </Box>
  )
}

function FeedLoadMore({
  refElement,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  refElement: React.MutableRefObject<HTMLDivElement | null>
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
}) {
  return (
    <Box
      ref={refElement}
      sx={{
        gridColumn: '1 / -1',
        display: 'grid',
        justifyItems: 'center',
        py: hasNextPage ? { xs: 2, md: 3 } : { xs: 1, md: 1.5 },
      }}
    >
      {hasNextPage ? (
        isFetchingNextPage ? (
          <FeedLoadMoreSkeleton />
        ) : (
          <IconButton
            type="button"
            aria-label="Carregar mais conteudos"
            onClick={onLoadMore}
            sx={{
              width: 42,
              height: 42,
              border: '1px solid #e2e8f0',
              bgcolor: '#fff',
              color: '#c2410c',
              boxShadow: '0 10px 26px rgba(15, 23, 42, 0.08)',
              '&:hover': {
                borderColor: '#fdba74',
                bgcolor: '#fff7ed',
              },
            }}
          >
            <ChevronDown size={20} />
          </IconButton>
        )
      ) : (
        <Box aria-hidden sx={{ height: 1 }} />
      )}
    </Box>
  )
}

function FeedLoadMoreSkeleton() {
  return (
    <Box
      sx={{
        display: 'grid',
        width: '100%',
        gap: { xs: 2, md: 2.5 },
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      <ContentCardSkeleton count={4} mobileCount={2} />
    </Box>
  )
}
function ToqueRailSkeleton() {
  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        display: 'grid',
        gap: 1.2,
        minWidth: 0,
        py: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Skeleton variant="rounded" width={132} height={22} animation="wave" />
        <Skeleton variant="rounded" width={72} height={22} animation="wave" />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: {
            xs: '140px',
            sm: '200px',
            md: '240px',
          },
          gap: 1.4,
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            animation="wave"
            sx={{ aspectRatio: '9 / 16', borderRadius: 2 }}
          />
        ))}
      </Box>
    </Box>
  )
}

function parseContentType(value: string | null): PostContentType | undefined {
  if (value === 'video' || value === 'document' || value === 'image' || value === 'playlist') {
    return value
  }

  return undefined
}

function postMatchesSearch(post: PostDTO, normalizedQuery: string) {
  const searchableText = [
    post.title,
    post.description,
    getSubjectLabels(post.subjectIds, post.subjectId),
    getLevelLabel(post.level),
    post.contentType,
  ]
    .filter(Boolean)
    .join(' ')

  return normalizeSearchValue(searchableText).includes(normalizedQuery)
}

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
