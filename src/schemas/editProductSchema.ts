import { z } from "zod";

export const editProductSchema = z.object({
  configKey: z.string().optional(),
  title: z.string().min(5),
  videoURL: z.string().url("Invalid video URL").optional().or(z.literal("")),
  description: z.string().min(5),


  tags: z.array(z.string()).optional(),

  productType: z.array(z.string()).min(1, "Select at least one product type"),
  mainCategories: z.array(z.string()).min(1, "Select at least one main category"),
  subCategories: z.array(z.string()).min(1, "Select at least one subcategory"),

  price: z.number().positive("Price must be greater than 0"),
  priceInUSD: z.number().positive("Price in USD must be greater than 0"),

  sizeImages: z.array(z.string()).min(1, "One Image should be of the Size")
});
