import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, { message: 'Au moins 8 caractères' })
  .regex(/[a-z]/, { message: 'Au moins une minuscule' })
  .regex(/[A-Z]/, { message: 'Au moins une majuscule' })
  .regex(/\d/, { message: 'Au moins un chiffre' });

export const LoginSchema = z.object({
  email: z.email({ message: 'Email invalide' }),
  password: z.string().min(1, { message: 'Mot de passe requis' }),
  captchaToken: z.string().min(1, 'Captcha requis').optional(),
});

export const RegisterSchema = z.object({
  firstname: z.string().min(2, 'Prénom trop court'),
  lastname: z.string().min(2, 'Nom trop court'),
  username: z.string().min(3, 'Pseudo trop court'),
  email: z.email({ message: 'Email invalide' }),
  password: passwordSchema,
  birthdate: z.string().min(1, 'Date de naissance requise'),
  captchaToken: z.string().min(1, 'Captcha requis').optional(),
});

export const ForgotPasswordSchema = z.object({
  email: z.email({ message: 'Email invalide' }),
});

export const ResetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type LoginType = z.infer<typeof LoginSchema>;
export type RegisterType = z.infer<typeof RegisterSchema>;
export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
