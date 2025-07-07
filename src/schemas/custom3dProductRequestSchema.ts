import { z } from "zod";

export const custom3dProductRequestSchema = z.object({
  modelFile: z.any(),


  material: z.string(),
  otherMaterial: z.string().optional(),

  color: z.string(),
  otherColor: z.string().optional(),

  priority: z.string(),
  otherPriority: z.string().optional(),

  quantity: z.coerce.number().min(1, { message: 'Quantity must be at least 1' }),
  notes: z.string().optional(),

  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email' }),

  phoneCode: z.string().min(1, { message: 'Select a country code' }),
  phoneNumber: z.string().min(5, { message: 'Enter a valid phone number' }),

  addressLine1: z.string().min(5, { message: 'Address line 1 is required' }),
  addressLine2: z.string().optional(),
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  pincode: z.string().min(3, { message: 'Pincode is required' }),

  isBusiness: z.boolean(),
  gstOrFirm: z.string().optional(),
})