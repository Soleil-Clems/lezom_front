import z from "zod"
import {MessageTypeEnum} from "@/enums/enum";
import {userSchema} from "@/schemas/user.dto";


export const messageSchema = z.object({
    id: z.number(),
    content: z.string(),
    type: MessageTypeEnum,
    createdAt: z.date().optional(),
    author: userSchema,
})

export type messageType = z.infer<typeof messageSchema>