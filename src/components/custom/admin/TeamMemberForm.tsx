'use client';

import { useEffect, useState } from 'react';
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    SheetClose, SheetContent, SheetDescription,
    SheetFooter, SheetHeader, SheetTitle
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { createTeamMember } from '@/actions/team';
import { formSchemaTeamMember } from '@/schemas/teamMemberSchema';
import { toast } from 'sonner';
import { SkeletonCard } from '../skeletons/SkeletonCard';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const TeamMemberForm = ({
    isEditing = false,
    id,
    onClose,
}: {
    isEditing?: boolean;
    id?: string;
    onClose?: () => void;
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showFileInput, setShowFileInput] = useState(false);

    const form = useForm<z.infer<typeof formSchemaTeamMember>>({
        resolver: zodResolver(formSchemaTeamMember),
        defaultValues: {
            username: '',
            position: '',
            description: '',
            freelancerLink: '',
            facebookLink: '',
            instagramLink: '',
            twitterLink: '',
            image: null,
            isVisible: 'true'
        },
    });

    // Prefill data if editing
    useEffect(() => {
        if (isEditing && id) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/team/${id}`);
                    const data = await res.json();
                    console.log(data)

                    if (data?.teamMember) {
                        const { username, position, description, freelancerLink, facebookLink, instagramLink, twitterLink, image, isVisible } = data.teamMember;

                        form.reset({
                            username,
                            position,
                            description,
                            freelancerLink,
                            facebookLink,
                            instagramLink,
                            twitterLink,
                            image: image,
                            isVisible: isVisible === true ? 'true' : 'false'

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

    const onSubmit = async (values: z.infer<typeof formSchemaTeamMember>) => {
        try {
            await createTeamMember(values, isEditing, id);
            toast.success(`Team member ${isEditing ? 'updated' : 'added'} successfully`);
            onClose?.();

        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error('Error while creating team member:', error);
            onClose?.();
        }

    };

    if (isEditing && isLoading) {
        return (
            <SheetContent>
                <SheetTitle>{isEditing ? 'Edit Member Details' : 'Add New Member'}</SheetTitle>
                <div className="p-6">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} isLinesShowing={true} height={25} />
                    ))}
                </div>
            </SheetContent>
        );
    }

    return (
        <SheetContent className="overflow-y-scroll">
            <FormProvider {...form}>
                <SheetHeader>
                    <SheetTitle>{isEditing ? 'Edit Member Details' : 'Add New Member'}</SheetTitle>
                    <SheetDescription asChild>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* USERNAME */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter name" disabled={isSubmitting} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isVisible"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Team Member Visibility" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Visibility</SelectLabel>
                                                <SelectItem value="true">True</SelectItem>
                                                <SelectItem value="false">False</SelectItem>

                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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

                            {/* OTHER FIELDS */}
                            {['position', 'description', 'freelancerLink', 'instagramLink', 'twitterLink', 'facebookLink'].map(
                                (fieldName) => (
                                    <FormField
                                        key={fieldName}
                                        control={form.control}
                                        name={fieldName as keyof z.infer<typeof formSchemaTeamMember>}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{fieldName.replace(/([A-Z])/g, ' $1')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={`Enter ${fieldName}`}
                                                        disabled={isSubmitting}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )
                            )}

                            {/* FOOTER */}
                            <SheetFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? isEditing
                                            ? 'Updating...'
                                            : 'Submitting...'
                                        : isEditing
                                            ? 'Save Changes'
                                            : 'Add Member'}
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
    );
};

export default TeamMemberForm;
