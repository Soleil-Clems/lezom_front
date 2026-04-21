import z from 'zod';

export const serversSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.url().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const leaveServerParamsSchema = z.object({
  serverId: z.union([z.string(), z.number()]),
  newOwnerId: z.number().optional(),
});

export const transferOwnershipParamsSchema = z.object({
  serverId: z.union([z.string(), z.number()]),
  newOwnerId: z.number(),
});

export type serversType = z.infer<typeof serversSchema>;
export type LeaveServerParamsType = z.infer<typeof leaveServerParamsSchema>;
export type TransferOwnershipParamsType = z.infer<typeof transferOwnershipParamsSchema>;
