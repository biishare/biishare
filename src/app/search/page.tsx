import Header from '@/components/Header/Header'
import SearchPageClient from '@/components/Search/SearchPageClient'
import { Suspense } from 'react'

export const metadata = {
  title: 'Pesquisar | Biishare',
}

export default function SearchPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <Header autoHide={false} />
      <Suspense fallback={null}>
        <SearchPageClient />
      </Suspense>
    </div>
  )
}