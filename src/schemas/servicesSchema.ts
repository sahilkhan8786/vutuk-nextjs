import * as z from 'zod';

export const formSchemaServices = z.object({
    servicename: z.string().min(2).max(50),
    description: z.string().min(5),
    stream: z.enum(["media", "design", "web-development"]),
    image: z.any().optional()

})