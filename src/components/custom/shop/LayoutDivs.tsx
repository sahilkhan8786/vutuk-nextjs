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
import Autoplay from 'embla-carousel-autoplay'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Product {
    _id: string
    slug: string
    title: string
    price: number
    images: string[]
}

interface CarousalDivHomePageProps {
    products: Product[]
    title: string
    className?: string
    innerDivHeight?: string
    carousalBasis?: string
    delay?: number
}

export const CarousalDivHomePage: React.FC<CarousalDivHomePageProps> = ({ products, title, className, innerDivHeight, carousalBasis = "", delay }) => {
    return (
        <div className={`w-full border border-primary rounded-xl  p-4 flex flex-col overflow-hidden ${className}`}>
            <h2 className="text-center font-semibold text-4xl mb-4 font-bebas">{title}</h2>

            <Carousel
                orientation="horizontal"
                className="w-full"
                opts={{
                    align: 'center',
                }}
                plugins={[
                    Autoplay({
                        delay: delay,
                    }),
                ]}
            >
                <CarouselContent className='w-full '>
                    {products?.map((product) => (
                        <CarouselItem
                            key={product._id}
                            className={`transition-all duration-500 ease-in-out flex flex-col items-center justify-start gap-2 ${carousalBasis}`}
                        >
                            <Link href={`/products/${product.slug}`} className="w-full">
                                <div className={`w-full rounded-xl overflow-hidden shadow-md ${innerDivHeight}`}>
                                    <Image
                                        src={product.images?.[0]}
                                        alt={product.title}
                                        width={500}
                                        height={400}
                                        className="object-cover rounded-xl transition-all duration-500"
                                    />
                                </div>
                            </Link>
                            <Link href={`/products/${product.slug}`} className="w-full">
                                <h3 className="text-center text-sm font-semibold line-clamp-2 hover:underline">
                                    {product.title}
                                </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">₹{product.price}</p>
                            <Button>Add To Cart</Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <div className="w-full flex items-center justify-between -mt-4 relative gap-8">
                    <CarouselPrevious className="bg-primary text-light hover:border border-primary" />
                    <CarouselNext className="bg-primary text-light hover:border border-primary" />
                </div>
            </Carousel>
        </div>
    )
}

export const ProductOnDemand3DDiv = () => {
    return (
        <div className='w-full border border-primary rounded-xl p-4 flex flex-col gap-6 overflow-hidden sm:col-span-1 lg:col-span-3 row-span-2'>
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
        </div>
    )
}
