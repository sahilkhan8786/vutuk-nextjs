'use client';

import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
    SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UserUpdateformSchema } from '@/schemas/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect, useState } from 'react';
import { updateUser } from '@/actions/users';
import Image from 'next/image';

type User = {
    _id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    addressCount: number;
    phone: number;
    phoneVerified: boolean;
    role: 'admin' | 'user'
    createdAt: string;
};

const AdminUserForm = ({ id, onClose }: {
    id?: string;
    onClose?: () => void;
}) => {
    const [user, setUser] = useState<User | null>(null);

    const form = useForm<z.infer<typeof UserUpdateformSchema>>({
        resolver: zodResolver(UserUpdateformSchema),
        defaultValues: {
            role: 'user',
            emailVerified: false,
            phoneVerified: false,
        },
    });

    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`, {
                credentials: "include",
            });
            const json = await res.json();
            const fetchedUser = json.data.user as User;

            setUser(fetchedUser);

            // Set form defaults after data is loaded
            form.reset({
                role: fetchedUser.role,
                emailVerified: fetchedUser.emailVerified,
                phoneVerified: fetchedUser.phoneVerified,
            });
        };

        fetchUser();
    }, [id, form]);

    const onSubmit = async (values: z.infer<typeof UserUpdateformSchema>) => {
        if (!id) return;
        try {

            await updateUser(id, values);
            onClose?.();
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    return (
        <SheetContent className='w-full'>
            <SheetHeader>
                <SheetTitle>Edit User</SheetTitle>
                <SheetDescription>Update the role and verification status.</SheetDescription>
            </SheetHeader>

            {user && (
                <>
                    <div className="px-4 text-sm space-y-2 mb-4 w-full">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name}
                                width={150}
                                height={150}
                                className='rounded-xl'
                            />
                        ) : (
                            <div className='size-[150px] bg-gray-200 rounded-xl flex items-center justify-center text-center'>
                                No Image Found
                            </div>
                        )}
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                    </div>

                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4 w-full">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Role</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <FormControl className='w-full'>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>

                                                <SelectItem value="user">User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="emailVerified"
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Email Verified</FormLabel>
                                        <Select
                                            value={String(field.value)}
                                            onValueChange={(value) => field.onChange(value === 'true')}
                                        >
                                            <FormControl className='w-full'>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true">Yes</SelectItem>
                                                <SelectItem value="false">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneVerified"
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Phone Verified</FormLabel>
                                        <Select
                                            value={String(field.value)}
                                            onValueChange={(value) => field.onChange(value === 'true')}

                                        >
                                            <FormControl className='w-full'>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true">Yes</SelectItem>
                                                <SelectItem value="false">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </>
            )}

            <SheetFooter className="px-4 mt-4">
                <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                </SheetClose>
            </SheetFooter>
        </SheetContent>
    );
};

export default AdminUserForm;
