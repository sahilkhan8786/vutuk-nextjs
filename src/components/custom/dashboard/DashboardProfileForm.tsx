"use client";

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
        defaultValues: {
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            isEmailVerfied: userData.isEmailVerfied,
            isPhoneVerfied: userData.isPhoneVerfied,
            password: "",
        },
    });

    const userIntials = userData.username && getInitials(userData.username);

    function onSubmit(values: FormValues) {
        console.log("Updated values:", values);
        // call server action here
    }


    return (
        <div>
            {/* Profile Image + Edit Button */}
            <div className="flex items-center justify-center w-full relative">
                {userData.image ? (
                    <Image
                        src={userData.image}
                        alt="user-avatar"
                        width={100}
                        height={100}
                        className="rounded-full cursor-pointer"
                    />
                ) : (
                    <div className="rounded-full text-dark size-[100px] flex items-center justify-center font-medium cursor-pointer bg-white">
                        {userIntials}
                    </div>
                )}
                <UpdatProfileImageFormWrapper
                    trigger={
                        <div className="absolute bottom-0 bg-white rounded-full p-1 translate-x-8 border cursor-pointer hover:bg-gray-100 hover:-translate-y-0.5 hover:scale-105 transition-all">
                            <Pencil className="size-4 text-sm" />
                        </div>
                    }
                    id={userData.id}
                />
            </div>

            {/* VERFIY EMAIL */}
            {userData.isEmailVerfied ? (<div className="text-green-500 border border-green-500 w-fit px-4 rounded-full flex gap-4">
                <CheckCircle />
                Email is Verified</div>) :
                (
                    <>
                        <div className="text-red-500 border border-red-500 w-fit px-4 rounded-full flex gap-4">
                            <XCircle />
                            <span>
                                Email Not Verified
                            </span>
                            {/*VERIFY EMAIL FORM WRAPPER  */}

                        </div>
                        <VerifyEmailFromWrapper
                            trigger={<Button>Verify Email</Button>}
                        />
                    </>
                )
            }

            {/* PHONE VERIFICATION */}
            {userData.isPhoneVerfied ? (<div className="text-green-500 border border-green-500 w-fit px-4 rounded-full flex gap-4">
                <CheckCircle />
                Phone is Verified</div>) :
                (
                    <>
                        <div className="text-red-500 border border-red-500 w-fit px-4 rounded-full flex gap-4">
                            <XCircle />
                            <span>
                                Phone Not Verified
                            </span>
                            {/*VERIFY EMAIL FORM WRAPPER  */}

                        </div>
                        <VerifyMobileFormWrapper
                            phoneNumber={userData.phone}

                            trigger={<Button>Verify Phone Number</Button>}
                        />
                    </>
                )
            }

            {/* Profile Form */}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 max-w-2xl mx-auto bg-white p-4 rounded-xl"
                >
                    {/* Username */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Iamvutuk" {...field} />
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
                                    <Input {...field} readOnly className="bg-muted cursor-not-allowed" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone number - read-only if it exists */}
                    {/* <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="+91 1234567890"
                                        readOnly={!phoneEditable}
                                        className={!phoneEditable ? "bg-muted cursor-not-allowed" : ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Phone Verified */}
                    <FormField
                        control={form.control}
                        name="isPhoneVerfied"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                                <FormLabel>Phone Verified</FormLabel>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email Verified */}
                    <FormField
                        control={form.control}
                        name="isEmailVerfied"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                                <FormLabel>Email Verified</FormLabel>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password (required to confirm updates) */}
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

                    <Button type="submit" className="mt-4">
                        Submit
                    </Button>
                </form>
            </Form>

            {/* ADDRESSES */}
            <form >
                <h3>You Addresses</h3>
                <ShowAddress />


                <AddAddressFormWrapper
                    trigger={<Button variant={'secondary'}>Add Address</Button>}
                />


            </form>

        </div>
    );
};

export default DashboardProfileForm;
