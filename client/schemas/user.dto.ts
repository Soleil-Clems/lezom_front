import z from "zod";

export const userSchema = z.object({
  id: z.string() || z.number(),
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  description: z.string(),
  email: z.email("Email invalide"),
  isActive: z.boolean(),
  role: z.string(),
  lastSeen: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // birthdate: z.string()
});

export const userUpdateSchema = z.object({
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  isActive: z.boolean(),
});

export type userType = z.infer<typeof userSchema>;
export type userUpdateType = z.infer<typeof userUpdateSchema>;
