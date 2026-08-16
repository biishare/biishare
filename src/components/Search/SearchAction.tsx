'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, Tooltip, Typography } from '@mui/material'
import { Search } from 'lucide-react'

type SearchActionProps = {
  variant?: 'header' | 'navigation'
}

export default function SearchAction({
  variant = 'header',
}: SearchActionProps) {
  const pathname = usePathname()
  const [currentQuery, setCurrentQuery] = useState('')
  const active = pathname.startsWith('/search') || Boolean(currentQuery)
  const searchHref = currentQuery
    ? `/search?q=${encodeURIComponent(currentQuery)}`
    : '/search'

  useEffect(() => {
    const syncCurrentQuery = () => {
      setCurrentQuery(getCurrentSearchQuery())
    }

    syncCurrentQuery()
    window.addEventListener('popstate', syncCurrentQuery)
    window.addEventListener('focus', syncCurrentQuery)

    return () => {
      window.removeEventListener('popstate', syncCurrentQuery)
      window.removeEventListener('focus', syncCurrentQuery)
    }
  }, [pathname])

  const trigger =
    variant === 'navigation' ? (
      <Box
        component={Link}
        href={searchHref}
        aria-label="Pesquisar"
        aria-current={pathname.startsWith('/search') ? 'page' : undefined}
        sx={{
          display: 'flex',
          minHeight: 50,
          width: '100%',
          alignItems: 'center',
          gap: 1.6,
          borderRadius: 2,
          px: {
            md: 0,
            xl: 1.8,
          },
          justifyContent: {
            md: 'center',
            xl: 'flex-start',
          },
          color: active ? '#c2410c' : '#334155',
          bgcolor: active ? '#fff7ed' : 'transparent',
          font: 'inherit',
          fontWeight: active ? 800 : 650,
          textDecoration: 'none',
          transition:
            'background-color 160ms ease, color 160ms ease, transform 160ms ease',
          '&:hover': {
            bgcolor: active ? '#fff7ed' : '#f8fafc',
            color: '#c2410c',
            transform: 'translateY(-1px)',
          },
          '&:focus-visible': {
            outline: '2px solid #fb923c',
            outlineOffset: 2,
          },
        }}
      >
        <Box
          aria-hidden
          sx={{
            display: 'grid',
            width: 28,
            height: 28,
            flexShrink: 0,
            placeItems: 'center',
          }}
        >
          <Search size={22} strokeWidth={2.2} />
        </Box>

        <Typography
          component="span"
          sx={{
            display: {
              md: 'none',
              xl: 'inline',
            },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 15,
            lineHeight: 1,
          }}
        >
          Pesquisar
        </Typography>
      </Box>
    ) : (
      <Link
        href={searchHref}
        aria-label="Pesquisar"
        aria-current={pathname.startsWith('/search') ? 'page' : undefined}
        className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 active:scale-[.97]"
      >
        <Search size={21} strokeWidth={2.2} />
      </Link>
    )

  return (
    <Tooltip
      title={currentQuery ? `Pesquisar: ${currentQuery}` : 'Pesquisar'}
      placement={variant === 'navigation' ? 'right' : 'bottom'}
      arrow={variant === 'navigation'}
      slotProps={{
        tooltip: {
          sx:
            variant === 'navigation'
              ? {
                  display: {
                    xl: 'none',
                  },
                }
              : undefined,
        },
      }}
    >
      {trigger}
    </Tooltip>
  )
}

function getCurrentSearchQuery() {
  return new URLSearchParams(window.location.search).get('q')?.trim() ?? ''
}
