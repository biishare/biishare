'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Dialog,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
} from '@mui/material'
import { ArrowRight, Search, X } from 'lucide-react'

type SearchActionProps = {
  variant?: 'header' | 'navigation'
}

export default function SearchAction({
  variant = 'header',
}: SearchActionProps) {
  const router = useRouter()
  const [currentQuery, setCurrentQuery] = useState('')
  const active = Boolean(currentQuery)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  useEffect(() => {
    const syncCurrentQuery = () => {
      setCurrentQuery(getCurrentSearchQuery())
    }

    syncCurrentQuery()
    window.addEventListener('popstate', syncCurrentQuery)

    return () => {
      window.removeEventListener('popstate', syncCurrentQuery)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setValue(currentQuery)
    }
  }, [currentQuery, open])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const query = value.trim()
    const params = new URLSearchParams(window.location.search)

    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    params.delete('page')

    const nextQuery = params.toString()
    router.push(nextQuery ? `/?${nextQuery}` : '/')
    setCurrentQuery(query)
    setOpen(false)
  }

  const trigger =
    variant === 'navigation' ? (
      <Box
        component="button"
        type="button"
        aria-label="Pesquisar"
        aria-pressed={active}
        onClick={() => setOpen(true)}
        sx={{
          display: 'flex',
          minHeight: 50,
          width: '100%',
          alignItems: 'center',
          gap: 1.6,
          border: 0,
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
          cursor: 'pointer',
          textDecoration: 'none',
          transition:
            'background-color 160ms ease, color 160ms ease, transform 160ms ease',
          '&:hover': {
            bgcolor: active ? '#fff7ed' : '#f8fafc',
            color: '#c2410c',
            transform: 'translateY(-1px)',
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
      <button
        type="button"
        aria-label="Pesquisar"
        aria-pressed={active}
        onClick={() => setOpen(true)}
        className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-[.97]"
      >
        <Search size={21} strokeWidth={2.2} />
      </button>
    )

  return (
    <>
      <Tooltip
        title={active ? `Pesquisar: ${currentQuery}` : 'Pesquisar'}
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            m: {
              xs: 1.5,
              sm: 3,
            },
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'flex',
              minHeight: 64,
              alignItems: 'center',
              gap: 1,
              borderBottom: '1px solid #e2e8f0',
              px: 1.4,
            }}
          >
            <Search
              aria-hidden
              size={22}
              strokeWidth={2.2}
              color="#f97316"
            />

            <InputBase
              autoFocus
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Pesquisar conteudos"
              inputProps={{
                'aria-label': 'Pesquisar conteudos',
              }}
              sx={{
                minWidth: 0,
                flex: 1,
                color: '#0f172a',
                fontSize: {
                  xs: 17,
                  sm: 18,
                },
                fontWeight: 650,
              }}
            />

            <IconButton
              type="submit"
              aria-label="Pesquisar"
              sx={{
                width: 40,
                height: 40,
                color: '#fff',
                bgcolor: '#f97316',
                '&:hover': {
                  bgcolor: '#ea580c',
                },
              }}
            >
              <ArrowRight size={19} />
            </IconButton>

            <IconButton
              type="button"
              aria-label="Fechar pesquisa"
              onClick={() => setOpen(false)}
              sx={{
                width: 40,
                height: 40,
                color: '#64748b',
              }}
            >
              <X size={19} />
            </IconButton>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}

function getCurrentSearchQuery() {
  return new URLSearchParams(window.location.search).get('q')?.trim() ?? ''
}
