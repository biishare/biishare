'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, Box, Drawer, Tooltip, Typography } from '@mui/material'
import {
  FileText,
  HelpCircle,
  Home,
  Info,
  LogIn,
  MoreHorizontal,
  Shield,
  UserCircle,
  Zap,
} from 'lucide-react'

import {
  AUTH_SESSION_CHANGED_EVENT,
  AuthUser,
  getAuthSession,
  getCurrentUser,
  saveAuthUser,
} from '../../../services/auth.service'
import { PROFILE_PAGE_AVAILABLE } from '../../../constants/features'
import SearchAction from '@/components/Search/SearchAction'

const COMPACT_NAV_WIDTH = 82
const EXPANDED_NAV_WIDTH = 236
const MOBILE_NAV_HEIGHT = 66

const primaryNavItems = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
    match: (pathname: string) => pathname === '/',
  },
  {
    href: '/toque',
    label: 'Toques',
    icon: Zap,
    match: (pathname: string) => pathname.startsWith('/toque'),
  },
]

const secondaryNavItems = [
  {
    href: '/about',
    label: 'Sobre',
    icon: Info,
    match: (pathname: string) => pathname.startsWith('/about'),
  },
  {
    href: '/faq',
    label: 'FAQ',
    icon: HelpCircle,
    match: (pathname: string) => pathname.startsWith('/faq'),
  },
  {
    href: '/privacy',
    label: 'Privacidade',
    icon: Shield,
    match: (pathname: string) => pathname.startsWith('/privacy'),
  },
  {
    href: '/terms',
    label: 'Termos',
    icon: FileText,
    match: (pathname: string) => pathname.startsWith('/terms'),
  },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        '--desktop-nav-width': {
          md: `${COMPACT_NAV_WIDTH}px`,
          xl: `${EXPANDED_NAV_WIDTH}px`,
        },
        '--mobile-nav-height': `${MOBILE_NAV_HEIGHT}px`,
      }}
    >
      <DesktopNavigation />

      <Box
        component="main"
        sx={{
          minWidth: 0,
          minHeight: '100dvh',
          pb: {
            xs: 'var(--mobile-nav-height)',
            md: 0,
          },
          ml: {
            md: 'var(--desktop-nav-width)',
          },
        }}
      >
        {children}
      </Box>

      <MobileNavigation />
    </Box>
  )
}

