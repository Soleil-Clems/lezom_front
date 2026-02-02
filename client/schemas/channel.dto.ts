import z from "zod"
import {ChannelTypeEnum} from "@/enums/enum";


export const channelSchema = z.object({
    id: z.number(),
    name: z.string(),
    type: ChannelTypeEnum,
    createdAt: z.date().optional()
})

export type channelType = z.infer<typeof channelSchema>