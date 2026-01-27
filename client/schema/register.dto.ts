import z from "zod"

export const registerSchema = z.object({
  username: z.string().min(3, "Pseudo trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
  birthdate: z.string()

})

export type registerType = z.infer<typeof registerSchema>