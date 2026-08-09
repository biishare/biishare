import Header from '@/components/Header/Header'
import { SavedToquesFullPage } from '@/components/Profile/SavedContent'
import { notFound } from 'next/navigation'
import { PROFILE_PAGE_AVAILABLE } from '../../../../../constants/features'
import { getRequiredServerUser } from '../../../../../services/auth.server'

export const metadata = {
  title: 'Toques guardados | Biishare',
}

export default async function SavedToquesPage() {
  if (!PROFILE_PAGE_AVAILABLE) {
    notFound()
  }

  const user = await getRequiredServerUser()
  const profileHref = user.username ? `/profile/${user.username}` : '/profile'

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <Header initialUser={user} />
      <SavedToquesFullPage profileHref={profileHref} />
    </div>
  )
}
