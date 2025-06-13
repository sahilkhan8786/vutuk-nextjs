'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import Image from 'next/image'
import React, { useState } from 'react'


import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'


const formSchema = z.object({
    projectName: z.string().min(2).max(50),
    description: z.string().min(5),
    image: z.any().refine(file => file?.length === 1, "Image is required").optional(),
    stream: z.enum(["media", "design", "web"]),
    contentType: z.enum(["video", "images", "web"]),
    videoURL: z.string().url().optional().or(z.literal("")),
    projectImages: z.any().refine((files) => !files || files.length > 0, "Please Upload at-least one iamge").optional(),
    projectUrl: z.string().url().optional().or(z.literal(""))

})


const ProjectsForm = ({ isEditing = false }: {
    isEditing?: boolean
}) => {


    const [preview, setPreview] = useState<string | null>(null);
    const [projectImagePreviews, setProjectImagePreviews] = useState<string[]>([])


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectName: "",
            description: "",
            image: null,
            stream: "media",
            contentType: "video",
            videoURL: "",
            projectImages: null,
            projectUrl: ""


        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        if (values.image && values.image.length > 0) {
            console.log("Uploaded file:", values.image[0])
        }
    }


    return (
        <SheetContent className='overflow-y-scroll'>

            <FormProvider {...form}>
                <SheetHeader >

                    <SheetTitle>
                        {isEditing ? "Edit Project" : "Add New Project"}

                    </SheetTitle>
                    <SheetDescription asChild>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="projectName"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Project Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Project Name" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Description" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stream"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Stream</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a Steam" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Stream</SelectLabel>
                                                        <SelectItem value="media">Vutuk Media</SelectItem>
                                                        <SelectItem value="design">Vutuk Design</SelectItem>
                                                        <SelectItem value="web">Vutuk Web Development</SelectItem>

                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Image</FormLabel>
                                        <FormControl>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const fileList = e.target.files
                                                    field.onChange(fileList)
                                                    if (fileList && fileList.length > 0) {
                                                        // Create preview URL
                                                        const objectUrl = URL.createObjectURL(fileList[0])
                                                        setPreview(objectUrl)
                                                    } else {
                                                        setPreview(null)
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contentType"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Content Type</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Type Of Content</SelectLabel>
                                                        <SelectItem value="video">Video</SelectItem>
                                                        <SelectItem value="images">Images</SelectItem>
                                                        <SelectItem value="web">website URL</SelectItem>

                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {form.watch('contentType') === 'video' && (
                                <FormField
                                    control={form.control}
                                    name="videoURL"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Enter Youtube URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Youtube URL" {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />)}

                            {form.watch('contentType') === 'web' && (
                                <FormField
                                    control={form.control}
                                    name="projectUrl"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Enter Website URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Website URL" {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />)}

                            {form.watch("contentType") === 'images' && <FormField
                                control={form.control}
                                name="projectImages"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Project Images</FormLabel>
                                        <FormControl>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                    const fileList = e.target.files
                                                    field.onChange(fileList)

                                                    if (fileList && fileList.length > 0) {
                                                        const previews = Array.from(fileList).map((file) =>
                                                            URL.createObjectURL(file)
                                                        )
                                                        setProjectImagePreviews(previews)
                                                    } else {
                                                        setProjectImagePreviews([])
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        {projectImagePreviews.length > 0 && (
                                            <div className="flex gap-2 flex-wrap mt-2">
                                                {projectImagePreviews.map((src, idx) => (
                                                    <Image
                                                        key={idx}
                                                        src={src}
                                                        alt={`Preview ${idx}`}
                                                        width={30}
                                                        height={10}
                                                        className="rounded border"
                                                        onLoad={() => URL.revokeObjectURL(src)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />
                            }

                            <SheetFooter>
                                <Button type="submit">{isEditing ? "Save changes" : "Add Service"}</Button>
                                <SheetClose asChild>
                                    <Button variant="outline">Close</Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>

                    </SheetDescription>
                </SheetHeader>

            </FormProvider>
        </SheetContent >
    )
}

export default ProjectsForm