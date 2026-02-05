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


export const createChannelSchema = z.object({
    name: z.string(),
    type: ChannelTypeEnum,
    serverId: z.number(),
})


export type channelType = z.infer<typeof channelSchema>
export type createChannelType = z.infer<typeof createChannelSchema>