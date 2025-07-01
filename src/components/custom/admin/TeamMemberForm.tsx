'use client'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import React, { useState } from 'react'



import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { createTeamMember } from '@/actions/team'
import { formSchemaTeamMember } from '@/schemas/teamMember'





const TeamMemberForm = ({ isEditing = false }: {
    isEditing?: boolean
}) => {
    const [preview, setPreview] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchemaTeamMember>>({
        resolver: zodResolver(formSchemaTeamMember),
        defaultValues: {
            username: "",
            position: "",
            description: "",
            freelancerLink: "",
            facebookLink: "",
            instagramLink: "",
            twitterLink: "",
            image: null
        },
    })

    async function onSubmit(values: z.infer<typeof formSchemaTeamMember>) {
        console.log(values)
        if (values.image && values.image.length > 0) {
            console.log("Uploaded file:", values.image[0])
        }
        createTeamMember(values);
    }


    return (
        <SheetContent className='overflow-y-scroll'>
            <FormProvider {...form}>
                <SheetHeader >

                    <SheetTitle>
                        {isEditing ? "Edit Member Details" : "Add New Member"}

                    </SheetTitle>
                    <SheetDescription asChild>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
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
                                                    field.onChange(fileList) // Update RHF with files
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
                                name="position"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Position</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Position" {...field} />
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
                                        <FormLabel>Add a Bio</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Bio" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="freelancerLink"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Freelancer Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Freelancer Link" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="instagramLink"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Instagram Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Instagram Link" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="twitterLink"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Twitter Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Twitter Link" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="facebookLink"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Facebook Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Facebook Link" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SheetFooter>
                                <Button type="submit">{isEditing ? "Save changes" : "Add Member"}</Button>
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

export default TeamMemberForm