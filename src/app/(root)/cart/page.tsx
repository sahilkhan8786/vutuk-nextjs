'use client';

import CheckoutContainer from '@/components/custom/clients/CheckoutContainer';
import ImagesCarousal from '@/components/custom/shop/ImagesCarousal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Title from '@/components/ui/Title';
import WidthCard from '@/components/ui/WidthCard';
import { useCart } from '@/context/cart-context'

import Link from 'next/link';
import React, { useState } from 'react'

const CartsPage = () => {
    const { cart } = useCart();
    console.log(cart)

    const [quantities, setQuantities] = useState(
        [0]
    );

    const handleQuantityChange = (index: number, value: string) => {
        const newQuantities = [...quantities];
        newQuantities[index] = Number(value);
        setQuantities(newQuantities);
    };

    return (
        <div className='mt-20 md:mt-24 min-h-[85vh] relative'>

            <Title
                heading='My Cart'
                description=''
            />
            {
                cart.length > 0
                    ? (
                        <WidthCard className='flex '>
                            <div className='grid gap-4 my-8 px-2 w-full xl:flex-[5]'>
                                {cart.map((el, index) => (
                                    <div key={index} className=' border w-full rounded-xl p-2 flex gap-4 '>
                                        <div className='w-32 sm:w-48 flex-1 '>
                                            <ImagesCarousal images={el.product.images || []} />
                                        </div>
                                        <div className='flex-1 space-y-4'>
                                            {/* PRICE */}
                                            <p className='text-xl md:text-3xl md:font-semibold'>{el.product.price.toFixed(2)}/-</p>
                                            {/* TITLE */}
                                            <Link href={`/products/${el.product._id}`}>
                                                <p className=''>
                                                    {el.product.title.slice(0, 40)}...
                                                </p>
                                            </Link>
                                            {/* SELECT COLOR */}
                                            <p className='mt-4'>

                                                <Label className='mb-2'>Select Color</Label>
                                                <Select >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a Color" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Colors</SelectLabel>
                                                            {el.product.sku.map(el1 => (
                                                                <SelectItem className='capitalize' key={el1} value={el1?.split('_').at(-1) || "black"}>{el1?.split('_').at(-1)}</SelectItem>

                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </p>
                                            {/* SELECT QUANTITY */}
                                            <p className='mt-4'>

                                                <Label className='mb-2'>Select Quantity</Label>
                                                <Select
                                                    value={String(quantities[index])}
                                                    onValueChange={(value) => handleQuantityChange(index, value)}
                                                >
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder="Select Quantity" />
                                                    </SelectTrigger>
                                                    <SelectContent >
                                                        <SelectGroup >
                                                            <SelectLabel>Colors</SelectLabel>
                                                            {Array.from({ length: 21 }, (_, i) => (
                                                                <SelectItem key={i} value={String(i)} >
                                                                    {i}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </p>
                                            <p>
                                                <Button className='w-full'>Save For Later</Button>
                                            </p>


                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='xl:flex-[2] sticky top-[100px] right-0   h-fit z-40 my-8 rounded-xl overflow-hidden '>
                                <CheckoutContainer />
                            </div>
                        </WidthCard>
                    )
                    : (
                        <div className='min-h-[80vh]'>

                            <div className='flex items-center justify-center my-8 flex-col gap-2'>
                                <p className='font-medium text-xl capitalize'>Nothing to show here, Yet</p>
                                <Link href={'/'}>
                                    <Button variant={'outline'}>Go To Shop</Button>
                                </Link>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default CartsPage