import Header from '@/components/Header/Header'
import CreatorApplicationClient from '@/components/Profile/CreatorApplicationClient'
import { notFound } from 'next/navigation'
import { PROFILE_PAGE_AVAILABLE } from '../../../../constants/features'
import { getRequiredServerUser } from '../../../../services/auth.server'

export const metadata = {
  title: 'Ser criador | Biishare',
}

export default async function CreatorApplicationPage() {
  if (!PROFILE_PAGE_AVAILABLE) {
    notFound()
  }

  const user = await getRequiredServerUser()
  const profileHref = user.username ? `/profile/${user.username}` : '/profile'

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <Header initialUser={user} />
      <main className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
        <CreatorApplicationClient authUser={user} profileHref={profileHref} />
      </main>
    </div>
  )
}
