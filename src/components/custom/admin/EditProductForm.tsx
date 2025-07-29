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
import { Link, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

type Product = {
    title: string;
    images: string[];
    sku: string[];
    hasConfigurations: boolean;
    configurations: { key: string; image: string; sku: string }[];
    tags: string[];
    variations: {
        type: string;
        name: string;
        values: string[];
    }[];
    productType: string[];
    mainCategories: string[];
    subCategories: string[];
    price: number;
    priceInUSD: number;
};
type MultiSelectFieldName = 'productType' | 'mainCategories' | 'subCategories';


const EditProductForm = ({ slug, onClose }: { slug?: string, onClose: () => void }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [defaultImages, setDefaultImages] = useState<string[]>([]);

    const [productTypeOptions, setProductTypeOptions] = useState<string[]>([]);
    const [mainCategoryOptions, setMainCategoryOptions] = useState<string[]>([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState<string[]>([]);

    const form = useForm<z.infer<typeof editProductSchema>>({
        resolver: zodResolver(editProductSchema),
        defaultValues: {
            variantMappings: [],
            productType: [],
            mainCategories: [],
            subCategories: [],
            price: 0,
            priceInUSD: 0
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

                const productTypeRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product-types`);
                const productJson = await productTypeRes.json();
                const rawProductTypes = productJson.data.productTypes[0];

                setProductTypeOptions(rawProductTypes.productType.split(',').map((v: string) => v.trim()));
                setMainCategoryOptions(rawProductTypes.mainCategories.split(',').map((v: string) => v.trim()));
                setSubCategoryOptions(rawProductTypes.subCategories.split(',').map((v: string) => v.trim()));

                setProduct(fetchedProduct);

                const imageList = fetchedProduct.images || [];
                const skuList = fetchedProduct.sku || [];

                if (fetchedProduct.hasConfigurations && fetchedProduct.configurations?.length) {
                    replace(fetchedProduct.configurations);
                    form.reset({
                        variantMappings: fetchedProduct.configurations,
                        productType: fetchedProduct.productType || [],
                        mainCategories: fetchedProduct.mainCategories || [],
                        subCategories: fetchedProduct.subCategories || [],
                        price: fetchedProduct.price || 0,
                        priceInUSD: fetchedProduct.priceInUSD || 0,
                    });

                    const usedImages = new Set(fetchedProduct.configurations.map(c => c.image));
                    setDefaultImages(imageList.filter(img => !usedImages.has(img)));
                    return;
                }

                const usedImages = new Set<string>();
                const variation = fetchedProduct.variations?.[0];
                const values = variation?.values || [];

                const mappings = values.map((val, i) => {
                    const image = imageList[i] ?? '';
                    const matchedSku = skuList.find((sku) => sku.toLowerCase().includes(val.toLowerCase()));
                    if (image) usedImages.add(image);
                    return { key: val, image, sku: matchedSku || '' };
                });

                setDefaultImages(imageList.filter((img) => !usedImages.has(img)));
                replace(mappings);
                form.reset({
                    variantMappings: mappings,
                    productType: fetchedProduct.productType || [],
                    mainCategories: fetchedProduct.mainCategories || [],
                    subCategories: fetchedProduct.subCategories || [],
                    price: fetchedProduct.price || 0,
                    priceInUSD: fetchedProduct.priceInUSD || 0,
                });

            } catch (err) {
                console.error('Failed to fetch product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug, replace, form]);

    const handleMultiCheckbox = (fieldValue: string[], option: string, onChange: (value: string[]) => void) => {
        if (fieldValue.includes(option)) {
            onChange(fieldValue.filter((v) => v !== option));
        } else {
            onChange([...fieldValue, option]);
        }
    };

    const onSubmit = async (values: z.infer<typeof editProductSchema>) => {
        try {
            const skuList = product?.sku || [];
            const configKey = skuList[0]?.split('_')[1] ?? '';

            await createProductConfigurator({
                ...values,
                configKey
            });

            toast.success(`Product Successfully Updated! - ${product?.title}`);
            onClose();
        } catch (error) {
            toast.error(`Error While Updating Product - ${product?.title} \n Try Again later.`);
            console.error(error);
        }
    };

    if (loading) {
        return (
            <>
                <SkeletonCard height={150} />
                <SkeletonCard height={150} />
                <SkeletonCard isLinesShowing={false} />
            </>
        );
    }

    if (!product) return <p>Product not found</p>;

    const multiSelectFields: {
        name: MultiSelectFieldName;
        label: string;
        options: string[];
    }[] = [
            { name: 'productType', label: 'Product Type', options: productTypeOptions },
            { name: 'mainCategories', label: 'Main Categories', options: mainCategoryOptions },
            { name: 'subCategories', label: 'Sub Categories', options: subCategoryOptions },
        ];


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                <h1 className='capitalize'>Product Name: <br />{product.title}</h1>

                <Image src={product.images[0]}
                    width={200}
                    height={200}
                    alt={product.title}
                    className='rounded-xl'
                />

                {/* PRICE */}
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price In INR</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter price"
                                    type="number"
                                    {...field}

                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* PRICE IN USD */}
                <FormField
                    control={form.control}
                    name="priceInUSD"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price In USD</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter price in USD"
                                    type="number"
                                    {...field}

                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Multi-Select Checkboxes */}
                {multiSelectFields.map(({ name, label, options }) => (
                    <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{label}</FormLabel>
                                <div className="flex flex-wrap gap-3">
                                    {options.map((option) => (
                                        <label key={option} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={field.value?.includes(option)}
                                                onChange={() =>
                                                    handleMultiCheckbox(field.value ?? [], option, field.onChange)

                                                }
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}


                {/* Config mappings */}
                {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col gap-3 border p-3 rounded-md">
                        <FormLabel className="text-lg capitalize">{field.key}</FormLabel>
                        <div className="flex gap-4 flex-col sm:flex-row">
                            <FormField
                                control={form.control}
                                name={`variantMappings.${index}.image`}
                                render={({ field }) => {
                                    const uniqueImages = [...new Set([field.value, ...product.images])];
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
                                                            <Image src={imgUrl} alt={`img-${i}`} width={30} height={30} className="inline-block mr-2 rounded-sm" />
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
                            <FormField
                                control={form.control}
                                name={`variantMappings.${index}.sku`}
                                render={({ field }) => {
                                    const uniqueSkus = [...new Set([field.value, ...product.sku])];
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
                                                        <SelectItem key={i} value={sku}>{sku}</SelectItem>
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

                {/* Preview unused images */}
                {defaultImages.length > 0 && (
                    <div className="mt-6">
                        <FormLabel className="text-sm font-semibold">Product Size Images</FormLabel>
                        <div className="flex gap-2 flex-wrap mt-2">
                            {defaultImages.map((img, i) => (
                                <Image key={i} src={img} alt="unmapped image" width={60} height={60} className="rounded border" />
                            ))}
                        </div>
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="tags"
                    render={() => (
                        <FormItem>
                            <FormLabel>Product Tags</FormLabel>
                            <FormControl>
                                <Textarea defaultValue={product.tags.join(', ')} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="mt-6" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Link className="h-4 w-4" />
                            Update the Product
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default EditProductForm;
