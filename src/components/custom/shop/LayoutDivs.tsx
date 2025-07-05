'use client'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React from 'react'
import Autoplay from "embla-carousel-autoplay"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Product {
    _id: string
    slug: string
    title: string
    price: number
    images: string[]
}

interface FirstDivProps {
    products: Product[]
}

export const FirstDiv = ({ products }: FirstDivProps) => {
    return (
        <div className="w-full border border-primary rounded-xl col-span-1 row-span-4 p-4 flex flex-col overflow-hidden">
            <h2 className="text-center font-medium text-xl mb-4">New Arrivals</h2>


            <Carousel
                orientation="horizontal"
                className="w-full"
                opts={{
                    align: 'center',
                }}
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
            >
                <CarouselContent>
                    {products.map((product) => (
                        <CarouselItem
                            key={product._id}
                            className="transition-all duration-500 ease-in-out flex flex-col items-center justify-start gap-2"
                        >
                            <Link href={`/products/${product.slug}`} className='w-full'>
                                <div className="relative w-full min-h-96 rounded-xl overflow-hidden shadow-md">
                                    <Image
                                        src={product.images?.[0]}
                                        alt={product.title}
                                        fill
                                        className="object-cover rounded-xl transition-all duration-500"
                                    />
                                </div>
                            </Link>
                            <Link href={`/products/${product.slug}`} className='w-full'>
                                <h3 className="text-center text-sm font-semibold line-clamp-2 hover:underline">
                                    {product.title}
                                </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">₹{product.price}</p>
                            <Button>Add To Cart</Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation buttons below the carousel */}

                <div className='    w-full flex items-center justify-between -mt-4 relative gap-8'>

                    <CarouselPrevious className='  bg-primary text-light hover:border border-primary' />
                    <CarouselNext className='  bg-primary text-light hover:border border-primary' />
                </div>

            </Carousel>
        </div>
    )
}
