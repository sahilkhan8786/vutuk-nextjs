'use client';

import React, { useState } from 'react';
import WidthCard from '@/components/ui/WidthCard';
import ProductImageGallery from './ProductImageGallery';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCarusalContainer from './ProductCarusalContainer';
import AddToCartButton from '../shop/AddToCartButton';
import { FaLocationPin } from 'react-icons/fa6';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Variations {
    name: string;
    type: string;
    values: string[];


}

interface Product {
    _id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    priceInUSD: number;
    quantity: number;
    images: string[];
    sizeImage?: string[];
    variations: Variations[]
    sku: string[]
}

const ProductClient = ({ product }: { product: Product }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [readMore, setReadMore] = useState<boolean>(true);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);


    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) setQuantity(value);
    };

    const colorVariations = product.variations[0].type === 'Colour' ? product.variations[0].values : [];
    const colorVariationsLength = product.variations[0].type === 'Colour' ? product.variations[0].values.length : 0;

    function onClickReadMore() {
        setReadMore(prev => !prev)
    }

    return (
        <div className="mt-8 md:mt-24">
            <WidthCard className="min-h-screen pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Images */}
                    <ProductImageGallery
                        images={product.images}
                        sizeImages={product.sizeImage}
                    />

                    {/* Info */}



                    <div className="space-y-4">
                        {/* PRICE */}

                        {product.price && <p className="text-5xl font-semibold text-primary">₹{product.price.toFixed(2)}</p>}
                        {product.priceInUSD && <p className="text-5xl font-semibold text-primary">${product.priceInUSD.toFixed(2)}</p>}

                        <h1 className="text-xl font-bold text-muted-foreground capitalize mt-8">{product.title}</h1>
                        <div className='space-y-2'>

                            <p>Local taxes included (where applicable)</p>
                            <p className='flex items-center gap-4'>
                                <FaLocationPin /> Dispatched from India</p>
                        </div>



                        {/* Color Selection */}
                        <div className="space-y-2">
                            <label className="font-medium block">Select Color:</label>
                            <h3 className='text-sm text-muted-foreground'>Available in {colorVariationsLength} Colors</h3>
                            <Select
                                onValueChange={(value) => setSelectedColor(value)}
                                value={selectedColor}
                            >
                                <SelectTrigger className="w-full capitalize">
                                    <SelectValue placeholder="Color" />
                                </SelectTrigger>
                                <SelectContent >
                                    {colorVariations.length > 0 && colorVariations?.map((color: string) => (
                                        <SelectItem
                                            key={color}
                                            value={color} className='capitalize'>{color}
                                        </SelectItem>

                                    ))}
                                </SelectContent>
                            </Select>

                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex items-center gap-4 mt-6 w-full">
                            <input
                                type="number"
                                min={1}
                                max={product.quantity}
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="flex-1 border rounded px-2 py-1"
                            />
                            <AddToCartButton
                                className='flex-5'
                                product={{
                                    _id: product._id,
                                    slug: product.slug, // ✅ added
                                    title: product.title,
                                    price: product.price || product.priceInUSD || 0,
                                    priceInUSD: product.priceInUSD || 0, // ✅ added
                                    images: product.images,
                                    sku: product.sku,
                                }}
                                quantity={1}
                            />

                        </div>

                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                            <Image
                                src={'/pocket-watch-final.gif'}
                                alt='Wach GIF'
                                width={40}
                                height={40}
                            />
                            Hurry Up, Only a few Left
                        </p>
                    </div>
                </div>

                <div className='mt-8 flex gap-8'>

                    <video src="https://v.etsystatic.com/video/upload/ac_none,du_15,q_auto:good/Vutuk_Product_Reel_1_hzsieo.mp4"
                        autoPlay={true}
                        controls
                        loop={true}
                        className='h-[500px]'

                    ></video>
                    <div>



                        <h2 className='text-2xl font-medium mb-4'>Product Description</h2>
                        <p className="text-muted-foreground/75 whitespace-pre-wrap text-sm">
                            {readMore
                                ? product.description
                                : `${product.description.slice(0, 150)}...`
                            }
                        </p>
                        <div className='flex items-center  justify-center'>

                            <Button variant={'outline'} className='bg-transparent hover:-translate-y-0.5 transition-all my-8 ' onClick={onClickReadMore}>{readMore ? 'Show Less' : 'Show More'}</Button>
                        </div>
                    </div>
                </div>

            </WidthCard>

            <ProductCarusalContainer title="Featured Products" />
            <ProductCarusalContainer title="Similar Products" />
            <ProductCarusalContainer title="Similar Categories" />
        </div>
    );
};

export default ProductClient;
