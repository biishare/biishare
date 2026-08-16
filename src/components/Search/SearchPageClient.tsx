'use client'

import {
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from '@mui/material'
import { ArrowLeft, ArrowRight, Clock3, Search, Trash2, X } from 'lucide-react'

const RECENT_SEARCHES_KEY = 'biishare_recent_searches'
const MAX_RECENT_SEARCHES = 8

const suggestedSearches = [
  'Matematica',
  'Biologia',
  'Portugues',
  'Fisica',
  'Quimica',
  'Historia',
]

export default function SearchPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryFromUrl = searchParams.get('q')?.trim() ?? ''
  const [value, setValue] = useState(queryFromUrl)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    setRecentSearches(readRecentSearches())
  }, [])

  useEffect(() => {
    setValue(queryFromUrl)
  }, [queryFromUrl])

  const filteredSuggestions = useMemo(() => {
    const recentSet = new Set(
      recentSearches.map((item) => normalizeSearchText(item)),
    )

    return suggestedSearches.filter(
      (item) => !recentSet.has(normalizeSearchText(item)),
    )
  }, [recentSearches])

  const submitSearch = (query: string) => {
    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      router.push('/')
      return
    }

    const nextRecentSearches = saveRecentSearch(normalizedQuery)
    setRecentSearches(nextRecentSearches)
    router.push(`/?q=${encodeURIComponent(normalizedQuery)}`)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitSearch(value)
  }

  const handleRecentSearch = (query: string) => {
    submitSearch(query)
  }

  const handleRecentKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    query: string,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    submitSearch(query)
  }

  const handleRemoveRecent = (
    event: MouseEvent<HTMLButtonElement>,
    query: string,
  ) => {
    event.stopPropagation()
    const nextRecentSearches = recentSearches.filter(
      (item) => normalizeSearchText(item) !== normalizeSearchText(query),
    )
    writeRecentSearches(nextRecentSearches)
    setRecentSearches(nextRecentSearches)
  }

  const handleClearRecent = () => {
    writeRecentSearches([])
    setRecentSearches([])
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
      <Stack spacing={2.2}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Button
            component={Link}
            href="/"
            variant="text"
            startIcon={<ArrowLeft size={17} />}
            sx={{
              minWidth: 0,
              borderRadius: 1.5,
              color: '#64748b',
              fontWeight: 850,
              textTransform: 'none',
            }}
          >
            Voltar
          </Button>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'flex',
              minHeight: 58,
              alignItems: 'center',
              gap: 1,
              border: '1px solid #dbe3ef',
              borderRadius: 2,
              bgcolor: '#fff',
              px: 1.2,
              boxShadow: '0 12px 34px rgba(15, 23, 42, .07)',
            }}
          >
            <Search aria-hidden size={22} strokeWidth={2.2} color="#f97316" />

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
                fontSize: { xs: 18, sm: 20 },
                fontWeight: 750,
              }}
            />

            {value ? (
              <IconButton
                type="button"
                aria-label="Limpar pesquisa"
                onClick={() => setValue('')}
                sx={{
                  width: 38,
                  height: 38,
                  color: '#64748b',
                }}
              >
                <X size={18} />
              </IconButton>
            ) : null}

            <IconButton
              type="submit"
              aria-label="Pesquisar"
              sx={{
                width: 42,
                height: 42,
                color: '#fff',
                bgcolor: '#f97316',
                '&:hover': {
                  bgcolor: '#ea580c',
                },
              }}
            >
              <ArrowRight size={19} />
            </IconButton>
          </Box>
        </Box>

        <Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1.5}
            sx={{ mb: 1 }}
          >
            <Typography fontWeight={950} fontSize={18} color="#0f172a">
              Pesquisas recentes
            </Typography>

            {recentSearches.length > 0 ? (
              <Button
                type="button"
                size="small"
                onClick={handleClearRecent}
                startIcon={<Trash2 size={15} />}
                sx={{
                  color: '#64748b',
                  fontWeight: 850,
                  textTransform: 'none',
                }}
              >
                Limpar
              </Button>
            ) : null}
          </Stack>

          {recentSearches.length > 0 ? (
            <Stack spacing={0.4}>
              {recentSearches.map((query) => (
                <Box
                  key={query}
                  component="div"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRecentSearch(query)}
                  onKeyDown={(event) => handleRecentKeyDown(event, query)}
                  sx={{
                    display: 'grid',
                    minHeight: 48,
                    width: '100%',
                    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                    alignItems: 'center',
                    gap: 1.2,
                    border: 0,
                    borderRadius: 1.5,
                    bgcolor: 'transparent',
                    px: 1,
                    color: '#0f172a',
                    cursor: 'pointer',
                    textAlign: 'left',
                    userSelect: 'none',
                    '&:hover': {
                      bgcolor: '#fff7ed',
                    },
                    '&:focus-visible': {
                      outline: '2px solid #fb923c',
                      outlineOffset: 2,
                    },
                  }}
                >
                  <Clock3 size={18} color="#64748b" />
                  <Typography fontWeight={850} noWrap>
                    {query}
                  </Typography>
                  <IconButton
                    type="button"
                    aria-label={`Remover pesquisa ${query}`}
                    onClick={(event) => handleRemoveRecent(event, query)}
                    sx={{ width: 34, height: 34, color: '#94a3b8' }}
                  >
                    <X size={16} />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          ) : (
            <Box
              sx={{
                border: '1px dashed #cbd5e1',
                borderRadius: 2,
                bgcolor: '#fff',
                px: 1.4,
                py: 1.6,
              }}
            >
              <Typography color="#64748b" fontSize={14}>
                Sem pesquisas recentes.
              </Typography>
            </Box>
          )}
        </Box>

        {filteredSuggestions.length > 0 ? (
          <Box>
            <Typography fontWeight={950} fontSize={18} color="#0f172a" mb={1}>
              Explorar
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={1}>
              {filteredSuggestions.map((query) => (
                <Chip
                  key={query}
                  label={query}
                  onClick={() => handleRecentSearch(query)}
                  clickable
                  sx={{
                    height: 38,
                    borderRadius: 1.6,
                    border: '1px solid #e2e8f0',
                    bgcolor: '#fff',
                    color: '#334155',
                    fontWeight: 850,
                    '&:hover': {
                      borderColor: '#fdba74',
                      bgcolor: '#fff7ed',
                      color: '#c2410c',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Stack>
    </main>
  )
}

function readRecentSearches() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(RECENT_SEARCHES_KEY)
    const parsed = value ? JSON.parse(value) : []

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, MAX_RECENT_SEARCHES)
  } catch {
    return []
  }
}

function writeRecentSearches(searches: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES)),
  )
}

function saveRecentSearch(query: string) {
  const normalizedQuery = query.trim()

  if (!normalizedQuery) {
    return readRecentSearches()
  }

  const nextRecentSearches = [
    normalizedQuery,
    ...readRecentSearches().filter(
      (item) => normalizeSearchText(item) !== normalizeSearchText(normalizedQuery),
    ),
  ].slice(0, MAX_RECENT_SEARCHES)

  writeRecentSearches(nextRecentSearches)
  return nextRecentSearches
}

function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}