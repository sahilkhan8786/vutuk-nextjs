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
    serviceName: z.string().min(2).max(50),
    description: z.string().min(5),
    image: z.any().refine(file => file?.length === 1, "Image is required").optional(),
    stream: z.enum(["media", "design", "web-development"])

})


const ServicesForm = ({ isEditing = false }: {
    isEditing?: boolean
}) => {


    const [preview, setPreview] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serviceName: "",
            description: "",
            image: null,
            stream: "media",
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
                        {isEditing ? "Edit Service" : "Add New Service"}

                    </SheetTitle>
                    <SheetDescription asChild>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="serviceName"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Service Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Service Name" {...field} />
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
                                                        <SelectItem value="apple">Vutuk Media</SelectItem>
                                                        <SelectItem value="banana">Vutuk Design</SelectItem>
                                                        <SelectItem value="blueberry">Vutuk Web Development</SelectItem>

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

export default ServicesForm