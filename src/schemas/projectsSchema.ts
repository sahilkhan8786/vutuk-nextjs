import * as z from 'zod';

export const formSchemaProjects = z.object({
    projectName: z.string().min(2).max(50),
    description: z.string().min(5),
    image: z.any(),
    stream: z.enum(["media", "design", "web-development"]),
    contentType: z.enum(['data', 'web']),
    websiteUrl: z.string().optional(),      
    relatedToService: z.string().min(2).max(50).optional(),
    projectDataImages: z.any().array().optional(), // Images (files)
    projectDataYoutubeUrls: z.string().optional(),
    existingImages: z.string().array().optional(),
    deletedImages: z.string().array().optional(),
})