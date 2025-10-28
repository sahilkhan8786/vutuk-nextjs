'use client'

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formSchemaUserProfile } from "@/schemas/userProfileSchema";
import Image from "next/image";
import { CheckCircle, Pencil, XCircle } from "lucide-react";
import UpdatProfileImageFormWrapper from "../admin/wrappers/UpdatProfileImageFormWrapper";
import { getInitials } from "@/utils/helpers";
import VerifyEmailFromWrapper from "./wrappers/VerifyEmailFromWrapper";
import VerifyMobileFormWrapper from "./wrappers/VerifyMobileFormWrapper";
import AddAddressFormWrapper from "./wrappers/AddAddressFormWrapper";
import ShowAddress from "./address/ShowAddress";

type FormValues = z.infer<typeof formSchemaUserProfile>;

const DashboardProfileForm = ({ defaultValues: userData }: { defaultValues: FormValues }) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchemaUserProfile),
        defaultValues: userData
    });

    const userInitials = userData.username && getInitials(userData.username);

    function onSubmit(values: FormValues) {
        console.log("Updated values:", values);
        // Call server action here
    }

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-white shadow rounded-xl p-6">
                <div className="relative">
                    {userData.image ? (
                        <Image
                            src={userData.image}
                            alt="user-avatar"
                            width={120}
                            height={120}
                            className="rounded-full cursor-pointer object-cover"
                        />
                    ) : (
                        <div className="rounded-full bg-gray-200 w-28 h-28 flex items-center justify-center text-xl font-bold text-gray-700">
                            {userInitials}
                        </div>
                    )}
                    <UpdatProfileImageFormWrapper
                        id={userData.id}
                        trigger={
                            <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 border cursor-pointer hover:bg-gray-100 transition-transform hover:scale-110">
                                <Pencil className="h-4 w-4 text-gray-600" />
                            </div>
                        }
                    />
                </div>
                <div className="flex-1 space-y-3">
                    <h2 className="text-2xl font-bold">{userData.username}</h2>
                    <p className="text-gray-500">{userData.email}</p>
                    <div className="flex gap-3 flex-wrap">
                        {/* Email Verification */}
                        <div className={`flex items-center gap-2 px-4 py-1 rounded-full border ${userData.isEmailVerfied ? 'bg-green-50 border-green-500 text-green-600' : 'bg-red-50 border-red-500 text-red-600'}`}>
                            {userData.isEmailVerfied ? <CheckCircle /> : <XCircle />}
                            {userData.isEmailVerfied ? 'Email Verified' : 'Email Not Verified'}
                        </div>
                        {!userData.isEmailVerfied && (
                            <VerifyEmailFromWrapper
                                trigger={<Button size="sm" variant="outline">Verify Email</Button>}
                            />
                        )}

                        {/* Phone Verification */}
                        <div className={`flex items-center gap-2 px-4 py-1 rounded-full border ${userData.isPhoneVerfied ? 'bg-green-50 border-green-500 text-green-600' : 'bg-red-50 border-red-500 text-red-600'}`}>
                            {userData.isPhoneVerfied ? <CheckCircle /> : <XCircle />}
                            {userData.isPhoneVerfied ? 'Phone Verified' : 'Phone Not Verified'}
                        </div>
                        {!userData.isPhoneVerfied && (
                            <VerifyMobileFormWrapper
                                phoneNumber={userData.phone}
                                trigger={<Button size="sm" variant="outline">Verify Phone</Button>}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-white shadow rounded-xl p-6 space-y-6"
                >
                    <h3 className="text-xl font-semibold border-b pb-2">Profile Details</h3>

                    {/* Username */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email (read-only) */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} readOnly className="bg-gray-100 cursor-not-allowed" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Verified Checkboxes */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="isEmailVerfied"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormLabel>Email Verified</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isPhoneVerfied"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormLabel>Phone Verified</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Password */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter password to confirm changes" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Update Profile
                    </Button>
                </form>
            </Form>

            {/* Addresses */}
            <div className="bg-white shadow rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">My Addresses</h3>
                <ShowAddress />
                <AddAddressFormWrapper
                    trigger={<Button variant="secondary">Add Address</Button>}
                />
            </div>
        </div>
    );
};

export default DashboardProfileForm;
