'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Tooltip } from '@mui/material'
import { UserCircle, Zap } from 'lucide-react'

import { AuthUser, getAuthSession } from '../../../services/auth.service'
import { PROFILE_PAGE_AVAILABLE } from '../../../constants/features'

export default function Header({
  initialUser,
}: {
  initialUser?: AuthUser | null
}) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(
    PROFILE_PAGE_AVAILABLE ? initialUser ?? null : null
  )
  const profileHref = authUser?.username ? `/profile/${authUser.username}` : '/profile'
  const profileTooltip = authUser?.name || 'Perfil'

  useEffect(() => {
    if (!PROFILE_PAGE_AVAILABLE) {
      return
    }

    if (initialUser !== undefined) {
      setAuthUser(initialUser)
      return
    }

    setAuthUser(getAuthSession()?.user ?? null)
  }, [initialUser])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 overflow-hidden px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center gap-2.5 no-underline"
          aria-label="Ir para a pagina inicial"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Image
              src="/logo.svg"
              alt=""
              width={32}
              height={32}
              priority
              sizes="32px"
              className="block h-8 w-8 object-contain"
            />
          </span>

          <span aria-hidden className="h-6 w-px shrink-0 bg-slate-200" />

          <span
            className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-black leading-none sm:text-lg"
            style={{
              background: 'linear-gradient(90deg,#FF7A00,#ff9f45)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Biishare
          </span>
        </Link>

        <StackActions>
          {PROFILE_PAGE_AVAILABLE && (
            <Tooltip title={profileTooltip}>
              <Link
                href={profileHref}
                aria-label={profileTooltip}
                className="grid h-[42px] w-[42px] shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-white text-orange-500 no-underline transition hover:border-orange-200 hover:bg-orange-50"
              >
                {authUser?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={authUser.avatarUrl}
                    alt={authUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle size={22} />
                )}
              </Link>
            </Tooltip>
          )}

          <Link
            href="/toque"
            aria-label="Explorar Toques"
            className="inline-flex h-[42px] min-w-11 shrink-0 items-center justify-center gap-0 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 px-[13px] font-bold text-white no-underline shadow-[0_8px_20px_rgba(245,158,11,.25)] transition hover:-translate-y-0.5 hover:from-amber-600 hover:to-orange-500 hover:shadow-[0_12px_28px_rgba(245,158,11,.35)] active:scale-[.97] sm:min-w-[158px] sm:gap-2 sm:px-[22px]"
          >
            <Zap size={18} className="shrink-0" />
            <span className="hidden whitespace-nowrap sm:inline">
              Explorar Toques
            </span>
          </Link>
        </StackActions>
      </div>
    </header>
  )
}

function StackActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[42px] shrink-0 items-center justify-end gap-2">
      {children}
    </div>
  )
}
