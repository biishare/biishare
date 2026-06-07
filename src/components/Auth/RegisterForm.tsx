'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'

import type { RegisterFormValues } from '../../../lib/validations/auth'
import { useUserRegisterForm } from '../../../hooks/user-register-form'
import { IconGoogle } from '../IconGoogle/IconGoogle'
import Benefit from './Benefit'

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [submittedName, setSubmittedName] = useState<string | null>(null)
  const form = useUserRegisterForm()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = form

  const onSubmit = async (values: RegisterFormValues) => {
    if (!acceptedTerms) return

    await new Promise((resolve) => setTimeout(resolve, 500))
    setSubmittedName(values.name)
    reset()
    setAcceptedTerms(false)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 470px' },
          gap: { xs: 3, lg: 5 },
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Stack spacing={3} maxWidth={650}>
            <Link href="/" style={{ display: 'inline-block' }}>
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
                  cursor: 'pointer',
                }}
              >
                <Image
                  src="/logo.svg"
                  alt="Biishare"
                  width={132}
                  height={52}
                  priority
                />
              </Box>
            </Link>

            <Typography
              component="h1"
              sx={{
                color: '#111827',
                fontSize: { lg: 52 },
                fontWeight: 950,
                lineHeight: 1.02,
              }}
            >
              Crie a sua conta e faca parte da Biishare.
            </Typography>

            <Typography
              sx={{
                color: '#475569',
                fontSize: 18,
                lineHeight: 1.7,
                maxWidth: 560,
              }}
            >
              Uma rede social educativa e divertida onde voce aprende, consome
              conteudos, partilha conhecimento e evolui atraves de pontos,
              niveis e recompensas.
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 1.5,
                maxWidth: 560,
              }}
            >
              <Benefit label="Plataforma" value="Social" />
              <Benefit label="Conteudos" value="Educativos" />
              <Benefit label="Experiencia" value="Gamificada" />
            </Box>
          </Stack>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            border: '1px solid #e5e7eb',
            borderRadius: 3,
            background: '#fff',
            p: { xs: 2.2, sm: 3.2 },
            boxShadow: '0 24px 70px rgba(15,23,42,.10)',
          }}
        >
          <Stack spacing={2.4}>
            <Box>
              <Typography component="h2" fontSize={26} fontWeight={950}>
                Criar conta
              </Typography>
              <Typography color="text.secondary" fontSize={14}>
                Junte-se a Biishare e comece a aprender de forma interativa.
              </Typography>
            </Box>

            {submittedName && (
              <Alert severity="success">
                Bem-vindo a Biishare, {submittedName}
              </Alert>
            )}

            <Button
              component="a"
              href="/api/auth/google"
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<IconGoogle />}
              sx={{
                height: 48,
                borderRadius: 2,
                borderColor: '#d1d5db',
                color: '#111827',
                fontWeight: 900,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              Registar com Google
            </Button>

            <Divider>
              <Typography color="text.secondary" fontSize={12} fontWeight={700}>
                ou
              </Typography>
            </Divider>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={1.8}>
                <TextField
                  label="Nome"
                  fullWidth
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  {...register('name')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <UserRound size={18} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  {...register('email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Palavra-passe"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  {...register('password')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockKeyhole size={18} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={showPassword ? 'Ocultar' : 'Mostrar'}>
                          <IconButton
                            onClick={() => setShowPassword((value) => !value)}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Confirmar palavra-passe"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockKeyhole size={18} />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptedTerms}
                      onChange={(event) =>
                        setAcceptedTerms(event.target.checked)
                      }
                    />
                  }
                  label={
                    <Typography color="text.secondary" fontSize={14}>
                      Aceito os{' '}
                      <Link href="/terms" style={{ fontWeight: 800 }}>
                        termos
                      </Link>{' '}
                      e a{' '}
                      <Link href="/privacy" style={{ fontWeight: 800 }}>
                        privacidade
                      </Link>
                      .
                    </Typography>
                  }
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!acceptedTerms || isSubmitting}
                  sx={{
                    height: 48,
                    borderRadius: 2,
                    fontWeight: 900,
                    background: 'linear-gradient(135deg,#f59e0b,#fb923c)',
                  }}
                >
                  {isSubmitting ? 'A criar conta...' : 'Criar conta'}
                </Button>
              </Stack>
            </Box>

            <Typography
              color="text.secondary"
              fontSize={14}
              textAlign="center"
            >
              Ja tem conta?{' '}
              <Link href="/login" style={{ fontWeight: 800 }}>
                Entrar
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </main>
  )
}
