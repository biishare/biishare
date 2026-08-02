'use client'

import Image from 'next/image'
import Link from 'next/link'

import SearchAction from '@/components/Search/SearchAction'
import { useFeedChrome } from '../../../hooks/useFeedChrome'
import type { AuthUser } from '../../../services/auth.service'

export default function Header({
  initialUser: _initialUser,
  autoHide = true,
}: {
  initialUser?: AuthUser | null
  autoHide?: boolean
}) {
  const { isHeaderVisible } = useFeedChrome()
  const visible = autoHide ? isHeaderVisible : true

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur md:hidden"
      style={{
        transform: visible
          ? 'translate3d(0, 0, 0)'
          : 'translate3d(0, -100%, 0)',
        transition: 'transform 180ms ease',
        willChange: 'transform',
      }}
    >
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
          <SearchAction />
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
