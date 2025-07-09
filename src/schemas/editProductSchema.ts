import { z } from "zod";

export const editProductSchema = z.object({
  configKey: z.string().optional(),
  tags: z.array(z.string()).optional(),

  productType: z.array(z.string()).optional(),
  mainCategories: z.array(z.string()).optional(),
  subCategories: z.array(z.string()).optional(),

  variantMappings: z.array(z.object({
    key: z.string(),
    image: z.string(),
    sku: z.string(),
  }))
});
