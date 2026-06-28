'use client'

import React, { useMemo } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'

import theme from '../../../theme'
import { PostDTO } from '../../../types/post'
import { getPosts } from '../../../services/post.service'
import ContentCardSkeleton from '../Skeleton/Course.Skeleton'
import { buildFeed } from '../../../utils/buildFeed'
import { FeedBlock } from '../../../types/feed'
import { ToqueRow } from '../Toque/ToqueRow'
import ContentCard from './ContentCard'

const LIMIT = 10

export default function ContentList() {
  const searchParams = useSearchParams()

  const subjectId = searchParams.get('subjectId') || undefined
  const level = searchParams.get('level') || undefined
  const contentType = searchParams.get('contentType') as
    | 'video'
    | 'document'
    | undefined

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', { subjectId, level, contentType }],

    queryFn: async ({ pageParam }) => {
      return getPosts({
        subjectId,
        level,
        contentType,
        page: pageParam,
        limit: LIMIT,
      })
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.total ?? 0
      const loaded = allPages.length * LIMIT

      return loaded >= total ? undefined : allPages.length + 1
    },

    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })

  const posts: PostDTO[] = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  )

  const feed: FeedBlock[] = useMemo(
    () => buildFeed(posts, subjectId),
    [posts, subjectId],
  )

  const handleLoadMore = () => {
    fetchNextPage()
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          alignItems: 'stretch',
        }}
      >
        {isLoading && posts.length === 0 && (
          <ContentCardSkeleton count={8} />
        )}

        {feed.map((block, index) => {
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

        {isFetchingNextPage && (
          <Box
            gridColumn="1 / -1"
            display="flex"
            justifyContent="center"
            py={4}
          >
            <CircularProgress />
          </Box>
        )}

        {!isLoading && hasNextPage && posts.length > 0 && (
          <Box
            gridColumn="1 / -1"
            display="flex"
            justifyContent="center"
            py={4}
          >
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              startIcon={
                isFetchingNextPage ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
              sx={{
                borderColor: '#FDBA74',
                color: '#F59E0B',
                fontWeight: 600,
                px: 3,
                py: 1.2,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              {isFetchingNextPage
                ? 'Carregando...'
                : 'Carregar mais'}
            </Button>
          </Box>
        )}

        {!isLoading && posts.length === 0 && (
          <Box gridColumn="1 / -1" textAlign="center" py={8}>
            <Typography color="text.secondary">
              Nenhum conteudo encontrado
            </Typography>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  )
}
