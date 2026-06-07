import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(100, 'Nome demasiado longo'),

    email: z
      .string()
      .email('Email invalido')
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(6, 'Palavra-passe deve ter pelo menos 6 caracteres'),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As palavras-passe nao coincidem',
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z
    .string()
    .email('Email invalido')
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(6, 'Palavra-passe deve ter pelo menos 6 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
