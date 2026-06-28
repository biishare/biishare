import LoginForm from '@/components/Auth/LoginForm'
import { createMetadata } from '@/MetaData/baseMetadata'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AUTH_PAGES_AVAILABLE } from '../../../constants/features'

export const metadata: Metadata = AUTH_PAGES_AVAILABLE
  ? createMetadata({
      title: 'Login | Biishare',
      description:
        'Entre na sua conta Biishare para guardar conteudos, acompanhar progresso e usar recompensas da plataforma.',
      path: '/login',
    })
  : {
      title: 'Biishare',
      robots: {
        index: false,
        follow: false,
      },
    }

export default function LoginPage() {
  if (!AUTH_PAGES_AVAILABLE) {
    notFound()
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <LoginForm />
    </div>
  )
}
