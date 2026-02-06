import z from "zod"

export const memberSchema = z.object({
    id: z.number(),
    username: z.string(),
})

export const membershipSchema = z.object({
    id: z.number(),
    role: z.enum(["server_owner", "server_admin", "server_moderator", "server_member"]),
    members: memberSchema,
})

export const getMembersResponseSchema = z.object({
    data: z.array(membershipSchema),
    meta: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
        hasNextPage: z.boolean(),
        hasPreviousPage: z.boolean(),
    }),
})

export type MemberType = z.infer<typeof memberSchema>
export type MembershipType = z.infer<typeof membershipSchema>
export type GetMembersResponseType = z.infer<typeof getMembersResponseSchema>

export type GetMembersParams = {
    page?: number
    limit?: number
    search?: string
}
