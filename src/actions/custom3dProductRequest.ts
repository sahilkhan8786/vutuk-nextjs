'use server';


import { auth } from "@/auth";
import Custom3dPrintRequest from "@/models/custom3dPrintRequests.model";

import { custom3dProductRequestSchema } from "@/schemas/custom3dProductRequestSchema";
import { z } from "zod";

export async function custom3dProductRequest(values: z.infer<typeof custom3dProductRequestSchema>) {
  console.log(values)
  const validatedFields = custom3dProductRequestSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: "Invalid Fields"
    }
  }



  const session = await auth()
  if (!session || !session.user) {
    return { success: false, error: 'unauthenticated' }
  }

  // Continue processing
  const data = validatedFields.data


  await Custom3dPrintRequest.create({
    addressId: data.addressId,
    userId: session.user.id,
    modelFileUrl: data.modelFileUrl,
    material: data.material,
    otherMaterial: data.otherMaterial,
    color: data.color,
    otherColor: data.otherColor,
    priority: data.priority,
    otherPriority: data.otherPriority,
    quantity: data.quantity,
    notes: data.notes,
    status: "Request Submitted",
    isCustomOrderRequest: false

  })



  return { success: true }

}