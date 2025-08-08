'use client'

import Image from 'next/image'
import React, { useState, useMemo } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselApi
} from "@/components/ui/carousel"

interface ProductImageGalleryProps {
    images: string[],
    sizeImages?: string[]
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    images, sizeImages
}) => {
    // Merge without duplicates
    const allImages = useMemo(() => {
        return [...images, ...(sizeImages || [])].filter(
            (value, index, self) => self.indexOf(value) === index
        )
    }, [images, sizeImages])

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

    const onImageSelect = (index: number) => {
        setSelectedIndex(index)
        carouselApi?.scrollTo(index) // Jump carousel to the clicked image
    }

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3">
                {allImages.map((image, index) => {
                    const isActive = index === selectedIndex
                    return (
                        <div
                            key={image}
                            className={`relative size-16 rounded-md overflow-hidden cursor-pointer border transition-all duration-200 ${isActive ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => onImageSelect(index)}
                        >
                            <Image
                                src={image}
                                alt={`Thumbnail for ${image}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )
                })}
            </div>

            {/* Main Carousel */}
            <div className="w-full overflow-hidden  rounded-xl flex items-center justify-center">
                <Carousel className="w-full relative" setApi={setCarouselApi}>
                    <CarouselContent isMargin={false}>
                        {allImages.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1 flex justify-center">
                                    <Image
                                        src={image}
                                        alt="Selected product"
                                        width={768}
                                        height={768}
                                        className="object-contain transition-transform duration-300 ease-in-out"
                                        sizes="(max-width: 768px) 75vw, 80vw"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute" />
                    <CarouselNext className="absolute" />
                </Carousel>
            </div>
        </div>
    )
}

export default ProductImageGallery
