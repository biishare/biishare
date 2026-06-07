import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  registerSchema,
  RegisterFormValues,
} from '../lib/validations/auth'

export const registerFormDefaultValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export function useUserRegisterForm() {
  return useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: registerFormDefaultValues,
  })
}
