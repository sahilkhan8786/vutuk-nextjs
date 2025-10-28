import { z } from "zod";

export const addCouponSchema = z.object({
    name: z.string().min(3, "Coupon name must be at least 3 characters"),
    type: z.enum(["percentage", "fixed"]),
    value: z.coerce.number().positive("Value must be greater than 0"),
    maxUses: z.coerce.number().int().positive("Max uses must be greater than 0"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export type CouponFormValues = z.infer<typeof addCouponSchema>;
