'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formSchemaServices } from '@/schemas/servicesSchema'
import { createServices } from '@/actions/services'
import { toast } from 'sonner'
import { SkeletonCard } from '../skeletons/SkeletonCard'

type Stream = {
    _id: string,
    value: string
}




const ServicesForm = ({ isEditing = false, id, onClose }: {
    isEditing?: boolean,
    onClose?: () => void,
    id?: string
}) => {


    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showFileInput, setShowFileInput] = useState(false);
    const [streams, setStreams] = useState([])

    const form = useForm<z.infer<typeof formSchemaServices>>({
        resolver: zodResolver(formSchemaServices),
        defaultValues: {
            servicename: "",
            description: "",
            image: null,
            stream: "media",
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            const streamRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/streams`);

            const streamsJson = await streamRes.json();
            console.log(streamsJson.data.streams)
            setStreams(streamsJson.data.streams)
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (isEditing && id) {
            console.log(id)
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services/${id}`);
                    const data = await res.json();




                    if (data?.service) {
                        const { servicename, description, image } = data.service;

                        form.reset({
                            servicename,
                            description,
                            stream: data.service.stream || "media",
                            image: image,
                        });

                        if (image) setPreview(image);
                    }
                } catch (err) {
                    console.error("Failed to fetch team member", err);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [isEditing, id, form]);

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: z.infer<typeof formSchemaServices>) => {
        try {
            await createServices(values, isEditing, id);
            toast.success(`Service ${isEditing ? 'updated' : 'added'} successfully`);

        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error('Error while creating service:', error);
        }
        finally {
            onClose?.();
        }
    };

    if (isEditing && isLoading) {
        return (
            <SheetContent>
                <SheetTitle>
                    {isEditing ? "Edit Service" : "Add New Service"}

                </SheetTitle>
                <div className="p-6">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} isLinesShowing={true} height={25} />
                    ))}
                </div>
            </SheetContent>
        );
    }

    return (
        <SheetContent className='overflow-y-scroll'>

            <FormProvider {...form}>
                <SheetHeader >

                    <SheetTitle>
                        {isEditing ? "Edit Service" : "Add New Service"}

                    </SheetTitle>
                    <SheetDescription asChild>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="servicename"
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
                                                        {streams.map((stream: Stream) => (
                                                            <SelectItem key={stream._id} value={stream.value}>Vutuk {stream.value}</SelectItem>

                                                        ))}

                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* IMAGE UPLOAD */}
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>

                                        {preview && !showFileInput ? (
                                            <div className="flex flex-col gap-2">
                                                <Image
                                                    src={preview}
                                                    alt="Preview"
                                                    width={150}
                                                    height={150}
                                                    className="rounded border"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowFileInput(true);
                                                        form.setValue("image", null);
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
                                                            const fileList = e.target.files;
                                                            field.onChange(fileList);
                                                            if (fileList && fileList.length > 0) {
                                                                const objectUrl = URL.createObjectURL(fileList[0]);
                                                                setPreview(objectUrl);
                                                            } else {
                                                                setPreview(null);
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
                            {/* FOOTER */}
                            <SheetFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? isEditing
                                            ? 'Updating...'
                                            : 'Submitting...'
                                        : isEditing
                                            ? 'Save Changes'
                                            : 'Add Service'}
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
        </SheetContent >
    )
}

export default ServicesForm