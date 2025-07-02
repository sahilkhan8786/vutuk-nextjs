'use server';

import { optimizeImage, uploadToCloudinary } from '@/lib/cloudinary';
import { connectToDB } from '@/lib/mongodb';
import Project from '@/models/project.model';
import { formSchemaProjects } from '@/schemas/projectsSchema';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

export const createProject = async (
  formData: z.infer<typeof formSchemaProjects>,
  isEditing: boolean,
  id?: string
) => {
  try {
    const data = formSchemaProjects.parse(formData);
    await connectToDB();

    console.log(id)

    // ✅ Normalize contentType to match Mongoose enum
    data.contentType = data.contentType?.trim().toLowerCase() as 'data' | 'web';

    let imageURL = '';
    const projectDataArray: string[] = [];

    // Upload cover image
    const file = (data.image as File[] | undefined)?.[0];
    if (file instanceof File) {
      if (file.size > 5 * 1024 * 1024) throw new Error('Image exceeds 5MB limit');
      const optimizedBuffer = await optimizeImage(file);
      imageURL = await uploadToCloudinary(optimizedBuffer, file.name);
    }

    // Handle 'data' type project content
    if (data.contentType === 'data') {
      // Upload multiple images
      if (Array.isArray(data.projectDataImages)) {
        const uploads = await Promise.all(
          data.projectDataImages.map(async (file: File) => {
            if (file instanceof File) {
              if (file.size > 5 * 1024 * 1024) throw new Error('Image exceeds 5MB limit');
              const optimizedBuffer = await optimizeImage(file);
              return await uploadToCloudinary(optimizedBuffer, file.name);
            }
            return null;
          })
        );
        projectDataArray.push(...(uploads.filter(Boolean) as string[]));
      }

      // Add YouTube URLs
      if (data.projectDataYoutubeUrls) {
        const urls = data.projectDataYoutubeUrls
          .split(',')
          .map((url) => url.trim())
          .filter((url) => url.length > 0);
        projectDataArray.push(...urls);
      }
    }

    // Create or update project
    if (isEditing && id) {
      const existing = await Project.findById(id);
      if (!existing) throw new Error('Project not found');

      await Project.findByIdAndUpdate(id, {
        ...data,
        image: imageURL || existing.image,
        projectData: projectDataArray.length ? projectDataArray : existing.projectData,
      });
    } else {
      if (!imageURL) throw new Error('Image is required');
      await Project.create({
        ...data,
        image: imageURL,
        projectData: projectDataArray,
      });
    }

    revalidatePath('/admin/projects');
  } catch (error) {
    console.error('Error in project handler:', error);
    throw error;
  }
};
