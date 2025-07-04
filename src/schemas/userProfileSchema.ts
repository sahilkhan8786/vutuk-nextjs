import { z } from "zod";

export const formSchemaUserProfile = z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    isEmailVerfied: z.boolean(),
    phone: z
        .string()
        .min(10, { message: "Must be a valid mobile number" })
        .max(14, { message: "Must be a valid mobile number" }),
    isPhoneVerfied: z.boolean(),
    deliverAddress: z.array(
        z.object({
            shippingAddressLine1: z.string(),
            shippingAddressLine2: z.string().optional(),
            country: z.string(),
            pinCode: z.number(),
            state: z.string(),
            city: z.string(),
        })
    ),
});