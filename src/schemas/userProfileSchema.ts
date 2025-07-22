import { z } from "zod";

export const formSchemaUserProfile = z.object({
    id: z.string().min(2).max(50),
    image: z.string().min(2).max(50),
    username: z.string().min(2).max(50),
    email: z.string().email(),
    isEmailVerfied: z.boolean(),
    phone: z
        .string()
        .min(10, { message: "Must be a valid mobile number" })
        .max(14, { message: "Must be a valid mobile number" }),
    isPhoneVerfied: z.boolean(),
    
});