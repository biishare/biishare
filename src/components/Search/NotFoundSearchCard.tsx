'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, InputBase, Paper, Stack, Typography } from '@mui/material'
import { ArrowRight, Search } from 'lucide-react'

export default function NotFoundSearchCard() {
  const router = useRouter()
  const [value, setValue] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const query = value.trim()
    router.push(query ? `/?q=${encodeURIComponent(query)}` : '/')
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 560,
        border: '1px solid #e5e7eb',
        borderRadius: 3,
        bgcolor: '#fff',
        p: { xs: 2.4, sm: 3.4 },
        boxShadow: '0 24px 70px rgba(15,23,42,.10)',
      }}
    >
      <Stack spacing={2.4} alignItems="center">
        <Stack spacing={0.8} alignItems="center" textAlign="center">
          <Typography
            component="h1"
            sx={{
              color: '#0f172a',
              fontSize: { xs: 24, sm: 30 },
              fontWeight: 950,
              lineHeight: 1.15,
            }}
          >
            Esta pagina nao esta disponivel.
          </Typography>

          <Typography
            sx={{
              maxWidth: 420,
              color: '#64748b',
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Experimenta pesquisar por outro conteudo.
          </Typography>
        </Stack>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            gap: 1,
            border: '1px solid #d1d5db',
            borderRadius: 2,
            bgcolor: '#f8fafc',
            p: 0.7,
          }}
        >
          <Search
            aria-hidden
            size={21}
            strokeWidth={2.2}
            color="#f97316"
          />

          <InputBase
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
              fontSize: 16,
              fontWeight: 650,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            aria-label="Pesquisar"
            sx={{
              minWidth: 44,
              width: 44,
              height: 44,
              borderRadius: 1.6,
              bgcolor: '#f97316',
              boxShadow: 'none',
              color: '#fff',
              '&:hover': {
                bgcolor: '#ea580c',
                boxShadow: 'none',
              },
            }}
          >
            <ArrowRight size={19} />
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}
