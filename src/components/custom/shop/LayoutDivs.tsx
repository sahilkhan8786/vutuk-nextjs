'use client'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'

import React, { useEffect, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import HeartButton from './HeartButton'
import AddToCartButton from './AddToCartButton'
import ImagesCarousal from './ImagesCarousal'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

interface Product {
    _id: string
    slug: string
    title: string
    price: number
    priceInUSD: number
    images: string[]
    sku: string[]
}

interface CarousalDivHomePageProps {
    title: string
    className?: string
    innerDivHeight?: string
    carousalBasis?: string
    delay?: number
}

export const CarousalDivHomePage: React.FC<CarousalDivHomePageProps> = ({

    title,
    className,
    innerDivHeight,
    carousalBasis = "",
    delay
}) => {

    const [products, setProducts] = useState<Product[] | []>([]);

    useEffect(() => {
        async function fetchProducts() {
            const productsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?random=true`, {
                method: "GET",
                credentials: "include"
            })
            const json = await productsRes.json()
            const { products } = json.data
            setProducts(products || [])
        }
        fetchProducts();
    }, [])



    return (
        <div className={`w-full border-primary rounded-xl p-4 flex flex-col overflow-hidden ${className} bg-white shadow`}>
            <h2 className="text-left font-thin text-2xl mb-4 font-rubik">{title}</h2>

            <Carousel
                orientation="horizontal"
                className="w-full relative flex"
                opts={{ align: 'center' }}
                plugins={[
                    Autoplay({
                        delay: delay,
                        stopOnMouseEnter: true,
                        stopOnFocusIn: true,
                        stopOnInteraction: true
                    }),
                ]}
            >
                <CarouselContent className="w-full">
                    {products?.map((product) => {

                        const productId = product._id


                        return (
                            <CarouselItem
                                key={productId}
                                className={`transition-all duration-500 ease-in-out flex flex-col items-center justify-start gap-2 relative ${carousalBasis}`}
                            >
                                <Link href={`/products/${product.slug}`} className="w-full">
                                    <div className={`w-full rounded-xl shadow-md ${innerDivHeight} relative`}>
                                        {/* <ImagesCarousal images={product.images as []} /> */}
                                        <div

                                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out 
                                                }`}
                                        >
                                            <Skeleton
                                                className="w-full h-full bg-primary/45"
                                            />
                                            <Image
                                                src={product.images[0]}
                                                alt={`Image  ${product.title}`}
                                                fill
                                                sizes="100vw"
                                                className="object-cover object-center rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </Link>

                                <Link href={`/products/${product.slug}`} className="w-full">
                                    <h3 className="text-center text-sm font-semibold line-clamp-2 hover:underline capitalize">
                                        {product.title}
                                    </h3>
                                </Link>

                                <HeartButton className="absolute right-2 top-2" itemId={productId} title={product.title} />


                                {product.price && <p className="text-sm text-muted-foreground mb-2">₹&nbsp;{product.price}
                                </p>}
                                {product.priceInUSD ? <p className="text-sm text-muted-foreground mb-2">$&nbsp; {product.priceInUSD}
                                </p> : ''}

                                <AddToCartButton
                                    product={{
                                        _id: product._id,
                                        title: product.title,
                                        price: product.price,
                                        images: product.images,
                                        sku: product.sku
                                    }}
                                    quantity={1}
                                />


                            </CarouselItem>
                        )
                    })}
                </CarouselContent>

                <div className="w-full flex items-center justify-between absolute top-1/2 -translate-y-1/2 gap-8">
                    <CarouselPrevious className="bg-light text-primary hover:border border-light" />
                    <CarouselNext className="bg-light text-primary hover:border border-light" />
                </div>
            </Carousel>
        </div>
    )
}
export const ProductOnDemand3DDiv = ({ className }: {
    className?: string
}) => {
    return (
        <div className={`w-full bg-white border-primary rounded-xl p-4 flex flex-col gap-6 overflow-hidden  shadow ${className}`}>
            <h2 className="text-center font-semibold text-4xl font-bebas">
                3D Product On Demand
            </h2>

            <p className='text-slate-700 text-center max-w-3xl mx-auto'>
                Got a custom idea or part you need brought to life? Our <strong>3D printing service</strong> allows you to request fully customized physical models, prototypes, parts, or artistic designs—all made using our high-quality in-house 3D printer.
            </p>

            <ul className='text-slate-600 text-sm list-disc pl-6 max-w-3xl mx-auto space-y-2'>
                <li>Upload your own 3D model (.STL, .OBJ, etc.)</li>
                <li>Choose your preferred material & color</li>
                <li>Specify dimensions and other requirements</li>
                <li>Get it printed and delivered to your doorstep</li>
            </ul>

            <p className='text-slate-700 text-center max-w-4xl mx-auto'>
                Ideal for <em>engineers, students, designers, or hobbyists</em>—we print everything from miniature models, gadget parts, custom keychains, mechanical components to artistic sculptures. Quality guaranteed.
            </p>

            <Link href={'/request/custom-3d-print-on-demand'} className="text-center">
                <Button size="lg" className="mt-2">
                    Request a Custom 3D Print
                </Button>
            </Link>

            {/* <AnimatedImageSequence /> */}
        </div>
    )
}
