import LoginForm from '@/components/Auth/LoginForm'
import { createMetadata } from '@/MetaData/baseMetadata'

export const metadata = createMetadata({
  title: 'Login | Biishare',
  description:
    'Entre na sua conta Biishare para guardar conteudos, acompanhar progresso e usar recompensas da plataforma.',
  path: '/login',
})

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <LoginForm />
    </div>
  )
}
