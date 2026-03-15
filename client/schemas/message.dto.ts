import z from "zod";
import { MessageTypeEnum } from "@/enums/enum";
import { userSchema } from "@/schemas/user.dto";
import { reactionSchema } from "./reaction.dto";

export const messageSchema = z.object({
  id: z.coerce.number(),
  content: z.string(),
  type: MessageTypeEnum,
  createdAt: z.date().optional(),
  author: userSchema,
  reactions: z.array(reactionSchema).optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Le message ne peut pas être vide"),
  type: MessageTypeEnum,
  channelId: z.number(),
});

export const updateMessageParamsSchema = z.object({
  messageId: z.number(),
  content: z.string(),
});

export const channelMessagesPageSchema = z.object({
  messages: z.array(messageSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type messageType = z.infer<typeof messageSchema>;
export type sendMessageType = z.infer<typeof sendMessageSchema>;
export type UpdateMessageParamsType = z.infer<typeof updateMessageParamsSchema>;
export type ChannelMessagesPageType = z.infer<typeof channelMessagesPageSchema>;
