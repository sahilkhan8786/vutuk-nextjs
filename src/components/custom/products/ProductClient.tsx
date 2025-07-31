'use client';

import React, { useState } from 'react';
import WidthCard from '@/components/ui/WidthCard';
import ProductImageGallery from './ProductImageGallery';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCarusalContainer from './ProductCarusalContainer';
import AddToCartButton from '../shop/AddToCartButton';

interface Configuration {
    key: string;
    image: string;
    sku: string;
}

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    priceInUSD: number;
    configurations: Configuration[];
    quantity: number;
}

const ProductClient = ({ product }: { product: Product }) => {
    console.log(product)
    const [selectedKey, setSelectedKey] = useState<string>(product.configurations[0]?.key);
    const [quantity, setQuantity] = useState<number>(1);

    const selectedConfig = product.configurations.find((c) => c.key === selectedKey)!;

    const handleColorSelect = (key: string) => setSelectedKey(key);

    const handleThumbnailClick = (img: string) => {
        const config = product.configurations.find((c) => c.image === img);
        if (config) setSelectedKey(config.key);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) setQuantity(value);
    };

    return (
        <div className="mt-24">
            <WidthCard className="min-h-screen pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Images */}
                    <ProductImageGallery
                        configurations={product.configurations}
                        selectedImage={selectedConfig.image}
                        onImageSelect={handleThumbnailClick}
                    />

                    {/* Info */}
                    <div className="space-y-5">
                        <h1 className="text-2xl font-bold">{product.title}</h1>
                        <p className="text-muted-foreground whitespace-pre-wrap text-sm">
                            {product.description}
                        </p>
                        {product.price && <p className="text-xl font-semibold text-primary">₹{product.price}</p>}
                        {product.priceInUSD && <p className="text-xl font-semibold text-primary">${product.priceInUSD}</p>}

                        {/* Color Selection */}
                        <div className="space-y-2">
                            <label className="font-medium block">Select Color:</label>
                            <Select value={selectedKey} onValueChange={handleColorSelect}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Choose a color" />
                                </SelectTrigger>
                                <SelectContent>
                                    {product.configurations.map((config) => (
                                        <SelectItem key={config.key} value={config.key}>
                                            {config.key}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex items-center gap-4 mt-6">
                            <input
                                type="number"
                                min={1}
                                max={product.quantity}
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="w-20 border rounded px-2 py-1"
                            />
                            <AddToCartButton
                                product={product}
                                selectedConfig={{
                                    key: selectedConfig.key,
                                    sku: selectedConfig.sku,
                                    image: selectedConfig.image,
                                }}
                                quantity={quantity}
                            />

                        </div>

                        <p className="text-sm text-muted-foreground mt-1">
                            Available stock: {product.quantity}
                        </p>
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
