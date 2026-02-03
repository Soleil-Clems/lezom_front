import z from "zod"
import {ChannelTypeEnum} from "@/enums/enum";
import {messageSchema} from "@/schemas/message.dto";
import {serversSchema} from "@/schemas/server.dto";


export const channelSchema = z.object({
    id: z.number(),
    name: z.string(),
    type: ChannelTypeEnum,
    createdAt: z.date().optional(),
    messages: messageSchema.optional(),
    server: serversSchema.optional(),
})

export type channelType = z.infer<typeof channelSchema>