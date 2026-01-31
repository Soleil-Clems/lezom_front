import z from "zod"

export const registerSchema = z.object({
  username: z.string().min(3, "Pseudo trop court"),
  firstname: z.string().min(3, "Firstname trop court"),
  lastname: z.string().min(3, "Lastname trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
  // birthdate: z.string()

})

export type registerType = z.infer<typeof registerSchema>