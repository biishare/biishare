import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import ProfileClient from '@/components/Profile/ProfileClient'
import { PROFILE_PAGE_AVAILABLE } from '../../../../constants/features'
import { notFound } from 'next/navigation'

export default function UserProfilePage({
  params,
}: {
  params: { username: string }
}) {
  if (!PROFILE_PAGE_AVAILABLE) {
    notFound()
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <Header />
      <ProfileClient expectedUsername={params.username} />
      <Footer />
    </div>
  )
}
