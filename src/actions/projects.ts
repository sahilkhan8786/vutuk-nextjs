'use server'

import { auth } from '@/auth'
import { optimizeImage, uploadToCloudinary } from '@/lib/cloudinary'
import { connectToDB } from '@/lib/mongodb'
import Project from '@/models/project.model'
import { formSchemaProjects } from '@/schemas/projectsSchema'
import { revalidatePath } from 'next/cache'
import slugify from 'slugify'
import * as z from 'zod'

export const createProject = async (
  formData: z.infer<typeof formSchemaProjects>,
  isEditing: boolean,
  id?: string
) => {
  try {
    const data = formSchemaProjects.parse(formData)
    await connectToDB()

    console.log('📦 Incoming data:', data)

    let imageURL = ''
    const file = (data.image as File[] | undefined)?.[0]
    if (file instanceof File) {
      const optimized = await optimizeImage(file)
      imageURL = await uploadToCloudinary(optimized, file.name)
    }

    // Upload new projectData images
    const newImageUploads = await Promise.all(
      (data.projectDataImages || []).map(async (file) => {
        if (file instanceof File) {
          const optimized = await optimizeImage(file)
          return await uploadToCloudinary(optimized, file.name)
        }
        return null
      })
    )
    const uploadedImageUrls = newImageUploads.filter(Boolean) as string[]

    const youtubeLinks = data.projectDataYoutubeUrls
      ?.split(',')
      .map((url) => url.trim())
      .filter(Boolean) || []

    const filteredExistingImages = (data.existingImages || []).filter(
      (img) => !(data.deletedImages || []).includes(img)
    )

    console.log('🧩 Existing before filtering:', data.existingImages)
    console.log('🗑 Deleted images:', data.deletedImages)
    console.log('✅ Remaining existing images:', filteredExistingImages)

    const finalProjectData = [
      ...filteredExistingImages,
      ...uploadedImageUrls,
      ...youtubeLinks,
    ]

    if (isEditing && id) {
      const existing = await Project.findById(id)
      if (!existing) throw new Error('Project not found')

      await Project.findByIdAndUpdate(id, {
        ...data,
        image: imageURL || existing.image,
        projectData: finalProjectData,
      })
    } else {
      if (!imageURL) throw new Error('Image is required')

      await Project.create({
        ...data,
        image: imageURL,
        projectData: finalProjectData,
        relatedToService: slugify(data.relatedToService, { lower: true, strict: true })
      })
    }

    console.log('✅ Project saved successfully')
    revalidatePath('/admin/projects','page')
  } catch (error) {
    console.error('❌ Error in project handler:', error)
    throw error
  }
}


export async function deleteProject(id:string) {
  const session = await auth();
  
  if (session?.user.role !== 'admin') {
    return {
      success: false,
      message:"Only Admin have access to these Functionalities"
    }
  }

  await Project.findByIdAndDelete(id);

  revalidatePath('/admin/projects')
   return {
      success: true,
      message:"Project Deleted Successfully"
    }

}