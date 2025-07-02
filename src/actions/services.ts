'use server'
import { optimizeImage, uploadToCloudinary } from "@/lib/cloudinary";
import { connectToDB } from "@/lib/mongodb";
import Service from "@/models/service.model";
import { formSchemaServices } from "@/schemas/servicesSchema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createServices = async (
    formData: z.infer<typeof formSchemaServices>,
    isEditing: boolean,
    id?: string
  ) => {
    try {
      const data = formSchemaServices.parse(formData);
      await connectToDB();
  
      let imageURL = '';
  
      const file = data.image?.[0] as File | undefined;
      if (file instanceof File) {
        if (file.size > 5 * 1024 * 1024) throw new Error('Image exceeds 5MB limit');
        const optimizedBuffer = await optimizeImage(file);
        imageURL = await uploadToCloudinary(optimizedBuffer, file.name);
      }
  
      if (isEditing && id) {
        const existing = await Service.findOne({slug:id});
        if (!existing) throw new Error('Team member not found');
  
        await Service.findOneAndUpdate({slug:id}, {
          ...data,
          image: imageURL || existing.image, // retain old image if not replaced
        });
      } else {
        if (!imageURL) throw new Error('Image is required');
        await Service.create({ ...data, image: imageURL });
      }
  
      revalidatePath('/admin/services');
    } catch (error) {
      console.error('Error in services handler:', error);
      throw error;
    }
  };
  