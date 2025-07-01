'use client';

import { editProductSchema } from '@/schemas/editProductSchema';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from "zod";
import { useEffect, useState } from 'react';
import {
    Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from '@/components/ui/form';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { createProductConfigurator } from '@/actions/products';
import { toast } from 'sonner';
import { SkeletonCard } from '../skeletons/SkeletonCard';


type Product = {
    title: string;
    images: string[];
    sku: string[];
    hasConfigurations: boolean;
    configurations?: { key: string; image: string; sku: string }[];
    variations: {
        type: string;
        name: string;
        values: string[];
    }[];
};

const EditProductForm = ({ slug, onClose }: {
    slug?: string,
    onClose: () => void
}) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [defaultImages, setDefaultImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof editProductSchema>>({
        resolver: zodResolver(editProductSchema),
        defaultValues: {
            variantMappings: [],
        },
        mode: 'onChange',
    });

    const { fields, replace } = useFieldArray({
        control: form.control,
        name: 'variantMappings',
    });

    useEffect(() => {
        if (!slug) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`);
                const json = await res.json();
                const fetchedProduct: Product = json.data.product;
                console.log(fetchedProduct)
                setProduct(fetchedProduct);

                const skuList = fetchedProduct.sku || [];
                const imageList = fetchedProduct.images || [];

                if (fetchedProduct.hasConfigurations && fetchedProduct.configurations?.length) {
                    replace(fetchedProduct.configurations);
                    form.reset({ variantMappings: fetchedProduct.configurations });

                    // Detect extra images not part of configurations
                    const usedImages = new Set(fetchedProduct.configurations.map(c => c.image));
                    const unusedImages = imageList.filter(img => !usedImages.has(img));
                    setDefaultImages(unusedImages);
                    return;
                }

                // Dynamically generate
                const usedImages = new Set<string>();
                const usedSkus = new Set<string>();

                const variation = fetchedProduct.variations?.[0];
                const values = variation?.values || [];

                const mappings = values.map((val, i) => {
                    const image = imageList[i] ?? '';
                    if (image) usedImages.add(image);

                    const matchedSku = skuList.find((sku) =>
                        sku.toLowerCase().includes(val.toLowerCase())
                    );
                    if (matchedSku) usedSkus.add(matchedSku);

                    return {
                        key: val,
                        image,
                        sku: matchedSku || '',
                    };
                });

                const unusedImages = imageList.filter((img) => !usedImages.has(img));
                setDefaultImages(unusedImages);

                replace(mappings);
                form.reset({ variantMappings: mappings });

            } catch (err) {
                console.error('Failed to fetch product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug, replace, form]);

    const onSubmit = async (values: z.infer<typeof editProductSchema>) => {
        try {
            const skuList = product?.sku || [];
            const configKey = skuList[0]?.split('_')[1] ?? '';

            await createProductConfigurator({
                ...values,
                configKey,
            });

            toast.success(`Product Successfully Updated! - ${product?.title}`,)
            onClose();
        } catch (error) {
            toast.error(`Error While Updating Product - ${product?.title} \n Try Again! later.`,)
            console.error(error);
        }
    };

    if (loading) {
        return <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard isLinesShowing={false} />
        </>
    };
    if (!product) return <p>Product not found</p>;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">

                {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col gap-3 border p-3 rounded-md">
                        <FormLabel className="text-lg capitalize">{field.key}</FormLabel>
                        <div className="flex gap-4 flex-col sm:flex-row">
                            {/* Image Select */}
                            <FormField
                                control={form.control}
                                name={`variantMappings.${index}.image`}
                                render={({ field }) => {
                                    const configuredImages = product?.hasConfigurations
                                        ? fields.map(f => f.image).filter(Boolean)
                                        : product.images;

                                    const uniqueImages = [...new Set([field.value, ...configuredImages])];

                                    return (
                                        <FormItem className="w-full">
                                            <FormLabel>Select Image</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose image" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {uniqueImages.map((imgUrl, i) => (
                                                        <SelectItem key={i} value={imgUrl}>
                                                            <Image
                                                                src={imgUrl}
                                                                alt={`img-${i}`}
                                                                width={30}
                                                                height={30}
                                                                className="inline-block mr-2 rounded-sm"
                                                            />
                                                            Image {i + 1}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                            {/* SKU Select */}
                            <FormField
                                control={form.control}
                                name={`variantMappings.${index}.sku`}
                                render={({ field }) => {
                                    const configuredSkus = product?.hasConfigurations
                                        ? fields.map(f => f.sku).filter(Boolean)
                                        : product?.sku || [];

                                    const uniqueSkus = [...new Set([field.value, ...configuredSkus])];

                                    return (
                                        <FormItem className="w-full">
                                            <FormLabel>Select SKU</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose SKU" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {uniqueSkus.map((sku, i) => (
                                                        <SelectItem key={i} value={sku}>
                                                            {sku}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                        </div>
                    </div>
                ))}

                {/* Just preview default (unused) images */}
                {defaultImages.length > 0 && (
                    <div className="mt-6">
                        <FormLabel className="text-sm font-semibold">Unmapped Product Images</FormLabel>
                        <div className="flex gap-2 flex-wrap mt-2">
                            {defaultImages.map((img, i) => (
                                <Image
                                    key={i}
                                    src={img}
                                    alt="unmapped image"
                                    width={60}
                                    height={60}
                                    className="rounded border"
                                />
                            ))}
                        </div>
                    </div>
                )}

                <Button type="submit" className="mt-6"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting && (
                        <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                    )}
                    Update the Product
                </Button>
            </form>
        </Form>
    );
};

export default EditProductForm;
