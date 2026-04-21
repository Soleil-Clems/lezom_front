import { z } from 'zod';

export const ChannelTypeEnum = z.enum(['call', 'text']);
export const MessageTypeEnum = z.enum(['img', 'text', 'file', 'pdf', 'system', 'gif', 'voice']);

export type ChannelType = z.infer<typeof ChannelTypeEnum>;
export type MessageType = z.infer<typeof MessageTypeEnum>;
