import z from 'zod';
import { userSchema } from '@/schemas/user.dto';

export const reactionSchema = z.object({
  id: z.number().or(z.string()),
  emoji: z.string(),
  author: userSchema,
});

export type reactionType = z.infer<typeof reactionSchema>;
