'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Alert, Box, Paper, Stack, Typography } from '@mui/material'

import SocialAuthActions from './SocialAuthActions'

const authErrorMessages: Record<string, string> = {
  access_denied: 'A permissao foi cancelada. Escolha uma conta para continuar.',
  oauth_failed: 'Nao foi possivel concluir o login social. Tente novamente.',
  provider_not_configured:
    'O login social ainda nao esta configurado no servidor.',
}

type LoginFormProps = {
  authError?: string | null
}

function getAuthErrorMessage(authError?: string | null) {
  if (!authError) {
    return null
  }

  return (
    authErrorMessages[authError] ||
    'Nao foi possivel concluir o login social. Tente novamente.'
  )
}

export default function LoginForm({ authError }: LoginFormProps) {
  const authErrorMessage = getAuthErrorMessage(authError)

  return (
    <main className="mx-auto flex min-h-[calc(100dvh_-_130px)] w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 md:min-h-screen lg:px-8">
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 470,
          border: '1px solid #e5e7eb',
          borderRadius: 3,
          background: '#fff',
          p: { xs: 2.2, sm: 3.2 },
          boxShadow: '0 24px 70px rgba(15,23,42,.10)',
        }}
      >
        <Stack spacing={2.4}>
          <Link href="/" style={{ alignSelf: 'center', display: 'block' }}>
            <Box
              sx={{
                position: 'relative',
                width: 74,
                height: 74,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <Image
                src="/logo.svg"
                alt="Biishare"
                width={74}
                height={74}
                priority
              />
            </Box>
          </Link>

          <Typography
            component="h1"
            fontSize={26}
            fontWeight={950}
            textAlign="center"
          >
            Iniciar sessao
          </Typography>

          {authErrorMessage ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {authErrorMessage}
            </Alert>
          ) : null}

          <SocialAuthActions />

          <Typography color="text.secondary" fontSize={12} textAlign="center">
            Ao continuar, aceita os{' '}
            <Link href="/terms" style={{ fontWeight: 800 }}>
              termos
            </Link>{' '}
            e a{' '}
            <Link href="/privacy" style={{ fontWeight: 800 }}>
              privacidade
            </Link>
            .
          </Typography>
        </Stack>
      </Paper>
    </main>
  )
}
