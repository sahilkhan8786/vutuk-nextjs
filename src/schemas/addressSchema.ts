import { z } from "zod";

export const addressFormSchema = z.object({
    firstName: z.string().min(2, { message: "Username must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email('Email is not valid'),
    countryCode: z.string(),
    phoneNumber: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    pinCode: z.string(),
    isBusiness: z.boolean(),
    gstNumber: z.string().optional(),
    firmName: z.string().optional(),
})


export type AddressFromType = z.infer<typeof addressFormSchema>