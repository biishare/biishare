import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { AUTH_PAGES_AVAILABLE } from '../../../constants/features'

export const metadata: Metadata = {
  title: 'Iniciar sessao | Biishare',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RegisterPage() {
  if (!AUTH_PAGES_AVAILABLE) {
    notFound()
  }

  redirect('/login')
}
