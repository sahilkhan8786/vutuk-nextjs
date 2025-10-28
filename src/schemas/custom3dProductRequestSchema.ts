import { z } from "zod";

// ==================== ZOD SCHEMA ====================
export const custom3dProductRequestSchema = z.object({
  modelFileUrl: z.string().url().optional(),
  material: z.string().min(1, "Material is required"),
  otherMaterial: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  otherColor: z.string().optional(),
  priority: z.string().min(1, "Priority is required"),
  otherPriority: z.string().optional(),
  quantity: z.number().min(1, "Quantity is required"),
  notes: z.string().min(1, "Notes are required"),
  addressId: z.string()

})

  .refine((data) => {
    if (data.material === 'Other' || data.material === 'Not sure') return data.otherMaterial?.length ?? 0 > 0;
    return true;
  }, { path: ['otherMaterial'], message: 'Specify material' })
  .refine((data) => {
    if (data.color === 'Other' || data.color === 'Not sure') return data.otherColor?.length ?? 0 > 0;
    return true;
  }, { path: ['otherColor'], message: 'Specify color' })
  .refine((data) => {
    if (data.priority === 'Not sure') return data.otherPriority?.length ?? 0 > 0;
    return true;
  }, { path: ['otherPriority'], message: 'Specify priority' })
