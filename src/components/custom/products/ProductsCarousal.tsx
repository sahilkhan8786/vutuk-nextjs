'use client'

type Product = {
    _id: string
    title: string
    price: string
    slug: string
    images: string[]
}

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

const ProductsCarousel = () => {
    const [products, setProducts] = useState<[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?fields=title,price,images`)
                const json = await res.json()
                console.log(json)
                setProducts(json.data.products)
            } catch (err) {
                console.error('Failed to fetch products:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) {
        return <div className="py-10 text-center">Loading products...</div>
    }

    return (
        <Carousel
            orientation="horizontal"
            className='w-full overflow-hidden'
            opts={{
                align: 'center',
            }}
            plugins={[
                Autoplay({
                    delay: 5000,
                }),
            ]}
        >
            <div className='max-w-[1380px] mx-auto'>

                <CarouselContent >
                    {products.map((product: Product) => (
                        <CarouselItem

                            key={product._id}
                            className="transition-all duration-500 ease-in-out flex flex-col items-center justify-start gap-2 basis-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
                        >
                            <Link href={`/products/${product.slug}`} className="w-full">
                                <div className="relative w-full min-h-54 rounded-xl overflow-hidden shadow-md">
                                    <Image
                                        src={product.images?.[0]}
                                        alt={product.title}
                                        fill
                                        className="object-cover rounded-xl transition-all duration-500"
                                        priority
                                    />
                                </div>
                            </Link>
                            <Link href={`/products/${product.slug}`} className="w-full">
                                <h3 className="text-center text-sm font-semibold line-clamp-3 hover:underline">
                                    {product.title}
                                </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">₹{product.price}</p>
                            <Button>Add To Cart</Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </div>

            <div className="w-full flex items-center justify-between -mt-4 absolute gap-8  top-1/2 -translate-y-1/2">
                <CarouselPrevious className="bg-primary text-light hover:border border-primary" />
                <CarouselNext className="bg-primary text-light hover:border border-primary" />
            </div>
        </Carousel>
    )
}

export default ProductsCarousel
