import { z } from "zod";

export const createChannelSchema = z.object({
    name: z.string().min(1),
    type: z.enum(["text", "call"]),
    serverId: z.number(), 
});

export type CreateChannelDto = z.infer<typeof createChannelSchema>;