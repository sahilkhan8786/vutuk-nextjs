'use server';

import { auth } from "@/auth";
import { updateUserById, updateUserImage } from "@/data/user.data";
import { UserUpdateformSchema } from "@/schemas/userSchema";

import { z } from "zod";

export async function updateUser(id: string, values: z.infer<typeof UserUpdateformSchema>) {
     const session = await auth()
      if (!session || !session.user) {
        return { success: false, error: 'unauthenticated' }
    }
    const isAdmin = session.user.role ==='admin'

      if (!session || !isAdmin) {
        return { success: false, error: 'Unauthorized' }
    }
    
    const validatedFields = UserUpdateformSchema.parse(values);

    if (!validatedFields) {
        return {
            success: false,
            error:"Invalid Fields"
        }
    }
    console.log(validatedFields)

    await updateUserById(id, validatedFields)
    
    revalidatePath('/admin/users')
    
    console.log(values)
}



import { revalidatePath } from 'next/cache';
import { optimizeImage, uploadToCloudinary } from "@/lib/cloudinary";

export async function updateProfileImage(formData: FormData) {
  const userId = formData.get('userId') as string;
  const file = formData.get('image') as File;

  if (!userId || !file || typeof file === 'string') {
    throw new Error('Invalid form data.');
  }

  try {
    // Optimize to webp using Sharp
    const optimizedBuffer = await optimizeImage(file);

    // Upload to Cloudinary
    const uploadedUrl = await uploadToCloudinary(optimizedBuffer, file.name);

    // Save the new image URL in DB
    await updateUserImage(userId, uploadedUrl);

    // Optionally revalidate any paths
    revalidatePath('/dashboard/profile');

    return { success: true, imageUrl: uploadedUrl };
  } catch (err) {
    console.error('Profile image update failed:', err);
    throw err;
  }
}