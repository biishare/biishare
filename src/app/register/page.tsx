import RegisterForm from '@/components/Auth/RegisterForm'
import { createMetadata } from '@/MetaData/baseMetadata'

export const metadata = createMetadata({
  title: 'Registo | Biishare',
  description:
    'Crie a sua conta Biishare para guardar conteudos, acompanhar progresso e participar nas recompensas da plataforma.',
  path: '/register',
})

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <RegisterForm />
    </div>
  )
}
