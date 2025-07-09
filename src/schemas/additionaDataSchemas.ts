import { z } from 'zod'

const stringItem = z.object({
  value: z.string().min(1, 'Empty values are not allowed'),
})

export const productCategoriesFormSchema = z.object({
  productType: z.array(stringItem),
  mainCategories: z.array(stringItem),
  subCategories: z.array(stringItem),
})
