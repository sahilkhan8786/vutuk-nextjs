'use client';
import React, { useState } from 'react';
import {
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import ImagesCarousal from './ImagesCarousal';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Trash2 } from 'lucide-react';

interface Product {
    _id: string
    slug: string
    title: string
    price: number
    priceInUSD: number
    images: string[]
    sku: string[]
}

export interface Variant {
    quantity: number;
    color: string;
}

const CartVariantSelect = ({ product }: {
    product: Product
}) => {
    const { updateCartItem } = useCart();
    const [variants, setVariants] = useState<Variant[]>([
        { color: product?.sku[0]?.split('_').at(-1) || 'black', quantity: 1 }
    ]);

    const handleColorChange = (index: number, value: string) => {
        setVariants(prev =>
            prev.map((variant, i) =>
                i === index ? { ...variant, color: value } : variant
            )
        );
    };

    const handleQuantityChange = (index: number, value: number) => {
        setVariants(prev =>
            prev.map((variant, i) =>
                i === index ? { ...variant, quantity: Math.max(1, value) } : variant
            )
        );
    };

    const changeQuantity = (index: number, delta: number) => {
        setVariants(prev =>
            prev.map((variant, i) =>
                i === index
                    ? { ...variant, quantity: Math.max(1, variant.quantity + delta) }
                    : variant
            )
        );
    };

    const handleAddMoreVariant = () => {
        setVariants(prev => [
            ...prev,
            { color: product?.sku[0]?.split('_').at(-1) || 'black', quantity: 1 }
        ]);
    };

    const handleRemoveVariant = (index: number) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveChanges = async () => {
        const validVariants = variants.filter(v => v.quantity > 0);
        if (validVariants.length > 0) {
            await updateCartItem(product._id, validVariants);
        }
    };

    return (
        <SheetContent className="max-h-screen overflow-y-auto">
            <SheetHeader>
                <SheetTitle>Select Color Variants with Quantity</SheetTitle>
                <SheetDescription>
                    Here you can select the color variants and specify the quantity for each item in your cart.
                </SheetDescription>
            </SheetHeader>

            <div className='px-4'>
                <ImagesCarousal images={product.images} />

                {variants.map((variant, index) => (
                    <div
                        key={index}
                        className='mt-4 space-y-4 border p-4 rounded-xl relative'
                    >
                        {/* Remove variant button */}
                        {variants.length > 1 && (
                            <button
                                onClick={() => handleRemoveVariant(index)}
                                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Remove variant"
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                        )}

                        <div>
                            <Label className='mb-2'>Select Color</Label>
                            <Select
                                value={variant.color}
                                onValueChange={(value) => handleColorChange(index, value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a Color" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Colors</SelectLabel>
                                        {product.sku.map((el1) => {
                                            const color = el1?.split('_').at(-1) || 'black';
                                            return (
                                                <SelectItem
                                                    className='capitalize'
                                                    key={el1}
                                                    value={color}
                                                >
                                                    {color}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className='mb-2'>Pick Quantity</Label>
                            <div className='flex items-center gap-4'>
                                <button
                                    onClick={() => changeQuantity(index, -1)}
                                    className='border size-8 rounded-full flex items-center justify-center hover:bg-red-600 hover:border-none cursor-pointer hover:text-white select-none'
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <Input
                                    type='number'
                                    min={1}
                                    value={variant.quantity}
                                    onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                    className='w-full'
                                />
                                <button
                                    onClick={() => changeQuantity(index, 1)}
                                    className='border size-8 rounded-full flex items-center justify-center hover:bg-green-600 hover:border-none cursor-pointer hover:text-white select-none'
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <Button
                    onClick={handleAddMoreVariant}
                    className='w-full mt-4'
                    variant="outline"
                >
                    Add more Variant
                </Button>
            </div>
            <SheetFooter className="mt-4">
                <SheetClose asChild>
                    <Button
                        onClick={handleSaveChanges}
                        disabled={variants.length === 0 || variants.every(v => v.quantity <= 0)}
                    >
                        Save Changes
                    </Button>
                </SheetClose>
                <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                </SheetClose>
            </SheetFooter>
        </SheetContent>
    );
};

export default CartVariantSelect;