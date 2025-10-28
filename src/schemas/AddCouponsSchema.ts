import { z } from "zod";

export const addCouponSchema = z.object({
    name: z.string().min(1, "Coupon name is required"),
    type: z.enum(["percentage", "fixed"]),
    value: z.number().min(0, "Value must be positive"),
    maxUses: z.number().min(1, "Must allow at least one use"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean(), // ✅ strictly boolean, not string or undefined
});

// ✅ Export the inferred TypeScript type
export type CouponFormValues = z.infer<typeof addCouponSchema>;
