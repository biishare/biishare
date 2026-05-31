'use client'

import {
  Box,
  Chip,
  Button,
} from '@mui/material'

import { useState } from 'react'

import { useQuery }
  from '@tanstack/react-query'

import { useRouter }
  from 'next/navigation'

import { Home }
  from 'lucide-react'

import { ToquesCard }
  from '@/components/Toque/Toques'

import { Toque }
  from '../../../types/Toque'

import { getShorts }
  from '../../../services/short.service'

import {
  CURIOSITY_AREAS as originalAreas,
}
  from '../../../constants/shorts/subjects.shorts'
import Link from 'next/link'

export default function ToqueListPage() {

  const router = useRouter()

  /**
   * =========================================================
   * FILTER
   * =========================================================
   */

  const [areaFilter, setAreaFilter] =
    useState('todos')

  const CURIOSITY_AREAS = [
    {
      id: 'todos',
      label: 'Todos',
    },
    ...originalAreas,
  ]

  /**
   * =========================================================
   * FETCH
   * =========================================================
   */

  const { data, isLoading } = useQuery({
    queryKey: ['shorts', areaFilter],

    queryFn: () =>
      getShorts({
        area:
          areaFilter === 'todos'
            ? undefined
            : areaFilter,

        page: 1,
        limit: 50,
      }),
  })

  const shorts: Toque[] =
    data?.data || []

  /**
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <Box
      sx={{
        minHeight: '100vh',

        background:
          'linear-gradient(to bottom,#fffdf8,#f7f1df)',

        display: 'flex',

        flexDirection: 'column',

        alignItems: 'center',
      }}
    >

      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <Box
        sx={{
          display: 'flex',

          gap: 1.5,

          position: 'sticky',

          top: 0,

          zIndex: 1000,

          width: '100%',

          maxWidth: 1000,

          px: 2,

          py: 1.5,

          backdropFilter: 'blur(14px)',

          bgcolor:
            'rgba(255, 255, 255, 0.75)',

          borderBottom:
            '1px solid rgba(0,0,0,.05)',
        }}
      >

        {/* HOME */}

        <Button
          onClick={() => router.push('/')}
          sx={{
            minWidth: 40,

            width: 40,

            height: 40,

            borderRadius: '50%',

            border:
              '1px solid rgba(0,0,0,.08)',

            bgcolor:
              'rgba(255,255,255,.9)',

            color: '#F4A300',

            backdropFilter: 'blur(10px)',

            transition: '.25s',

            '&:hover': {
              bgcolor: '#F4A300',

              color: '#fff',

              transform:
                'translateY(-1px)',
            },
          }}
        >
          <Home size={18} />
        </Button>

        {/* FILTERS */}

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

          {CURIOSITY_AREAS.map((a) => {

            const active =
              areaFilter === a.id

            return (
              <Chip
                key={a.id}

                label={a.label}

                clickable

                onClick={() =>
                  setAreaFilter(a.id)
                }

                color={
                  active
                    ? 'warning'
                    : 'default'
                }

                ref={(el) => {
                  if (active && el) {
                    el.scrollIntoView({
                      inline: 'center',
                      behavior:
                        'smooth',
                    })
                  }
                }}

                sx={{
                  flexShrink: 0,

                  minHeight: 38,

                  px: 1,

                  fontWeight: 600,

                  borderRadius: '999px',

                  transition:
                    'all .25s ease',

                  border: active
                    ? 'none'
                    : '1px solid rgba(0,0,0,.08)',

                  bgcolor: active
                    ? undefined
                    : 'rgba(255,255,255,.9)',

                  backdropFilter:
                    'blur(10px)',

                  '& .MuiChip-label':
                  {
                    px: 1.5,
                  },

                  '&:hover': {
                    transform:
                      'translateY(-1px)',

                    boxShadow:
                      '0 4px 10px rgba(0,0,0,.08)',
                  },
                }}
              />
            )
          })}

        </Box>

      </Box>

      {/* ==================================================== */}
      {/* GRID */}
      {/* ==================================================== */}

      <Box
        sx={{
          width: '100%',

          maxWidth: 1000,

          px: 2,

          py: 2,

          display: 'grid',

          gap: 2.2,

          gridTemplateColumns: {
            xs: '1fr',

            sm: 'repeat(2,1fr)',

            md: 'repeat(3,1fr)',

            lg: 'repeat(4,1fr)',
          },
        }}
      >

        {/* SKELETON */}

        {isLoading &&
          Array.from({
            length: 8,
          }).map((_, i) => (

            <Box
              key={i}

              sx={{
                aspectRatio: '9/16',

                borderRadius: 4,

                background:
                  'linear-gradient(110deg,#eee 8%,#f5f5f5 18%,#eee 33%)',

                backgroundSize:
                  '200% 100%',

                animation:
                  'shine 1.2s linear infinite',

                '@keyframes shine':
                {
                  to: {
                    backgroundPositionX:
                      '-200%',
                  },
                },
              }}
            />

          ))}

        {/* CONTENT */}

        {!isLoading &&
          shorts.map((short) => (
            <Link
              key={short._id}
              href={`/toque/${short._id}`}
              scroll={false}
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
                <ToquesCard item={short} />
              </Box>
            </Link>
          ))}

      </Box>

    </Box>
  )
}