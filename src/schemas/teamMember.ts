import * as z from 'zod';

export const formSchemaTeamMember = z.object({
    username: z.string().min(2).max(50),
    position: z.string().min(2).max(50),
    description: z.string().min(5),
    freelancerLink: z.string().url(),
    facebookLink: z.string().url(),
    instagramLink: z.string().url(),
    twitterLink: z.string().url(),
    image: z.any().refine(file => file?.length === 1, "Image is required").optional()

})