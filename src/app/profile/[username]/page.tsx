import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import ProfileClient from '@/components/Profile/ProfileClient'
import { redirect } from 'next/navigation'

import { getRequiredServerUser } from '../../../../services/auth.server'

export default async function UserProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const user = await getRequiredServerUser()

  if (user.username && user.username !== params.username) {
    redirect(`/profile/${user.username}`)
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <Header initialUser={user} />
      <ProfileClient initialUser={user} expectedUsername={params.username} />
      <Footer />
    </div>
  )
}
