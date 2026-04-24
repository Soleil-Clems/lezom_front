import z from 'zod';

export const userSchema = z.object({
  id: z.coerce.number(),
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  description: z.string(),
  email: z.email('Email invalide'),
  isActive: z.boolean(),
  isTwoFactorEnabled: z.boolean(),
  role: z.string(),
  img: z.string().nullish(),
  banner: z.string().nullish(),
  lastSeen: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // birthdate: z.string()
});

export const userUpdateSchema = z.object({
  username: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  isActive: z.boolean().optional(),
  isTwoFactorEnabled: z.boolean().optional(),
});

export type userType = z.infer<typeof userSchema>;
export type userUpdateType = z.infer<typeof userUpdateSchema>;
