import * as z from 'zod';

export const formSchemaTeamMember = z.object({
    username: z.string().min(2).max(50),
    position: z.string().min(2).max(50),
    description: z.string().min(5),
    freelancerLink: z.string().url().optional(),
    facebookLink: z.string().url().optional(),
    instagramLink: z.string().url().optional(),
    twitterLink: z.string().url().optional(),
    image: z.any().optional(),
    isVisible:z.string()

})