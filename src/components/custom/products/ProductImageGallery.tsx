'use client'

import Image from 'next/image'
import React from 'react'

interface Configuration {
    key: string
    image: string
    sku: string
}

interface ProductImageGalleryProps {
    configurations: Configuration[]
    selectedImage: string
    onImageSelect: (img: string) => void
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    configurations,
    selectedImage,
    onImageSelect
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnails on the left */}
            <div className="flex md:flex-col gap-3 ">
                {configurations.map((config) => {
                    const isActive = config.image === selectedImage
                    return (
                        <div
                            key={config.key}
                            className={`relative size-16 rounded-md overflow-hidden cursor-pointer border transition-all duration-200 ${isActive ? 'ring-2 ring-primary' : ''
                                }`}
                            onClick={() => onImageSelect(config.image)}
                        >
                            <Image
                                src={config.image}
                                alt={`Thumbnail for ${config.key}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )
                })}
            </div>

            {/* Main Image */}
            <div className="relative w-full aspect-square overflow-hidden border rounded-lg group">
                <Image
                    src={selectedImage}
                    alt="Selected product"
                    fill
                    className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 80vw"
                />
            </div>
        </div>
    )
}

export default ProductImageGallery
