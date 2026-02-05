import z from "zod"
import {MessageTypeEnum} from "@/enums/enum";
import {userSchema} from "@/schemas/user.dto";


export const messageSchema = z.object({
    id: z.string() || z.number(),
    content: z.string(),
    type: MessageTypeEnum,
    createdAt: z.date().optional(),
    author: userSchema,
})

export const sendMessageSchema = z.object({
    content: z.string().min(1, "Le message ne peut pas être vide"),
    type: MessageTypeEnum,
    channelId: z.string() || z.number(),
})

export type messageType = z.infer<typeof messageSchema>
export type sendMessageType = z.infer<typeof sendMessageSchema>