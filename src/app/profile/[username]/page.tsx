import Header from '@/components/Header/Header'
import ProfileClient from '@/components/Profile/ProfileClient'
import { getRequiredServerUser } from '../../../../services/auth.server'
import { PROFILE_PAGE_AVAILABLE } from '../../../../constants/features'
import { notFound, redirect } from 'next/navigation'

export default async function UserProfilePage({
  params,
}: {
  params: { username: string }
}) {
  if (!PROFILE_PAGE_AVAILABLE) {
    notFound()
  }

  const user = await getRequiredServerUser()

  if (user.username && user.username !== params.username) {
    redirect(`/profile/${user.username}`)
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <Header initialUser={user} />
      <ProfileClient expectedUsername={params.username} initialUser={user} />
    </div>
  )
}
