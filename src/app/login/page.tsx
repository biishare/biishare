import LoginForm from '@/components/Auth/LoginForm'
import Header from '@/components/Header/Header'
import { createMetadata } from '@/MetaData/baseMetadata'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AUTH_PAGES_AVAILABLE } from '../../../constants/features'

type LoginPageProps = {
  searchParams?: {
    auth_error?: string | string[]
  }
}

function getSearchParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export const metadata: Metadata = AUTH_PAGES_AVAILABLE
  ? createMetadata({
      title: 'Iniciar sessao | Biishare',
      description:
        'Inicie sessao na Biishare com Google ou Facebook para guardar conteudos, acompanhar progresso e usar recompensas da plataforma.',
      path: '/login',
    })
  : {
      title: 'Biishare',
      robots: {
        index: false,
        follow: false,
      },
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  if (!AUTH_PAGES_AVAILABLE) {
    notFound()
  }

  const authError = getSearchParamValue(searchParams?.auth_error)

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <Header autoHide={false} />
      <LoginForm authError={authError} />
    </div>
  )
}
