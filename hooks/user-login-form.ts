import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { loginSchema, LoginFormValues } from '../lib/validations/auth'

export const loginFormDefaultValues: LoginFormValues = {
  email: '',
  password: '',
}

export function useUserLoginForm() {
  return useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: loginFormDefaultValues,
  })
}
