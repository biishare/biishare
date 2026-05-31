'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  IconButton,
  Divider,
} from '@mui/material'

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0f172a', // slate-900
        color: '#cbd5e1',
        py: 8,
        mt: 10,
      }}
    >
      <Container maxWidth="lg">

        {/* GRID */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 6,
          }}
        >

          {/* CONTACTO */}
          <Box>
            <Typography
              sx={{
                mb: 2,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                color: '#f59e0b', // amber
              }}
            >
              CONTACTO
            </Typography>

            <Stack spacing={2} fontSize={14}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Mail size={18} />
                <span>antonio.marques.dev@gmail.com</span>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Phone size={18} />
                <span>834469637</span>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <MapPin size={18} />
                <span>Moçambique</span>
              </Stack>
            </Stack>
          </Box>

          {/* REDES SOCIAIS */}
          <Box>
            <Typography
              sx={{
                mb: 2,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                color: '#f59e0b',
              }}
            >
              REDES SOCIAIS
            </Typography>

            <Stack direction="row" spacing={1}>
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <IconButton
                  key={i}
                  sx={{
                    border: '1px solid #334155',
                    color: '#94a3b8',
                  }}
                >
                  <Icon size={16} />
                </IconButton>
              ))}
            </Stack>

            <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
              Redes sociais disponíveis em breve
            </Typography>
          </Box>

          {/* LINKS */}
          <Box>
            <Typography
              sx={{
                mb: 2,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                color: '#f59e0b',
              }}
            >
              INFORMAÇÃO
            </Typography>

            <Stack spacing={1} fontSize={14}>
              <Link href="/about" underline="hover" color="inherit">
                Sobre nós
              </Link>

              <Link href="/faq" underline="hover" color="inherit">
                Perguntas frequentes
              </Link>

              <Link href="/terms" underline="hover" color="inherit">
                Termos de serviço
              </Link>

              <Link href="/privacy" underline="hover" color="inherit">
                Política de privacidade
              </Link>
            </Stack>
          </Box>

        </Box>

        {/* DIVIDER */}
        <Divider sx={{ borderColor: '#1e293b', my: 4 }} />

        {/* COPYRIGHT */}
        <Typography
          align="center"
          variant="caption"
          sx={{ color: '#64748b' }}
        >
          © {new Date().getFullYear()} Biishare — Aprende. Descobre. Evolui.
        </Typography>

      </Container>
    </Box>
  )
}