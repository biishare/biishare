import RegisterForm from '@/components/Auth/RegisterForm'
import { createMetadata } from '@/MetaData/baseMetadata'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AUTH_PAGES_AVAILABLE } from '../../../constants/features'

export const metadata: Metadata = AUTH_PAGES_AVAILABLE
  ? createMetadata({
      title: 'Registo | Biishare',
      description:
        'Crie a sua conta Biishare para guardar conteudos, acompanhar progresso e participar nas recompensas da plataforma.',
      path: '/register',
    })
  : {
      title: 'Biishare',
      robots: {
        index: false,
        follow: false,
      },
    }

export default function RegisterPage() {
  if (!AUTH_PAGES_AVAILABLE) {
    notFound()
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <RegisterForm />
    </div>
  )
}
