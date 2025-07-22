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
import { Pencil } from "lucide-react";
import UpdatProfileImageFormWrapper from "../admin/wrappers/UpdatProfileImageFormWrapper";
import { getInitials } from "@/utils/helpers";




type FormValues = z.infer<typeof formSchemaUserProfile>;

const DashboardProfileForm = ({ defaultValues }: {
    defaultValues: FormValues
}) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchemaUserProfile),
        defaultValues
    });

    console.log(defaultValues)


    const userIntials = defaultValues.username && getInitials(defaultValues.username)

    function onSubmit(values: FormValues) {
        console.log("Form Data:", values);
    }

    return (
        <div className="">


            <div className="flex items-center justify-center w-full relative">
                {defaultValues.image ?
                    <Image
                        src={defaultValues.image}
                        alt='user-avatar'
                        width={100}
                        height={100}
                        className='rounded-full cursor-pointer'
                    />
                    :
                    <div className='rounded-full  text-dark size-[100px] flex items-center justify-center font-medium cursor-pointer bg-white'>{userIntials}</div>
                }

                <UpdatProfileImageFormWrapper
                    trigger={
                        <div className="absolute bottom-0 bg-white rounded-full p-1  translate-x-8 border cursor-pointer hover:bg-gray-100 hover:-translate-y-0.5 hover:scale-105  transition-all">
                            <Pencil className=" size-4 text-sm" />
                        </div>
                    }
                    id={defaultValues.id}
                >


                </UpdatProfileImageFormWrapper>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6  max-w-2xl mx-auto bg-white p-4 rounded-xl"
                >
                    {/* IMAGE */}



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

                    <div className="flex justify-between gap-4  items-center">

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className=" w-full">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@gmail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isEmailVerfied"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 w-fit justify-center">
                                    <FormLabel className="whitespace-nowrap">Email Verified</FormLabel>
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
                    </div>

                    <div className="flex justify-between gap-4  items-center">

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+91 1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isPhoneVerfied"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 justify-center">
                                    <FormLabel className="whitespace-nowrap">Phone Verified</FormLabel>
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
                    </div>



                    <Button type="submit" className="mt-4">
                        Submit
                    </Button>
                </form>
            </Form>
        </div >
    );
};

export default DashboardProfileForm;
