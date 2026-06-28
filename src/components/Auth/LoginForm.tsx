'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'

import type { LoginFormValues } from '../../../lib/validations/auth'
import { useUserLoginForm } from '../../../hooks/user-login-form'
import {
  getApiErrorMessage,
  loginUser,
  saveAuthSession,
} from '../../../services/auth.service'
import { getPostAuthRedirectPath } from '../../../constants/features'
import { IconGoogle } from '../IconGoogle/IconGoogle'
import Benefit from './Benefit'

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const form = useUserLoginForm()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = form

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setSubmitError(null)
      const session = await loginUser(values)
      saveAuthSession(session)
      setSubmittedEmail(session.user.email)
      reset()
      router.push(getPostAuthRedirectPath(session.user.username))
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, 'Nao foi possivel iniciar sessao.')
      )
    }
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
              Entre na Biishare e continue a aprender.
            </Typography>

            <Typography
              sx={{
                color: '#475569',
                fontSize: 18,
                lineHeight: 1.7,
                maxWidth: 560,
              }}
            >
              Continue a explorar toques educativos, descubra conteudos novos
              e acompanhe as publicacoes da comunidade.
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
                Entrar
              </Typography>
              <Typography color="text.secondary" fontSize={14}>
                Use a sua conta para voltar ao seu espaco Biishare.
              </Typography>
            </Box>

            {submittedEmail && (
              <Alert severity="success">
                Sessao iniciada para {submittedEmail}
              </Alert>
            )}

            {submitError && <Alert severity="error">{submitError}</Alert>}

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
              Entrar com Google
            </Button>

            <Divider>
              <Typography color="text.secondary" fontSize={12} fontWeight={700}>
                ou
              </Typography>
            </Divider>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={1.8}>
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

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  gap={1}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(event) =>
                          setRememberMe(event.target.checked)
                        }
                      />
                    }
                    label={
                      <Typography color="text.secondary" fontSize={14}>
                        Manter sessao iniciada
                      </Typography>
                    }
                  />
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    height: 48,
                    borderRadius: 2,
                    fontWeight: 900,
                    background: 'linear-gradient(135deg,#f59e0b,#fb923c)',
                  }}
                >
                  {isSubmitting ? 'A entrar...' : 'Entrar'}
                </Button>
              </Stack>
            </Box>

            <Typography
              color="text.secondary"
              fontSize={14}
              textAlign="center"
            >
              Ainda nao tem conta?{' '}
              <Link href="/register" style={{ fontWeight: 800 }}>
                Registar
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </main>
  )
}
