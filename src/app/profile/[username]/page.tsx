import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import ProfileClient from '@/components/Profile/ProfileClient'

export default function UserProfilePage({
  params,
}: {
  params: { username: string }
}) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <Header />
      <ProfileClient expectedUsername={params.username} />
      <Footer />
    </div>
  )
}
