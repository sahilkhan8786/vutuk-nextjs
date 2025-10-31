'use server';


import { auth } from "@/auth";
import { AdminNewCustomOrderEmail } from "@/emails/AdminNewCustomOrderEmail";
import { Custom3dProductRequestEmail } from "@/emails/Custom3dProductRequestEmail";
import { resend } from "@/lib/resend";
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


  const request = await Custom3dPrintRequest.create({
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

  try {
    await resend.emails.send({
      from: "Vutuk <orders@vutuk.com>",
      to: session.user.email || "",
      subject: "Your 3D Print Request Has Been Received!",
      react: Custom3dProductRequestEmail({
        name: session.user.name || "Customer",
        requestId: request._id || "N/A",
        material: data.material,
        color: data.color,
        quantity: data.quantity,
      }),
    });
    await resend.emails.send({
      from: "Vutuk <orders@vutuk.com>",
      to: "vutuk.dm@gmail.com",
      subject: "New 3D Print Request Received",
      react: AdminNewCustomOrderEmail({
        customerName: session.user.name || "Customer",
        customerEmail: session.user.email || "",
        material: data.material,
        color: data.color,
        quantity: data.quantity,
        notes: data.notes,
      }),
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }



  return { success: true }

}