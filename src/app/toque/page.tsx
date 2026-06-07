'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material'

import { useQuery } from '@tanstack/react-query'
import { Home } from 'lucide-react'

import { ToquesCard } from '@/components/Toque/Toques'
import { Toque } from '../../../types/Toque'
import { getShorts } from '../../../services/short.service'
import {
  CURIOSITY_AREAS as originalAreas,
} from '../../../constants/shorts/subjects.shorts'

const TOQUE_LIMIT = 32

export default function ToqueListPage() {
  const router = useRouter()
  const feedRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])

  const [areaFilter, setAreaFilter] = useState('todos')
  const [activeIndex, setActiveIndex] = useState(0)

  const curiosityAreas = useMemo(() => [
    {
      id: 'todos',
      label: 'Todos',
    },
    ...originalAreas,
  ], [])

  const { data, isLoading } = useQuery({
    queryKey: ['shorts', areaFilter, TOQUE_LIMIT],
    queryFn: () =>
      getShorts({
        area:
          areaFilter === 'todos'
            ? undefined
            : areaFilter,
        page: 1,
        limit: TOQUE_LIMIT,
      }),
    staleTime: 1000 * 60 * 5,
    placeholderData: previousData => previousData,
  })

  const shorts: Toque[] = useMemo(
    () => data?.data || [],
    [data],
  )

  useEffect(() => {
    setActiveIndex(0)
    itemRefs.current = []
    feedRef.current?.scrollTo({
      top: 0,
      behavior: 'instant',
    })
  }, [areaFilter])

  useEffect(() => {
    if (!shorts.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!best?.target) return

        const nextIndex = Number(
          (best.target as HTMLElement).dataset.index,
        )

        if (!Number.isNaN(nextIndex)) {
          setActiveIndex(nextIndex)
        }
      },
      {
        threshold: [0.55, 0.7, 0.85],
      },
    )

    itemRefs.current.forEach((element, index) => {
      if (!element) return
      element.dataset.index = String(index)
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [shorts])

  const filterBar = (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        width: '100%',
      }}
    >
      {curiosityAreas.map((area) => {
        const active = areaFilter === area.id

        return (
          <Chip
            key={area.id}
            label={area.label}
            clickable
            onClick={() => setAreaFilter(area.id)}
            ref={(el) => {
              if (active && el) {
                el.scrollIntoView({
                  inline: 'center',
                  behavior: 'smooth',
                })
              }
            }}
            sx={{
              flexShrink: 0,
              minHeight: 38,
              px: 1,
              fontWeight: 700,
              borderRadius: '999px',
              transition: 'all .25s ease',
              color: active
                ? '#151515'
                : { xs: '#fff', md: '#1f2937' },
              border: active
                ? '1px solid transparent'
                : {
                  xs: '1px solid rgba(255,255,255,.22)',
                  md: '1px solid rgba(0,0,0,.08)',
                },
              bgcolor: active
                ? '#F4A300'
                : {
                  xs: 'rgba(255,255,255,.14)',
                  md: 'rgba(255,255,255,.9)',
                },
              backdropFilter: 'blur(10px)',
              '& .MuiChip-label': {
                px: 1.5,
              },
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: {
                  xs: 'none',
                  md: '0 4px 10px rgba(0,0,0,.08)',
                },
              },
            }}
          />
        )
      })}
    </Box>
  )

  const loading = isLoading && !data

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: {
          xs: '#050505',
          md: '#f7f1df',
        },
        background: {
          xs: '#050505',
          md: 'linear-gradient(to bottom,#fffdf8,#f7f1df)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          position: {
            xs: 'fixed',
            md: 'sticky',
          },
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          width: '100%',
          maxWidth: {
            xs: 'none',
            md: 1000,
          },
          mx: 'auto',
          px: 2,
          py: 1.5,
          backdropFilter: 'blur(14px)',
          background: {
            xs: 'linear-gradient(to bottom, rgba(0,0,0,.72), rgba(0,0,0,0))',
            md: 'rgba(255, 255, 255, 0.75)',
          },
          borderBottom: {
            xs: 'none',
            md: '1px solid rgba(0,0,0,.05)',
          },
        }}
      >
        <Button
          onClick={() => router.push('/')}
          aria-label="Voltar ao inicio"
          sx={{
            minWidth: 40,
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: {
              xs: '1px solid rgba(255,255,255,.2)',
              md: '1px solid rgba(0,0,0,.08)',
            },
            bgcolor: {
              xs: 'rgba(255,255,255,.14)',
              md: 'rgba(255,255,255,.9)',
            },
            color: {
              xs: '#fff',
              md: '#F4A300',
            },
            backdropFilter: 'blur(10px)',
            transition: '.25s',
            '&:hover': {
              bgcolor: '#F4A300',
              color: '#fff',
              transform: 'translateY(-1px)',
            },
          }}
        >
          <Home size={18} />
        </Button>

        {filterBar}
      </Box>

      {loading && (
        <>
          <Box
            ref={(element) => {
              feedRef.current = element as HTMLDivElement | null
            }}
            sx={{
              display: { xs: 'flex', md: 'none' },
              height: '100svh',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <CircularProgress size={28} sx={{ color: '#F4A300' }} />
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              width: '100%',
              maxWidth: 1000,
              mx: 'auto',
              px: 2,
              py: 2,
              gap: 2.2,
              gridTemplateColumns: {
                md: 'repeat(3,1fr)',
                lg: 'repeat(4,1fr)',
              },
              pt: 10,
            }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  aspectRatio: '9/16',
                  borderRadius: 4,
                  background:
                    'linear-gradient(110deg,#eee 8%,#f5f5f5 18%,#eee 33%)',
                  backgroundSize: '200% 100%',
                  animation: 'shine 1.2s linear infinite',
                  '@keyframes shine': {
                    to: {
                      backgroundPositionX: '-200%',
                    },
                  },
                }}
              />
            ))}
          </Box>
        </>
      )}

      {!loading && shorts.length === 0 && (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 3,
            textAlign: 'center',
            color: {
              xs: '#fff',
              md: '#1f2937',
            },
          }}
        >
          <Typography fontWeight={800}>
            Ainda nao ha Toques nesta area.
          </Typography>
        </Box>
      )}

      {!loading && shorts.length > 0 && (
        <>
          <Box
            sx={{
              display: { xs: 'block', md: 'none' },
              height: '100svh',
              overflowY: 'auto',
              overscrollBehaviorY: 'contain',
              scrollSnapType: 'y mandatory',
              scrollbarWidth: 'none',
              bgcolor: '#050505',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {shorts.map((short, index) => {
              const distance = Math.abs(activeIndex - index)

              return (
                <Box
                  key={short._id}
                  ref={(element) => {
                    itemRefs.current[index] = element as HTMLDivElement | null
                  }}
                  sx={{
                    height: '100svh',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#000',
                  }}
                >
                  <ToquesCard
                    item={short}
                    pageToque
                    active={activeIndex === index}
                    preload={
                      activeIndex === index
                        ? 'auto'
                        : distance === 1
                          ? 'metadata'
                          : 'none'
                    }
                    sx={{
                      width: '100%',
                      height: '100%',
                      maxWidth: {
                        xs: '100%',
                        sm: 520,
                      },
                      mx: 'auto',
                      borderRadius: 0,
                    }}
                  />
                </Box>
              )
            })}
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              width: '100%',
              maxWidth: 1000,
              mx: 'auto',
              px: 2,
              py: 2,
              gap: 2.2,
              gridTemplateColumns: {
                md: 'repeat(3,1fr)',
                lg: 'repeat(4,1fr)',
              },
            }}
          >
            {shorts.map((short) => (
              <Link
                key={short._id}
                href={`/toque/${short._id}`}
                scroll={false}
                style={{
                  textDecoration: 'none',
                }}
              >
                <Box
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform .2s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <ToquesCard item={short} preload="metadata" />
                </Box>
              </Link>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}
