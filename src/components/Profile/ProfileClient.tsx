'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import {
  GraduationCap,
  LogOut,
} from 'lucide-react'

import {
  AuthUser,
  clearAuthSession,
  getCurrentUser,
  logoutUser,
  saveAuthUser,
} from '../../../services/auth.service'
import { getLoginRedirectPath } from '../../../constants/features'
import ProfileImageUploader from './ProfileImageUploader'
import CreatorPublications from './CreatorPublications'
import { SavedContentPreview } from './SavedContent'



export default function ProfileClient({
  expectedUsername,
  initialUser,
  redirectToUsername = false,
}: {
  expectedUsername?: string
  initialUser?: AuthUser
  redirectToUsername?: boolean
}) {
  const router = useRouter()
  const [authUser, setAuthUser] = useState<AuthUser | null>(initialUser ?? null)
  const [isCheckingSession, setIsCheckingSession] = useState(!initialUser)

  useEffect(() => {
    const redirectToCanonicalProfile = (user: AuthUser) => {
      if (redirectToUsername && user.username) {
        router.replace(`/profile/${user.username}`)
        return true
      }

      if (expectedUsername && user.username && user.username !== expectedUsername) {
        router.replace(`/profile/${user.username}`)
        return true
      }

      return false
    }

    if (initialUser) {
      saveAuthUser(initialUser)
      setAuthUser(initialUser)
      setIsCheckingSession(false)
      redirectToCanonicalProfile(initialUser)
      return
    }

    getCurrentUser()
      .then((user) => {
        saveAuthUser(user)
        setAuthUser(user)
        redirectToCanonicalProfile(user)
      })
      .catch(() => {
        clearAuthSession()
        router.replace(getLoginRedirectPath())
      })
      .finally(() => setIsCheckingSession(false))
  }, [expectedUsername, initialUser, redirectToUsername, router])

  const handleLogout = () => {
    logoutUser()
      .catch(() => undefined)
      .finally(() => {
        clearAuthSession()
        setAuthUser(null)
        router.replace(getLoginRedirectPath())
        router.refresh()
      })
  }

  if (isCheckingSession || !authUser) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e5e7eb',
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            background: '#fff',
          }}
        >
          <Typography fontWeight={900}>A verificar sessao...</Typography>
          <Typography color="text.secondary" mt={0.5}>
            Aguarde um momento.
          </Typography>
        </Paper>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: { xs: 1.5, lg: 2 },
          alignItems: 'stretch',
        }}
      >
        <ProfileHero
          avatarUrl={authUser.avatarUrl}
          coverUrl={authUser.coverUrl}
          email={authUser.email}
          name={authUser.name}
          onLogout={handleLogout}
          onUserUpdated={setAuthUser}
          username={authUser.username}
        />
      </Box>

      <CreatorPublications authUser={authUser} />

      <SavedContentPreview />

      {!authUser.isCreator && authUser.creatorStatus !== 'approved' && (
        <Box sx={{ mt: 2.4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            component={Link}
            href="/profile/criador"
            variant="outlined"
            startIcon={<GraduationCap size={17} />}
            sx={{
              minHeight: 42,
              px: 1.8,
              borderRadius: 2,
              color: '#ea580c',
              borderColor: '#fed7aa',
              background: '#fff',
              fontWeight: 900,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#fb923c',
                background: '#fff7ed',
              },
            }}
          >
            Ser criador
          </Button>
        </Box>
      )}
    </main>
  )
}

function ProfileHero({
  avatarUrl,
  coverUrl,
  email,
  name,
  onLogout,
  onUserUpdated,
  username,
}: {
  avatarUrl?: string
  coverUrl?: string
  email: string
  name: string
  onLogout: () => void
  onUserUpdated: (user: AuthUser) => void
  username?: string
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 174, md: 190 },
        height: '100%',
        borderRadius: 2,
        p: { xs: 2, md: 2.5 },
        border: '1px solid #e5e7eb',
        background: coverUrl
          ? `linear-gradient(90deg, rgba(15,23,42,.82), rgba(15,23,42,.28)), url(${coverUrl}) center/cover`
          : 'linear-gradient(135deg, #ffffff 0%, #ffffff 58%, #fffaf3 100%)',

        '&:hover .profile-cover-action, &:focus-within .profile-cover-action': {
          opacity: 1,
          pointerEvents: 'auto',
        },
      }}
    >
      <ProfileImageUploader
        slot="cover"
        onUserUpdated={onUserUpdated}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={{ xs: 1.6, md: 2.2 }}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box
          sx={{
            position: 'relative',
            flexShrink: 0,

            '&:hover .profile-avatar-action, &:focus-within .profile-avatar-action': {
              opacity: 1,
              pointerEvents: 'auto',
            },
          }}
        >
          <Avatar
            src={avatarUrl}
            alt={name}
            sx={{
              width: { xs: 88, md: 112 },
              height: { xs: 88, md: 112 },
              border: coverUrl
                ? '3px solid rgba(255,255,255,.9)'
                : '3px solid #fff',
              background: 'linear-gradient(145deg,#475569,#111827)',
              boxShadow: '0 18px 38px rgba(15,23,42,.18)',
              overflow: 'hidden',

              '& .MuiAvatar-img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
            }}
          >
            {!avatarUrl && (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',

                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '22%',
                    left: '50%',
                    width: '34%',
                    height: '34%',
                    borderRadius: '50%',
                    background: '#fff',
                    transform: 'translateX(-50%)',
                  },

                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: '18%',
                    right: '18%',
                    bottom: '-4%',
                    height: '48%',
                    borderRadius: '50% 50% 0 0',
                    background: '#fff',
                  },
                }}
              />
            )}
          </Avatar>

          <ProfileImageUploader
            slot="avatar"
            onUserUpdated={onUserUpdated}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: 26, md: 31 },
              fontWeight: 900,
              lineHeight: 1.05,
              color: coverUrl ? '#fff' : '#111827',
              pr: { xs: 10, md: 0 },
            }}
          >
            {name}
          </Typography>

          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" mt={0.8}>
            {username && (
              <Chip
                size="small"
                label={`@${username}`}
                sx={{
                  height: 24,
                  borderRadius: 1.5,
                  fontWeight: 800,
                  color: coverUrl ? '#fff' : '#ea580c',
                  background: coverUrl ? 'rgba(255,255,255,.16)' : '#fff7ed',
                }}
              />
            )}
            <Typography
              color={coverUrl ? 'rgba(255,255,255,.82)' : 'text.secondary'}
              fontSize={14}
            >
              {email}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            flexWrap="wrap"
            sx={{
              mt: 1.8,
            }}
          >

            <Button
              variant="text"
              onClick={onLogout}
              startIcon={<LogOut size={16} />}
              sx={{
                height: 38,
                px: 1.25,
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 800,
                color: coverUrl ? 'rgba(255,255,255,.84)' : '#64748b',
                border: '1px solid',
                borderColor: coverUrl ? 'rgba(255,255,255,.18)' : '#e5e7eb',
                background: coverUrl ? 'rgba(255,255,255,.08)' : 'transparent',

                '&:hover': {
                  color: coverUrl ? '#fff' : '#334155',
                  borderColor: coverUrl ? 'rgba(255,255,255,.32)' : '#cbd5e1',
                  background: coverUrl ? 'rgba(255,255,255,.14)' : '#f8fafc',
                },

                '& .MuiButton-startIcon': {
                  mr: 0.7,
                },
              }}
            >
              Sair
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}


