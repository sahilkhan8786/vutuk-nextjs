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
    selectedKey: string | null
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    configurations,
    selectedImage,
    onImageSelect
}) => {
    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-96 rounded-lg overflow-hidden border">
                <Image
                    src={selectedImage}
                    alt="Selected product"
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto">
                {configurations.map((config) => {
                    const isActive = config.image === selectedImage
                    return (
                        <div
                            key={config.key}
                            className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer border ${isActive ? 'ring-2 ring-primary' : ''
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
        </div>
    )
}

export default ProductImageGallery
