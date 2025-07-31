'use client'

import React, { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { productCategoriesFormSchema } from '@/schemas/additionaDataSchemas'
import {
    addOrUpdateProductExtraDetails,
    getProductExtraDetails,
} from '@/actions/additional-data'

type ProductCategoryFormValues = z.infer<typeof productCategoriesFormSchema>

const AdminAdditionalDatapage = () => {
    const form = useForm<ProductCategoryFormValues>({
        resolver: zodResolver(productCategoriesFormSchema),
        defaultValues: {
            productType: [],
            mainCategories: [],
            subCategories: [],
        },
    })

    const {
        fields: productTypeFields,
        append: appendProductType,
        remove: removeProductType,
    } = useFieldArray({
        control: form.control,
        name: 'productType' as const,
    })

    const {
        fields: mainCategoryFields,
        append: appendMainCategory,
        remove: removeMainCategory,
    } = useFieldArray({
        control: form.control,
        name: 'mainCategories' as const,
    })

    const {
        fields: subCategoryFields,
        append: appendSubCategory,
        remove: removeSubCategory,
    } = useFieldArray({
        control: form.control,
        name: 'subCategories' as const,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProductExtraDetails()
                if (res) {
                    form.reset({
                        productType: res.productType?.split(',').map((v: string) => ({ value: v })) ?? [],
                        mainCategories: res.mainCategories?.split(',').map((v: string) => ({ value: v })) ?? [],
                        subCategories: res.subCategories?.split(',').map((v: string) => ({ value: v })) ?? [],
                    })
                }
            } catch (error) {
                console.error('Failed to fetch product extra details', error)
            }
        }

        fetchData()
    }, [form])

    async function onSubmit(values: ProductCategoryFormValues) {
        try {
            await addOrUpdateProductExtraDetails({
                productType: values.productType.map((item) => item.value),
                mainCategories: values.mainCategories.map((item) => item.value),
                subCategories: values.subCategories.map((item) => item.value),
            })

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <h1 className="text-4xl font-semibold uppercase bg-white rounded-xl p-4">
                Additional Data
            </h1>

            <div className="grid w-full gap-6 grid-cols-1 my-6 bg-white p-4 rounded-xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8   ">
                        {/* Product Types */}
                        <FormItem>
                            <FormLabel>Product Types</FormLabel>
                            <FormDescription>Add or remove product types</FormDescription>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-4'>

                                {productTypeFields.map((field, index) => (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`productType.${index}.value`}
                                        render={({ field }) => (
                                            <div className="flex items-center gap-2 mb-2">
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., vase" />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() => removeProductType(index)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    />
                                ))}
                            </div>
                            <Button type="button" onClick={() => appendProductType({ value: '' })}>
                                Add Product Type
                            </Button>
                        </FormItem>

                        {/* Main Categories */}
                        <FormItem>
                            <FormLabel>Main Categories</FormLabel>
                            <FormDescription>Add or remove main categories</FormDescription>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-4'>

                                {mainCategoryFields.map((field, index) => (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`mainCategories.${index}.value`}
                                        render={({ field }) => (
                                            <div className="flex items-center gap-2 mb-2">
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., decor" />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() => removeMainCategory(index)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    />
                                ))}
                            </div>
                            <Button type="button" onClick={() => appendMainCategory({ value: '' })}>
                                Add Main Category
                            </Button>
                        </FormItem>

                        {/* Sub Categories */}
                        <FormItem>
                            <FormLabel>Sub Categories</FormLabel>
                            <FormDescription>Add or remove sub categories</FormDescription>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-4'>

                                {subCategoryFields.map((field, index) => (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`subCategories.${index}.value`}
                                        render={({ field }) => (
                                            <div className="flex items-center gap-2 mb-2">
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., sculpture" />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() => removeSubCategory(index)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    />
                                ))}
                            </div>
                            <Button type="button" onClick={() => appendSubCategory({ value: '' })}>
                                Add Sub Category
                            </Button>
                        </FormItem>

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default AdminAdditionalDatapage
