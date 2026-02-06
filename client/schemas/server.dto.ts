import z from "zod"

export const serversSchema = z.object({
    id: z.number(),
    name: z.string(),
    image: z.url().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export type serversType = z.infer<typeof serversSchema>