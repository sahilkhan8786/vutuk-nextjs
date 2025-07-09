import { z } from "zod";

export const productCategoriesFormSchema = z.object({
    productType: z.string().min(2),
    mainCategories: z.string().min(2),
    subCategories: z.string().min(2),
})