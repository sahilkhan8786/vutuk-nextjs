'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formSchemaProjects } from '@/schemas/projectsSchema'
import { SkeletonCard } from '../skeletons/SkeletonCard'
import { toast } from 'sonner'
import { createProject } from '@/actions/projects'

const ProjectsForm = ({ isEditing = false, id, onClose }: {
    isEditing?: boolean,
    id?: string,
    onClose?: () => void
}) => {
    const [preview, setPreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showFileInput, setShowFileInput] = useState(false)
    const [projectImagesPreview, setProjectImagesPreview] = useState<string[]>([])

    const form = useForm<z.infer<typeof formSchemaProjects>>({
        resolver: zodResolver(formSchemaProjects),
        defaultValues: {
            projectName: '',
            description: '',
            image: null,
            stream: 'media',
            contentType: 'data',
            relatedToService: '',
            websiteUrl: '',
            projectDataImages: [],
            projectDataYoutubeUrls: '',
        },
    })

    useEffect(() => {
        return () => {
            projectImagesPreview.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [projectImagesPreview])

    useEffect(() => {
        if (isEditing && id) {
            const fetchData = async () => {
                setIsLoading(true)
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`)
                    const data = await res.json()

                    if (data?.project) {
                        const {
                            projectName,
                            description,
                            image,
                            stream,
                            contentType,
                            relatedToService,
                            websiteUrl,
                            projectData,
                        } = data.project

                        const youtubeLinks = projectData?.filter((item: string) => typeof item === 'string' && item.startsWith('http'))?.join(', ') || ''

                        form.reset({
                            projectName,
                            description,
                            image,
                            stream,
                            contentType: contentType || 'data',
                            relatedToService: relatedToService || '',
                            websiteUrl: websiteUrl || '',
                            projectDataImages: [], // clear new uploads
                            existingImages: data.project.projectData?.filter((item: string) => item.includes('cloudinary.com')) || [],
                            projectDataYoutubeUrls: youtubeLinks,
                        })

                        if (image) setPreview(image)
                    }
                } catch (err) {
                    console.error('Failed to fetch project', err)
                } finally {
                    setIsLoading(false)
                }
            }

            fetchData()
        }
    }, [isEditing, id, form])

    const {
        handleSubmit,
        watch,
        formState: { isSubmitting },
    } = form

    const contentType = watch("contentType")

    const onSubmit = async (values: z.infer<typeof formSchemaProjects>) => {
        try {
            const images = values.projectDataImages || []
            const urls = values.projectDataYoutubeUrls
                ? values.projectDataYoutubeUrls.split(',').map((url) => url.trim())
                : []

            const projectData: (string | File)[] = [...images, ...urls]

            const payload = {
                ...values,
                projectData,
            }

            await createProject(payload, isEditing, id)
            toast.success(`Project ${isEditing ? 'updated' : 'added'} successfully`)

            form.reset({
                projectName: '',
                description: '',
                image: null,
                stream: 'media',
                contentType: 'data',
                relatedToService: '',
                websiteUrl: '',
                projectDataImages: [],
                projectDataYoutubeUrls: '',
            })

            setPreview(null)
            setShowFileInput(false)
            setProjectImagesPreview([])

        } catch (error) {
            toast.error('Something went wrong. Please try again.')
            console.error('Error while creating project:', error)
        } finally {
            onClose?.()
        }
    }

    if (isEditing && isLoading) {
        return (
            <SheetContent>
                <div className="p-6">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} isLinesShowing={true} height={25} />
                    ))}
                </div>
            </SheetContent>
        )
    }

    return (
        <SheetContent className="overflow-y-scroll">
            <FormProvider {...form}>
                <SheetHeader>
                    <SheetTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</SheetTitle>
                    <SheetDescription asChild>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Project Name */}
                            <FormField
                                control={form.control}
                                name="projectName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Project Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Stream */}
                            <FormField
                                control={form.control}
                                name="stream"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stream</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a Stream" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Stream</SelectLabel>
                                                        <SelectItem value="media">Vutuk Media</SelectItem>
                                                        <SelectItem value="design">Vutuk Design</SelectItem>
                                                        <SelectItem value="web-development">Vutuk Web Development</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Related to Service */}
                            <FormField
                                control={form.control}
                                name="relatedToService"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Related Service</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a Service" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="media">Video Editing</SelectItem>
                                                        <SelectItem value="design">3D Design</SelectItem>
                                                        <SelectItem value="web">Next.js Website</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Cover Image Upload */}
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cover Image</FormLabel>
                                        {preview && !showFileInput ? (
                                            <div className="flex flex-col gap-2">
                                                <Image src={preview} alt="Preview" width={150} height={150} className="rounded border" />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowFileInput(true)
                                                        form.setValue('image', null)
                                                    }}
                                                >
                                                    Update Image
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <FormControl>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        disabled={isSubmitting}
                                                        onChange={(e) => {
                                                            const fileList = e.target.files
                                                            field.onChange(fileList)
                                                            if (fileList?.[0]) {
                                                                const objectUrl = URL.createObjectURL(fileList[0])
                                                                setPreview(objectUrl)
                                                            } else {
                                                                setPreview(null)
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                {preview && (
                                                    <Image
                                                        src={preview}
                                                        alt="Image preview"
                                                        className="mt-2 rounded border"
                                                        onLoad={() => URL.revokeObjectURL(preview)}
                                                        width={150}
                                                        height={150}
                                                    />
                                                )}
                                            </>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Content Type Select */}
                            <FormField
                                control={form.control}
                                name="contentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content Type</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="data">Data (Images + URLs)</SelectItem>
                                                        <SelectItem value="web">Website URL</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* When contentType is 'data' show image + youtube URL input */}
                            {contentType === 'data' && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="projectDataImages"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Upload Images</FormLabel>
                                                <FormControl>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => {
                                                            const files = e.target.files
                                                            if (files) {
                                                                const fileArray = Array.from(files)
                                                                field.onChange(fileArray)
                                                                const previews = fileArray.map((file) => URL.createObjectURL(file))
                                                                setProjectImagesPreview(previews)
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                {projectImagesPreview.length > 0 && (
                                                    <div className="flex gap-2 flex-wrap mt-2">
                                                        {projectImagesPreview.map((src, idx) => (
                                                            <Image key={idx} src={src} alt={`Preview ${idx}`} width={100} height={100} className="rounded border" />
                                                        ))}
                                                    </div>
                                                )}
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="projectDataYoutubeUrls"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>YouTube URLs (comma-separated)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://youtube.com/..., https://youtu.be/..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {/* When contentType is 'web', show websiteUrl input */}
                            {contentType === 'web' && (
                                <FormField
                                    control={form.control}
                                    name="websiteUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Website URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Footer */}
                            <SheetFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (isEditing ? 'Updating...' : 'Submitting...') : isEditing ? 'Save Changes' : 'Add Project'}
                                </Button>
                                <SheetClose asChild>
                                    <Button variant="outline" type="button" disabled={isSubmitting}>
                                        Close
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </SheetDescription>
                </SheetHeader>
            </FormProvider>
        </SheetContent>
    )
}

export default ProjectsForm
