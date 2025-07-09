"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { productCategoriesFormSchema } from '@/schemas/additionaDataSchemas';
import { addOrUpdateProductExtraDetails, getProductExtraDetails } from '@/actions/additional-data';

const AdminAdditionalDatapage = () => {
    const form = useForm<z.infer<typeof productCategoriesFormSchema>>({
        resolver: zodResolver(productCategoriesFormSchema),
        defaultValues: {
            productType: "",
            mainCategories: "",
            subCategories: "",
        },
    });

    // Prefill data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProductExtraDetails(); // 👈 should return { productType: string, ... }
                if (res) {
                    form.reset({
                        productType: res.productType ?? "",
                        mainCategories: res.mainCategories ?? "",
                        subCategories: res.subCategories ?? "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch product extra details", error);
            }
        };

        fetchData();
    }, [form]);

    async function onSubmit(values: z.infer<typeof productCategoriesFormSchema>) {
        try {
            await addOrUpdateProductExtraDetails(values);
            console.log("Saved:", values);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <h1 className='text-4xl font-semibold uppercase bg-white rounded-xl p-4'>Additional Data</h1>

            <div className='grid w-full gap-6 grid-cols-1 my-6 bg-white p-4 rounded-xl'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="productType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter Product Types</FormLabel>
                                    <FormControl>
                                        <Input placeholder="vase, home decor" {...field} />
                                    </FormControl>
                                    <FormDescription>Enter comma-separated product types</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mainCategories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter Main Categories</FormLabel>
                                    <FormControl>
                                        <Input placeholder="decor, gifts" {...field} />
                                    </FormControl>
                                    <FormDescription>Enter comma-separated main categories</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subCategories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter Sub Categories</FormLabel>
                                    <FormControl>
                                        <Input placeholder="wall hangings, art, sculpture" {...field} />
                                    </FormControl>
                                    <FormDescription>Enter comma-separated sub categories</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </>
    );
};

export default AdminAdditionalDatapage;
