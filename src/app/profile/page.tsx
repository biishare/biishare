import Header from '@/components/Header/Header'
import ProfileClient from '@/components/Profile/ProfileClient'
import { getRequiredServerUser } from '../../../services/auth.server'
import { PROFILE_PAGE_AVAILABLE } from '../../../constants/features'
import { notFound, redirect } from 'next/navigation'

type ProfilePageProps = {
  searchParams?: {
    auth_error?: string | string[]
  }
}

function getSearchParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  if (!PROFILE_PAGE_AVAILABLE) {
    notFound()
  }

  const authError = getSearchParamValue(searchParams?.auth_error)

  if (authError) {
    const params = new URLSearchParams({ auth_error: authError })
    redirect(`/login?${params.toString()}`)
  }

  const user = await getRequiredServerUser()

  if (user.username) {
    redirect(`/profile/${user.username}`)
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <Header initialUser={user} />
      <ProfileClient initialUser={user} redirectToUsername />
    </div>
  )
}
