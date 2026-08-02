import type { Metadata } from 'next'

import Header from '@/components/Header/Header'
import NotFoundSearchCard from '@/components/Search/NotFoundSearchCard'

export const metadata: Metadata = {
  title: 'Pagina nao encontrada | Biishare',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <Header autoHide={false} />

      <div className="flex min-h-[calc(100dvh_-_var(--mobile-nav-height,0px)_-_64px)] items-center justify-center px-4 py-10 sm:px-6 md:min-h-screen md:py-14">
        <NotFoundSearchCard />
      </div>
    </div>
  )
}
