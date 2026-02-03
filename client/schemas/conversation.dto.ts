import z from "zod";
import { MessageTypeEnum } from "@/enums/enum";
import { userSchema } from "@/schemas/user.dto";

export const conversationSchema = z.object({
    id: z.number(),
    user1: userSchema,
    user2: userSchema,
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const privateMessageSchema = z.object({
    id: z.number(),
    content: z.string(),
    type: MessageTypeEnum,
    sender: userSchema,
    conversation: z.number(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const sendPrivateMessageSchema = z.object({
    content: z.string().min(1, "Le message ne peut pas être vide"),
    type: MessageTypeEnum,
    conversationId: z.number(),
});

export const createConversationSchema = z.object({
    userId: z.number(),
});

export type conversationType = z.infer<typeof conversationSchema>;
export type privateMessageType = z.infer<typeof privateMessageSchema>;
export type sendPrivateMessageType = z.infer<typeof sendPrivateMessageSchema>;
export type createConversationType = z.infer<typeof createConversationSchema>;
