import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, { message: "Au moins 8 caractères" })

export const LoginSchema = z.object({
  email: z.email({ message: "Email invalide" }),
  password: passwordSchema,
})

export const RegisterSchema = z.object({
  firstname: z.string().min(2, "Prénom trop court"),
  lastname: z.string().min(2, "Nom trop court"),
  username: z.string().min(3, "Pseudo trop court"),
  email: z.email({ message: "Email invalide" }),
  password: passwordSchema,
  birthdate: z.string().min(1, "Date de naissance requise"),
})

export type LoginType = z.infer<typeof LoginSchema>
export type RegisterType = z.infer<typeof RegisterSchema>
