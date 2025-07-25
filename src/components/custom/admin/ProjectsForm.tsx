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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formSchemaProjects } from '@/schemas/projectsSchema'
import { SkeletonCard } from '../skeletons/SkeletonCard'
import { toast } from 'sonner'
import { createProject } from '@/actions/projects'
import { useRouter } from 'next/navigation'

export interface Stream {
    _id: string;
    value: string;
    createdAt: string;
    updatedAt: string;
}
export interface Service {
    _id: string;
    servicename: string;

}


const ProjectsForm = ({ isEditing = false, id, onClose }: {
    isEditing?: boolean,
    id?: string,
    onClose?: () => void
}) => {
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [projectImagePreviews, setProjectImagePreviews] = useState<string[]>([])
    const [showFileInput, setShowFileInput] = useState<boolean>(false)
    const [deletedImages, setDeletedImages] = useState<string[]>([])
    const [streams, setStreams] = useState([]);
    const [services, setServices] = useState([]);
    const router = useRouter()

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
            existingImages: [],
            deletedImages: [],
        },
    })

    const { handleSubmit, watch, formState, setValue, reset } = form
    const { isSubmitting } = formState
    const contentType = watch('contentType')
    const existingImages = watch('existingImages') ?? []

    // Clean up object URLs
    useEffect(() => {
        return () => projectImagePreviews.forEach(URL.revokeObjectURL)
    }, [projectImagePreviews])

    // Fetch data for editing


    // 1️⃣ Always fetch services and streams on component mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [streamRes, servicesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/streams`),
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services?fields=servicename`)
                ]);

                const [streamJson, servicesJson] = await Promise.all([
                    streamRes.json(),
                    servicesRes.json()
                ]);

                // Optional: Set state
                setStreams(streamJson.data.streams);
                setServices(servicesJson.data.services);

            } catch (error) {
                console.error("Failed to fetch streams or services:", error);
            }
        };

        fetchInitialData();
    }, [])
    // 2️⃣ Conditionally fetch project data only when editing and `id` exists
    useEffect(() => {
        if (!isEditing || !id) return;

        const fetchProjectData = async () => {
            try {
                setLoading(true);

                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`);
                const data = await res.json();

                if (data.project) {
                    const pd: string[] = data.project.projectData;
                    const images = pd.filter(i => i.includes("cloudinary.com"));
                    const youtube = pd.filter(i => !i.includes("cloudinary.com")).join(", ");

                    reset({
                        projectName: data.project.projectName,
                        description: data.project.description,
                        image: data.project.image,
                        stream: data.project.stream,
                        contentType: data.project.contentType,
                        relatedToService: data.project.relatedToService,
                        websiteUrl: data.project.websiteUrl,
                        projectDataImages: [],
                        projectDataYoutubeUrls: youtube,
                        existingImages: images,
                        deletedImages: [],
                    });

                    setPreview(data.project.image);
                }
            } catch (error) {
                console.error("Failed to fetch project:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [id, isEditing, reset]);




    const onImageUpload = (files: FileList | null) => {
        if (!files) return
        const arr = Array.from(files)
        setValue('projectDataImages', arr)
        const previews = arr.map(f => URL.createObjectURL(f))
        setProjectImagePreviews(previews)
    }


    const onSubmit = async (values: z.infer<typeof formSchemaProjects>) => {
        console.log("CALLED ")
        try {
            const images = values.projectDataImages || []
            const urls = values.projectDataYoutubeUrls
                ? values.projectDataYoutubeUrls.split(',').map(url => url.trim()).filter(Boolean)
                : []

            const projectData: (string | File)[] = [
                ...(values.existingImages || []),
                ...images,
                ...urls,
            ]

            const payload = {
                ...values,
                projectData,
                deletedImages,
            }

            await createProject(payload, isEditing, id)
            toast.success(`Project ${isEditing ? 'updated' : 'added'} successfully`)

            form.reset()
            setPreview(null)
            setProjectImagePreviews([])
            setShowFileInput(false)
            setDeletedImages([])
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
            console.error('Error while submitting:', error)
        } finally {
            onClose?.()
        }
    }


    if (loading) {
        return (
            <SheetContent>
                <SheetTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</SheetTitle>
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} isLinesShowing height={25} />
                ))}
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
                                                        {/* <SelectLabel>Stream</SelectLabel> */}
                                                        {streams.map((stream: Stream) => (

                                                            <SelectItem key={stream._id} value={stream.value}>{stream.value}</SelectItem>
                                                        ))}

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
                                                        {services.map((service: Service) => (

                                                            <SelectItem key={service._id} value={service.servicename}>{service.servicename}</SelectItem>
                                                        ))}


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
                                    {/* Upload Images */}
                                    <FormField control={form.control} name="projectDataImages" render={() => (
                                        <FormItem>
                                            <FormLabel>Upload Images</FormLabel>
                                            <FormControl>
                                                <input type="file" accept="image/*" multiple disabled={isSubmitting}
                                                    onChange={e => onImageUpload(e.target.files)} />
                                            </FormControl>
                                            <FormMessage />
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {projectImagePreviews.map((src, i) => (
                                                    <Image key={i} src={src} alt="" width={100} height={100} className="rounded border" />
                                                ))}
                                            </div>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="projectDataYoutubeUrls" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>YouTube URLs</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    {/* Existing images */}

                                    <FormField
                                        control={form.control}
                                        name="existingImages"
                                        render={() => (
                                            <>
                                                {existingImages?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {form.watch('existingImages')!.map((src, idx) => (
                                                            <div key={idx} className="relative group">
                                                                <Image src={src} alt={`Existing ${idx}`} width={100} height={100} className="rounded border" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = form.getValues('existingImages')?.filter((img) => img !== src)
                                                                        form.setValue('existingImages', updated)
                                                                        setDeletedImages((prev) => [...prev, src])
                                                                    }}
                                                                    className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-bl hidden group-hover:block"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
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
