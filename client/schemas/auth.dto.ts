import { z } from 'zod'


export const LoginSchema = z.object({
    email: z.email({ message: "Email invalide" }),
    password: z.string()
        .min(8, { message: "Au moins 8 caractères!" })
    /* .refine((password) => /[A-Z]/.test(password), {
       message: "Doit contenir au moins 1 majuscule"
     })
     .refine((password) => /[a-z]/.test(password), {
       message: "Doit contenir au moins 1 minuscule"
     })
     .refine((password) => /[0-9]/.test(password), {
       message: "Doit contenir au moins 1 chiffre"
     })
     .refine((password) => /[!#@$*^%&]/.test(password), {
       message: "Doit contenir au moins 1 caractère spécial"
     })*/
})

