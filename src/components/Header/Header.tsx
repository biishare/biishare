'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { UserCircle, Zap } from 'lucide-react'

import { AuthUser, getAuthSession } from '../../../services/auth.service'

export default function Header({
  initialUser,
}: {
  initialUser?: AuthUser | null
}) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(initialUser ?? null)
  const profileHref = authUser?.username ? `/profile/${authUser.username}` : '/profile'
  const profileTooltip = authUser?.name || 'Perfil'

  useEffect(() => {
    if (initialUser !== undefined) {
      setAuthUser(initialUser)
      return
    }

    setAuthUser(getAuthSession()?.user ?? null)
  }, [initialUser])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: 0,
            flexShrink: 1,
            textDecoration: 'none',
          }}
          aria-label="Ir para a pagina inicial"
        >
          <Image
            src="/logo.svg"
            alt="Biishare"
            width={90}
            height={36}
            priority
            style={{
              width: 'auto',
              height: '32px',
              flexShrink: 0,
            }}
          />

          <Box
            sx={{
              width: '1px',
              height: '24px',
              backgroundColor: '#e5e7eb',
              flexShrink: 0,
            }}
          />

          <Typography
            fontWeight={900}
            sx={{
              background: 'linear-gradient(90deg,#FF7A00,#ff9f45)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '16px', sm: '18px' },
              lineHeight: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Biishare
          </Typography>
        </Link>

        <StackActions>
          <Tooltip title={profileTooltip}>
            <Link href={profileHref} style={{ textDecoration: 'none' }}>
              <IconButton
                aria-label={profileTooltip}
                sx={{
                  width: 42,
                  height: 42,
                  p: 0,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  color: '#f97316',
                  backgroundColor: '#fff',
                  '&:hover': {
                    backgroundColor: '#fff7ed',
                    borderColor: '#fed7aa',
                  },
                }}
              >
                {authUser?.avatarUrl ? (
                  <Avatar
                    src={authUser.avatarUrl}
                    alt={authUser.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#f8fafc',

                      '& .MuiAvatar-img': {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      },
                    }}
                  />
                ) : (
                  <UserCircle size={22} />
                )}
              </IconButton>
            </Link>
          </Tooltip>

          <Link href="/toque" style={{ textDecoration: 'none' }}>
            <Button
              startIcon={<Zap size={18} />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                minWidth: { xs: 44, sm: 158 },
                height: 42,
                px: { xs: 1.3, sm: 2.2 },
                borderRadius: '999px',
                whiteSpace: 'nowrap',
                color: '#fff',
                background: 'linear-gradient(135deg,#f59e0b,#fb923c)',
                boxShadow: '0 8px 20px rgba(245,158,11,.25)',
                transition: 'all .25s ease',

                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 28px rgba(245,158,11,.35)',
                  background: 'linear-gradient(135deg,#d97706,#f97316)',
                },

                '&:active': {
                  transform: 'scale(.97)',
                },

                '& .MuiButton-startIcon': {
                  mr: { xs: 0, sm: 1 },
                  ml: 0,
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  display: { xs: 'none', sm: 'inline' },
                  whiteSpace: 'nowrap',
                }}
              >
                Explorar Toques
              </Box>
            </Button>
          </Link>
        </StackActions>
      </div>
    </header>
  )
}

function StackActions({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 0.8, sm: 1 },
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  )
}
