'use client'

import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  IconButton,
  Chip,
  Divider,
} from '@mui/material'

import Image from 'next/image'
import {
  Home,
  Target,
  BookOpen,
  Globe,
  Sparkles,
} from 'lucide-react'

import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()

  return (
    <Box
      sx={{
        py: {
          xs: 8,
          md: 10,
        },
        minHeight: '100vh',
        background: `
          radial-gradient(circle at top,
          rgba(255,122,0,0.08),
          transparent 35%),
          #fafafa
        `,
      }}
    >
      <Container maxWidth="md">

        {/* HEADER */}
        <Stack
          spacing={3}
          sx={{
            mb: 6,
            alignItems: 'center',
            textAlign: 'center',
          }}
        >

          {/* LOGO */}
          <Box
            sx={{
              position: 'relative',
            }}
          >

            {/* GLOW */}
            <Box
              sx={{
                position: 'absolute',
                inset: -10,
                borderRadius: 5,
                background:
                  'radial-gradient(circle, rgba(255,122,0,0.25), transparent 70%)',
                filter: 'blur(16px)',
              }}
            />

            <Box
              sx={{
                position: 'relative',
                width: 90,
                height: 90,
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: '#fff',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Image
                src="/logo.svg"
                alt="Biishare"
                width={90}
                height={90}
                priority
              />
            </Box>
          </Box>

          {/* BADGE */}
          <Chip
            icon={<Sparkles size={16} />}
            label="Aprende • Descobre • Evolui"
            sx={{
              px: 1,
              borderRadius: 999,
              background: 'rgba(255,122,0,0.08)',
              color: '#FF7A00',
              fontWeight: 600,
              border: '1px solid rgba(255,122,0,0.15)',
            }}
          />

          {/* TITLE */}
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              background:
                'linear-gradient(90deg,#FF7A00,#ff9f45)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px',
            }}
          >
            Biishare
          </Typography>

          {/* SUBTITLE */}
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              maxWidth: 580,
              lineHeight: 1.8,
              fontSize: {
                xs: '1rem',
                md: '1.05rem',
              },
            }}
          >
            Uma plataforma educativa moderna focada em
            ciência, tecnologia e ensino acessível para
            estudantes.
          </Typography>
        </Stack>

        {/* MAIN CARD */}
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              md: 5,
            },
            borderRadius: 6,
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          }}
        >
          <Stack spacing={4}>

            {/* SOBRE */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
            >
              <Box
                sx={{
                  mt: 0.5,
                  color: '#FF7A00',
                }}
              >
                <BookOpen size={22} />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                >
                  Sobre nós
                </Typography>

                <Typography
                  color="text.secondary"
                  lineHeight={1.9}
                >
                  A Biishare é uma plataforma digital dedicada
                  à educação, criada para tornar o conhecimento
                  mais acessível, simples e envolvente.
                </Typography>
              </Box>
            </Stack>

            <Divider />

            {/* OBJETIVO */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
            >
              <Box
                sx={{
                  mt: 0.5,
                  color: '#FF7A00',
                }}
              >
                <Target size={22} />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                >
                  O nosso objetivo
                </Typography>

                <Typography
                  color="text.secondary"
                  lineHeight={1.9}
                >
                  Democratizar o acesso ao conhecimento e ajudar
                  estudantes a compreender melhor os conteúdos
                  ensinados nas escolas.
                </Typography>
              </Box>
            </Stack>

            <Divider />

            {/* CONTEUDOS */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
            >
              <Box
                sx={{
                  mt: 0.5,
                  color: '#FF7A00',
                }}
              >
                <BookOpen size={22} />
              </Box>

              <Box width="100%">
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                >
                  Conteúdos
                </Typography>

                <Stack
                  spacing={1.2}
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  <Typography>
                    • Documentos educativos
                  </Typography>

                  <Typography>
                    • Vídeos explicativos
                  </Typography>

                  <Typography>
                    • Imagens e infográficos
                  </Typography>

                  <Typography>
                    • Shorts educativos
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Divider />

            {/* VISAO */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
            >
              <Box
                sx={{
                  mt: 0.5,
                  color: '#FF7A00',
                }}
              >
                <Globe size={22} />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                >
                  Visão
                </Typography>

                <Typography
                  color="text.secondary"
                  lineHeight={1.9}
                >
                  Ser uma das principais plataformas educativas
                  digitais em África.
                </Typography>
              </Box>
            </Stack>

          </Stack>
        </Paper>

        {/* FLOATING HOME BUTTON */}
        <IconButton
          aria-label="Ir para página inicial"
          onClick={() => router.push('/')}
          sx={{
            position: 'fixed',
            bottom: {
              xs: 16,
              md: 24,
            },
            right: {
              xs: 16,
              md: 24,
            },
            width: 58,
            height: 58,
            color: '#fff',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255,122,0,0.92)',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
            transition: 'all .25s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              background: '#e66a00',
            },
          }}
        >
          <Home size={22} />
        </IconButton>

      </Container>
    </Box>
  )
}