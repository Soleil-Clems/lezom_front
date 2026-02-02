import z from "zod"

export const userSchema = z.object({
    id: z.number(),
    username: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    email: z.email("Email invalide"),
    isActive: z.boolean(),
    role: z.string(),
    lastSeen: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
    // birthdate: z.string()

})

export type userType = z.infer<typeof userSchema>