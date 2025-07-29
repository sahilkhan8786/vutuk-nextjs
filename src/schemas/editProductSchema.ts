import { z } from "zod";

export const editProductSchema = z.object({
  configKey: z.string().optional(),

  tags: z.array(z.string()).optional(),

  productType: z.array(z.string()).min(1, "Select at least one product type"),
  mainCategories: z.array(z.string()).min(1, "Select at least one main category"),
  subCategories: z.array(z.string()).min(1, "Select at least one subcategory"),

  price: z.number().positive("Price must be greater than 0"),
  priceInUSD: z.number().positive("Price in USD must be greater than 0"),

  variantMappings: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      image: z.string().min(1, "Image is required"),
      sku: z.string().min(1, "SKU is required"),
    })
  ).min(1, "At least one variant must be provided"),
});
