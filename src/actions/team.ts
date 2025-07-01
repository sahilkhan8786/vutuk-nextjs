'use server';

import { optimizeImage, uploadToCloudinary } from '@/lib/cloudinary';
import { connectToDB } from '@/lib/mongodb';
import TeamMember from '@/models/team.model';
import { formSchemaTeamMember } from '@/schemas/teamMember';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

export const createTeamMember = async (
  formData: z.infer<typeof formSchemaTeamMember>,
  isEditing: boolean,
  id?: string
) => {
  try {
    const data = formSchemaTeamMember.parse(formData);
    await connectToDB();

    let imageURL = '';

    const file = data.image?.[0] as File | undefined;
    if (file instanceof File) {
      if (file.size > 5 * 1024 * 1024) throw new Error('Image exceeds 5MB limit');
      const optimizedBuffer = await optimizeImage(file);
      imageURL = await uploadToCloudinary(optimizedBuffer, file.name);
    }

    if (isEditing && id) {
      const existing = await TeamMember.findById(id);
      if (!existing) throw new Error('Team member not found');

      await TeamMember.findByIdAndUpdate(id, {
        ...data,
        image: imageURL || existing.image, // retain old image if not replaced
      });
    } else {
      if (!imageURL) throw new Error('Image is required');
      await TeamMember.create({ ...data, image: imageURL });
    }

    revalidatePath('/admin/team');
  } catch (error) {
    console.error('Error in team member handler:', error);
    throw error;
  }
};