function DesktopNavigation() {
  const pathname = usePathname()
  const { authUser, profileHref } = useNavigationUser()
  const authHref = authUser ? profileHref : '/login'
  const authLabel = authUser ? getNavigationUserLabel(authUser) : 'Iniciar sessao'
  const authActive = authUser
    ? pathname.startsWith('/profile')
    : pathname.startsWith('/login')

  return (
    <Box
      component="aside"
      sx={{
        display: {
          xs: 'none',
          md: 'flex',
        },
        position: 'fixed',
        inset: '0 auto 0 0',
        zIndex: 70,
        width: 'var(--desktop-nav-width)',
        flexDirection: 'column',
        borderRight: '1px solid #e2e8f0',
        bgcolor: 'rgba(255,255,255,.96)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <Box
        component={Link}
        href="/"
        aria-label="Biishare"
        sx={{
          display: 'flex',
          minHeight: 74,
          alignItems: 'center',
          gap: 1.4,
          px: {
            md: 0,
            xl: 2.2,
          },
          justifyContent: {
            md: 'center',
            xl: 'flex-start',
          },
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            width: 38,
            height: 38,
            flexShrink: 0,
            placeItems: 'center',
          }}
        >
          <Image
            src="/logo.svg"
            alt=""
            width={36}
            height={36}
            priority
            sizes="36px"
            className="block h-9 w-9 object-contain"
          />
        </Box>

        <Typography
          component="span"
          sx={{
            display: {
              md: 'none',
              xl: 'inline',
            },
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 20,
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(90deg,#FF7A00,#ff9f45)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Biishare
        </Typography>
      </Box>

      <Box
        component="nav"
        aria-label="Navegacao principal"
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          gap: 0.5,
          px: {
            md: 1,
            xl: 1.4,
          },
          py: 1,
        }}
      >
        {primaryNavItems.slice(0, 1).map((item) => (
          <NavigationItem
            key={item.href}
            href={item.href}
            label={item.label}
            active={item.match(pathname)}
            icon={<item.icon size={22} strokeWidth={2.2} />}
          />
        ))}

        <SearchAction variant="navigation" />

        {primaryNavItems.slice(1).map((item) => (
          <NavigationItem
            key={item.href}
            href={item.href}
            label={item.label}
            active={item.match(pathname)}
            icon={<item.icon size={22} strokeWidth={2.2} />}
          />
        ))}

        <Box sx={{ flex: 1 }} />

        {PROFILE_PAGE_AVAILABLE && (
          <NavigationItem
            href={authHref}
            label={authLabel}
            active={authActive}
            icon={
              authUser?.avatarUrl ? (
                <Avatar
                  src={authUser.avatarUrl}
                  alt={authUser.name}
                  sx={{
                    width: 26,
                    height: 26,
                  }}
                />
              ) : authUser ? (
                <UserCircle size={24} strokeWidth={2.1} />
              ) : (
                <LogIn size={23} strokeWidth={2.1} />
              )
            }
          />
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.2,
            borderTop: '1px solid #f1f5f9',
            pt: 1,
            mt: 1,
          }}
        >
          {secondaryNavItems.map((item) => (
            <NavigationItem
              key={item.href}
              href={item.href}
              label={item.label}
              active={item.match(pathname)}
              subtle
              icon={<item.icon size={18} strokeWidth={2} />}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

function MobileNavigation() {
  const pathname = usePathname()
  const { authUser, profileHref } = useNavigationUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const authHref = authUser ? profileHref : '/login'
  const authLabel = authUser ? getNavigationUserLabel(authUser) : 'Iniciar sessao'
  const authActive = authUser
    ? pathname.startsWith('/profile')
    : pathname.startsWith('/login')

  return (
    <>
      <Box
        component="nav"
        aria-label="Navegacao principal mobile"
        sx={{
          display: {
            xs: 'grid',
            md: 'none',
          },
          position: 'fixed',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 80,
          height: 'var(--mobile-nav-height)',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid #e2e8f0',
          bgcolor: 'rgba(255,255,255,.96)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {primaryNavItems.map((item) => (
          <MobileNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            active={item.match(pathname)}
            icon={<item.icon size={22} strokeWidth={2.2} />}
          />
        ))}

        {PROFILE_PAGE_AVAILABLE && (
          <MobileNavItem
            href={authHref}
            label={authLabel}
            active={authActive}
            icon={
              authUser?.avatarUrl ? (
                <Avatar
                  src={authUser.avatarUrl}
                  alt={authUser.name}
                  sx={{ width: 24, height: 24 }}
                />
              ) : authUser ? (
                <UserCircle size={23} strokeWidth={2.1} />
              ) : (
                <LogIn size={22} strokeWidth={2.1} />
              )
            }
          />
        )}

        <MobileMenuButton
          active={secondaryNavItems.some((item) => item.match(pathname))}
          onClick={() => setMenuOpen(true)}
        />
      </Box>

      <Drawer
        anchor="bottom"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            pb: 'max(18px, env(safe-area-inset-bottom))',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            px: 2,
            pt: 1.4,
          }}
        >
          <Box
            aria-hidden
            sx={{
              width: 38,
              height: 4,
              mx: 'auto',
              mb: 1.5,
              borderRadius: 999,
              bgcolor: '#cbd5e1',
            }}
          />

          <Typography
            sx={{
              px: 1,
              pb: 1,
              color: '#64748b',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
            }}
          >
            Informacao
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gap: 0.25,
            }}
          >
            {secondaryNavItems.map((item) => (
              <Box
                key={item.href}
                component={Link}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                sx={{
                  display: 'flex',
                  minHeight: 48,
                  alignItems: 'center',
                  gap: 1.4,
                  borderRadius: 2,
                  px: 1.2,
                  color: item.match(pathname) ? '#c2410c' : '#475569',
                  bgcolor: item.match(pathname) ? '#fff7ed' : 'transparent',
                  fontSize: 15,
                  fontWeight: item.match(pathname) ? 800 : 650,
                  textDecoration: 'none',
                  '&:hover': {
                    bgcolor: '#f8fafc',
                    color: '#c2410c',
                  },
                }}
              >
                <item.icon size={19} strokeWidth={2} />
                {item.label}
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

function useNavigationUser() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (!PROFILE_PAGE_AVAILABLE) return

    let isMounted = true

    const syncAuthUser = () => {
      setAuthUser(getAuthSession()?.user ?? null)
    }

    syncAuthUser()

    if (!getAuthSession()) {
      getCurrentUser()
        .then((user) => {
          if (!isMounted) {
            return
          }

          saveAuthUser(user)
          setAuthUser(user)
        })
        .catch(() => undefined)
    }

    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, syncAuthUser)
    window.addEventListener('storage', syncAuthUser)

    return () => {
      isMounted = false
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, syncAuthUser)
      window.removeEventListener('storage', syncAuthUser)
    }
  }, [])

  return {
    authUser,
    profileHref: authUser?.username
      ? `/profile/${authUser.username}`
      : '/profile',
  }
}


function getNavigationUserLabel(user: AuthUser) {
  if (user.username) {
    return `@${user.username}`
  }

  return user.name.trim().split(/\s+/)[0] || 'Perfil'
}

function NavigationItem({
  href,
  label,
  active,
  icon,
  subtle = false,
}: {
  href: string
  label: string
  active: boolean
  icon: React.ReactNode
  subtle?: boolean
}) {
  const item = (
    <Box
      component={Link}
      href={href}
      aria-current={active ? 'page' : undefined}
      sx={{
        display: 'flex',
        minHeight: 50,
        alignItems: 'center',
        gap: 1.6,
        borderRadius: 2,
        px: {
          md: 0,
          xl: 1.8,
        },
        justifyContent: {
          md: 'center',
          xl: 'flex-start',
        },
        color: active ? '#c2410c' : subtle ? '#64748b' : '#334155',
        bgcolor: active ? '#fff7ed' : 'transparent',
        fontWeight: active ? 800 : 650,
        opacity: subtle && !active ? 0.82 : 1,
        textDecoration: 'none',
        transition:
          'background-color 160ms ease, color 160ms ease, transform 160ms ease',
        '&:hover': {
          bgcolor: active ? '#fff7ed' : '#f8fafc',
          color: '#c2410c',
          opacity: 1,
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
        {icon}
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
          fontSize: subtle ? 13 : 15,
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  )

  return (
    <Tooltip
      title={label}
      placement="right"
      arrow
      slotProps={{
        tooltip: {
          sx: {
            display: {
              xl: 'none',
            },
          },
        },
      }}
    >
      {item}
    </Tooltip>
  )
}

function MobileNavItem({
  href,
  label,
  active,
  icon,
}: {
  href: string
  label: string
  active: boolean
  icon: React.ReactNode
}) {
  return (
    <Box
      component={Link}
      href={href}
      aria-current={active ? 'page' : undefined}
      sx={{
        display: 'flex',
        minWidth: 0,
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.35,
        color: active ? '#c2410c' : '#475569',
        fontSize: 11,
        fontWeight: active ? 800 : 650,
        textDecoration: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {icon}
      <Box
        component="span"
        sx={{
          maxWidth: '100%',
          overflow: 'hidden',
          px: 0.4,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Box>
    </Box>
  )
}

function MobileMenuButton({
  active,
  onClick,
}: {
  active: boolean
  onClick: () => void
}) {
  return (
    <Box
      component="button"
      type="button"
      aria-label="Mais opcoes"
      onClick={onClick}
      sx={{
        display: 'flex',
        minWidth: 0,
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.35,
        border: 0,
        bgcolor: 'transparent',
        color: active ? '#c2410c' : '#475569',
        font: 'inherit',
        fontSize: 11,
        fontWeight: active ? 800 : 650,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <MoreHorizontal size={23} strokeWidth={2.2} />
      <Box
        component="span"
        sx={{
          maxWidth: '100%',
          overflow: 'hidden',
          px: 0.4,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        Mais
      </Box>
    </Box>
  )
}
