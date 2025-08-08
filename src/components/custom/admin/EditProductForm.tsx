'use client';

import { editProductSchema } from '@/schemas/editProductSchema';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { useEffect, useState } from 'react';
import {
    Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { createProductConfigurator } from '@/actions/products';
import { toast } from 'sonner';
import { SkeletonCard } from '../skeletons/SkeletonCard';
import { Link, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { getUsdToInrRate } from '@/lib/getExchangeRate';
import { Checkbox } from '@/components/ui/checkbox';

type Product = {
    title: string;
    description: string;
    images: string[];
    sku: string[];
    hasConfigurations: boolean;
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
    sizeImages?: string[];
    videoURL?: string;
};
type MultiSelectFieldName = 'productType' | 'mainCategories' | 'subCategories';


const EditProductForm = ({ slug, onClose }: { slug?: string, onClose: () => void }) => {


    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [rates, setRates] = useState(0);

    const [productTypeOptions, setProductTypeOptions] = useState<string[]>([]);
    const [mainCategoryOptions, setMainCategoryOptions] = useState<string[]>([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState<string[]>([]);

    const form = useForm<z.infer<typeof editProductSchema>>({
        resolver: zodResolver(editProductSchema),
        defaultValues: {
            productType: [],
            mainCategories: [],
            subCategories: [],
            price: 0,
            priceInUSD: 0
        },
        mode: 'onChange',
    });
    const selectedSizeImages = form.watch("sizeImages") || [];


    useEffect(() => {
        if (!slug) return;

        const fetchProduct = async () => {
            try {
                const ratesData = await getUsdToInrRate();
                setRates(ratesData)
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`, {
                    credentials: 'include'
                });
                const json = await res.json();
                const fetchedProduct: Product = json.data.product;
                const productTypeRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product-types`);
                const productJson = await productTypeRes.json();
                const rawProductTypes = productJson.data.productTypes[0];

                setProductTypeOptions(rawProductTypes.productType.split(',').map((v: string) => v.trim()));
                setMainCategoryOptions(rawProductTypes.mainCategories.split(',').map((v: string) => v.trim()));
                setSubCategoryOptions(rawProductTypes.subCategories.split(',').map((v: string) => v.trim()));
                setProduct(fetchedProduct);



                if (fetchedProduct.hasConfigurations) {
                    form.reset({
                        title: fetchedProduct.title || '',
                        videoURL: fetchedProduct.videoURL || '',
                        description: fetchedProduct.description || '',
                        productType: fetchedProduct.productType || [],
                        mainCategories: fetchedProduct.mainCategories || [],
                        subCategories: fetchedProduct.subCategories || [],
                        price: fetchedProduct.price || 0,
                        priceInUSD: fetchedProduct.priceInUSD || fetchedProduct.price / rates || 0,
                    });



                    return;
                }






                form.reset({
                    title: fetchedProduct.title || '',
                    videoURL: fetchedProduct.videoURL || '',
                    description: fetchedProduct.description || '',
                    productType: fetchedProduct.productType || [],
                    mainCategories: fetchedProduct.mainCategories || [],
                    subCategories: fetchedProduct.subCategories || [],
                    price: fetchedProduct.price || 0,
                    priceInUSD: fetchedProduct.priceInUSD || fetchedProduct.price / rates || 0,
                });

            } catch (err) {
                console.error('Failed to fetch product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug, form, rates]);

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
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter Product Name"
                                    {...field}

                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Image src={product.images[0]}
                    width={450}
                    height={450}
                    alt={product.title}
                    className='rounded-xl'
                />
                <div className='bg-secondary rounded-xl py-4'>

                    <h3 className='mb-4 px-4'>Product Images -
                        <span className='text-muted-foreground underline'> Select the Product Size Images</span>
                    </h3>
                    <div className='flex flex-wrap w-full gap-4 px-2'>

                        {product.images.map(image => (
                            <FormField
                                key={image}
                                control={form.control}
                                name="sizeImages"
                                render={({ field }) => {
                                    const isChecked = field.value?.includes(image);

                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex items-center gap-4">
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                // Add image to selected list
                                                                field.onChange([...(field.value || []), image]);
                                                            } else {
                                                                // Remove image from selected list
                                                                field.onChange(
                                                                    (field.value || []).filter((img: string) => img !== image)
                                                                );
                                                            }
                                                        }}
                                                        className="bg-primary"
                                                    />
                                                    <Image
                                                        src={image}
                                                        alt={`Product Image - ${image}`}
                                                        className="rounded-xl"
                                                        width={100}
                                                        height={100}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    );
                                }}
                            />
                        ))}

                    </div>


                    <FormField
                        control={form.control}
                        name="videoURL"
                        render={({ field }) => (
                            <FormItem className='mt-8 px-4'>
                                <FormLabel>Product Video URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter the URL'
                                        {...field}

                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                </div>


                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='Enter the Description'
                                    {...field}

                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {product.sizeImages && <div className='bg-secondary p-4 rounded-xl'>
                    <h3 className='mb-4'
                    >Product Size Images</h3>
                    <div className='flex flex-wrap'>

                        {product.sizeImages.map(image => (
                            <Image key={image}
                                src={image}
                                alt={`Size Image - ${image}`}
                                width={450}
                                height={450}
                                className='rounded-xl'
                            />
                        ))}

                    </div>
                </div>}
                {selectedSizeImages.length > 0 && (
                    <div className='bg-secondary p-4 rounded-xl'>
                        <h3 className='mb-4'>Selected Product Size Images</h3>
                        <div className='flex flex-wrap gap-4'>
                            {selectedSizeImages.map(image => (
                                <Image
                                    key={image}
                                    src={image}
                                    alt={`Selected Size Image - ${image}`}
                                    width={450}
                                    height={450}
                                    className='rounded-xl'
                                />
                            ))}
                        </div>
                    </div>
                )}



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
                                    value={field.value}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}

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
                            <FormLabel>Price In USD <p className='text-xs'>Curent Rates :- ${rates}</p></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter price in USD"
                                    type="number"
                                    value={field.value}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                {/* {fields.map((field, index) => (
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
                                                            <Image src={imgUrl} alt={`img-${i}`} width={50} height={50} className="inline-block mr-2 rounded-sm" />
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
                ))} */}
                {/* SELECT SIZE IMAGE */}



                {/* <FormField
                    control={form.control}

                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Product Size Images</FormLabel>
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
                /> */}



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
