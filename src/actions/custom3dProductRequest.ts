'use server';


import { auth } from "@/auth";
import { uploadRawFileToCloudinary } from "@/lib/cloudinary";
import Address from "@/models/address.model";
import Custom3dPrintRequest from "@/models/custom3dPrintRequests.model";

import { custom3dProductRequestSchema } from "@/schemas/custom3dProductRequestSchema";
import { z } from "zod";

export async function custom3dProductRequest(values:z.infer<typeof custom3dProductRequestSchema>) {
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
    let modelFileUrl;
    
    
    
    if (data.modelFile instanceof File) {
        const modelUrl = await uploadRawFileToCloudinary(data.modelFile);
        if (!modelUrl) return { success: false, error: "Model upload failed" };
        modelFileUrl = modelUrl;
    }
    


 const request =   await Custom3dPrintRequest.create({
        userId: session.user.id,
        modelFileUrl: modelFileUrl,
        material:data.material,
        otherMaterial: data.otherMaterial,
        color:data.color,
        otherColor: data.otherColor,
        priority:data.priority,
        otherPriority: data.otherPriority,
        quantity: data.quantity,
        notes: data.notes,
        isBusiness: data.isBusiness,
   gstOrFirm: data.gstOrFirm,
        status:"Request Submitted"
    })

 const address =    await Address.create({
        userId: session.user.id,
        firstName:data.firstName,
        lastName: data.lastName,
        phoneNumber:data.phoneNumber,
        email: data.email,
        phoneCode: data.phoneCode,
        addressLine1:data.addressLine1,
        addressLine2:data.addressLine2,
        country: data.country,
        state: data.state,
        city: data.city,
        pincode:data.pincode
        
})
console.log(address,request)


  return { success: true }
    
}