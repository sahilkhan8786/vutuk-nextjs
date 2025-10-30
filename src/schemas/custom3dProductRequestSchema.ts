import { z } from "zod";

// File schema for client-side file validation
export const fileSchema = z.instanceof(File)
  .refine((file) => file.size <= 500 * 1024 * 1024, "File size must be less than 5MB")
  .refine((file) =>
    ['.stl', '.obj', '.step', '.glb'].some(ext => file.name.toLowerCase().endsWith(ext)),
    "Only .stl, .obj, .step, and .glb files are allowed"
  )
  .optional();

// ==================== ZOD SCHEMA ====================
export const custom3dProductRequestSchema = z.object({
  modelFile: fileSchema,
  modelFileUrl: z.string().url("Invalid URL format").optional(),
  material: z.enum(['PLA', 'ABS', 'PETG', 'TPU', 'Other', 'Not sure', ''], {
    errorMap: () => ({ message: "Material is required" })
  }),
  otherMaterial: z.string().optional(),
  color: z.enum(['Black', 'White', 'Other', 'Not sure', ''], {
    errorMap: () => ({ message: "Color is required" })
  }),
  otherColor: z.string().optional(),
  priority: z.enum(['Strength', 'Quality', 'Optimal', 'Not sure', ''], {
    errorMap: () => ({ message: "Priority is required" })
  }),
  otherPriority: z.string().optional(),
  quantity: z.number({
    required_error: "Quantity is required",
    invalid_type_error: "Quantity must be a number"
  }).min(1, "Quantity must be at least 1"),
  notes: z.string().min(1, "Notes are required"),
  addressId: z.string().min(1, "Please select a delivery address")
})
  .refine((data) => {
    // Either modelFile or modelFileUrl must be provided
    return !!(data.modelFile || data.modelFileUrl);
  }, {
    message: "Either upload a file or provide a file URL",
    path: ["modelFile"]
  })
  .refine((data) => {
    if (data.material === 'Other' || data.material === 'Not sure') {
      return !!data.otherMaterial && data.otherMaterial.length > 0;
    }
    return true;
  }, {
    path: ['otherMaterial'],
    message: 'Please specify the material'
  })
  .refine((data) => {
    if (data.color === 'Other' || data.color === 'Not sure') {
      return !!data.otherColor && data.otherColor.length > 0;
    }
    return true;
  }, {
    path: ['otherColor'],
    message: 'Please specify the color'
  })
  .refine((data) => {
    if (data.priority === 'Not sure') {
      return !!data.otherPriority && data.otherPriority.length > 0;
    }
    return true;
  }, {
    path: ['otherPriority'],
    message: 'Please specify the priority'
  });

// Infer TypeScript type from the schema
export type Custom3DProductRequest = z.infer<typeof custom3dProductRequestSchema>;