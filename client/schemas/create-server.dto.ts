import { z } from "zod";

export const createServerSchema = z.object({
    name: z.string().min(1, "Le nom du serveur est requis"),
});

export type CreateServerDto = z.infer<typeof createServerSchema>;