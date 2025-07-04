"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
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




type FormValues = z.infer<typeof formSchemaUserProfile>;

const UserProfilePage = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchemaUserProfile),
        defaultValues: {
            username: "",
            email: "",
            isEmailVerfied: false,
            phone: "",
            isPhoneVerfied: false,
            deliverAddress: [
                {
                    shippingAddressLine1: "",
                    shippingAddressLine2: "",
                    country: "",
                    pinCode: 0,
                    state: "",
                    city: "",
                },
            ],
        },
    });




    const {
        fields: addressFields,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "deliverAddress",
    });

    function onSubmit(values: FormValues) {
        console.log("Form Data:", values);
    }

    return (
        <div className="">

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6  max-w-2xl mx-auto bg-white p-4 rounded-xl"
                >
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

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Delivery Addresses</h3>
                        {addressFields.map((field, index) => (
                            <div key={field.id} className="space-y-4 border p-4 rounded-md">
                                <FormField
                                    control={form.control}
                                    name={`deliverAddress.${index}.shippingAddressLine1`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address Line 1</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`deliverAddress.${index}.shippingAddressLine2`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address Line 2</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-between gap-4">

                                    <FormField
                                        control={form.control}
                                        name={`deliverAddress.${index}.country`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`deliverAddress.${index}.state`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>State</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex justify-between gap-4">


                                    <FormField
                                        control={form.control}
                                        name={`deliverAddress.${index}.city`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`deliverAddress.${index}.pinCode`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Pin Code</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => remove(index)}
                                >
                                    Remove Address
                                </Button>
                            </div>
                        ))}

                        <Button
                            type="button"
                            onClick={() =>
                                append({
                                    shippingAddressLine1: "",
                                    shippingAddressLine2: "",
                                    country: "",
                                    pinCode: 0,
                                    state: "",
                                    city: "",
                                })
                            }
                        >
                            Add Address
                        </Button>
                    </div>

                    <Button type="submit" className="mt-4">
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default UserProfilePage;
