// schemas/editProductSchema.ts
import { z } from "zod";

export const editProductSchema = z.object({
    configKey:z.string().optional(),
  variantMappings: z.array(z.object({
    key: z.string(),
    image: z.string(),
    sku: z.string()
  }))
});
