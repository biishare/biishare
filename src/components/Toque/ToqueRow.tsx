'use client'

import { useRef, useState, useEffect } from 'react'

import {
  Box,
  Typography,
} from '@mui/material'

import {
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'

import { useQuery } from '@tanstack/react-query'

import { useRouter } from 'next/navigation'

import { getShorts } from '../../../services/short.service'

import { ToquesCard } from './Toques'

import ToquesSkeleton from '../Skeleton/Toques.Skeleton'

import { Toque } from '../../../types/Toque'

interface Props {
  area?: string
  page: number
  limit?: number
  title?: string
}

interface ShortsResponse {
  data: Toque[]
  page: number
  total: number
  totalPages?: number
}

export function ToqueRow({
  area,
  page,
  limit = 5,
  title = 'Toques',
}: Props) {

  const router = useRouter()

  /**
   * =========================================================
   * REFS
   * =========================================================
   */

  const scrollRef = useRef<HTMLDivElement>(null)

  /**
   * =========================================================
   * STATES
   * =========================================================
   */

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  /**
   * =========================================================
   * QUERY
   * =========================================================
   */

  const { data, isLoading } =
    useQuery<ShortsResponse>({
      queryKey: [
        'shorts',
        area ?? 'all',
        page,
        limit,
      ],

      queryFn: () =>
        getShorts({
          area,
          page,
          limit,
        }),

      staleTime: 1000 * 60 * 5,
      placeholderData: prev => prev,
    })

  /**
   * =========================================================
   * SCROLL
   * =========================================================
   */

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return

    setCanScrollLeft(el.scrollLeft > 0)

    setCanScrollRight(
      el.scrollLeft <
      el.scrollWidth -
      el.clientWidth -
      1
    )
  }

  useEffect(() => {
    checkScroll()
  }, [data])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return

    const amount =
      scrollRef.current.clientWidth * 0.8

    scrollRef.current.scrollBy({
      left: direction === 'left'
        ? -amount
        : amount,
      behavior: 'smooth',
    })
  }

  /**
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (isLoading && !data) {
    return <ToquesSkeleton count={limit} />
  }

  if (!data || data.data.length === 0) {
    return null
  }

  /**
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <Box
      sx={{
        mb: 4,
        width: '100%',
      }}
    >

      {/* HEADER */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          mb: 1.5,
        }}
      >
        <Typography
          fontSize={18}
          fontWeight={800}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box
            onClick={() => scroll('left')}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollLeft ? 'pointer' : 'default',
              opacity: canScrollLeft ? 1 : 0.3,
            }}
          >
            <ArrowLeft size={18} />
          </Box>

          <Box
            onClick={() => scroll('right')}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollRight ? 'pointer' : 'default',
              opacity: canScrollRight ? 1 : 0.3,
            }}
          >
            <ArrowRight size={18} />
          </Box>
        </Box>
      </Box>

      {/* ROW */}

      <Box
        ref={scrollRef}
        onScroll={checkScroll}
        sx={{
          display: 'flex',
          gap: 2,
          px: 1,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >

        {data.data.map((short) => (

          <Box
            key={short._id}
            onClick={() => {
              router.push(`/toque/${short._id}`, {
                scroll: false,
              })
            }}
            sx={{
              flex: {
                xs: '0 0 140px',
                sm: '0 0 200px',
                md: '0 0 240px',
              },
              scrollSnapAlign: 'start',
              cursor: 'pointer',
            }}
          >
            <ToquesCard item={short} />
          </Box>

        ))}

        {/* EXPLORE */}

        <Box
          onClick={() => router.push('/toque')}
          sx={{
            flex: {
              xs: '0 0 140px',
              sm: '0 0 200px',
              md: '0 0 240px',
            },
            cursor: 'pointer',
          }}
        >
          <Box
            sx={{
              height: '100%',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg,#f59e0b,#f97316)',
              color: '#fff',
            }}
          >
            <Typography fontWeight={800}>
              Explorar
            </Typography>
          </Box>
        </Box>

      </Box>
    </Box>
  )
}
