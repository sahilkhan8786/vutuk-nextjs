'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import WidthCard from '@/components/ui/WidthCard'
import ProductImageGallery from './ProductImageGallery'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProductCarusalContainer from './ProductCarusalContainer'

interface Configuration {
    key: string
    image: string
    sku: string
}

interface Product {
    _id: string
    title: string
    description: string
    price: number
    configurations: Configuration[]
    quantity: number
}

const ProductClient = ({ product }: { product: Product }) => {
    const [selectedKey, setSelectedKey] = useState<string>(product.configurations[0]?.key)

    const selectedConfig = product.configurations.find((c) => c.key === selectedKey)!
    const selectedImage = selectedConfig.image

    const handleColorSelect = (key: string) => {
        setSelectedKey(key)
    }

    const handleThumbnailClick = (img: string) => {
        const config = product.configurations.find((c) => c.image === img)
        if (config) {
            setSelectedKey(config.key)
        }
    }

    return (
        <div className="mt-24 ">
            <WidthCard className='min-h-screen pt-12'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Images */}
                    <ProductImageGallery
                        configurations={product.configurations}
                        selectedImage={selectedImage}
                        onImageSelect={handleThumbnailClick}

                    />

                    {/* Info */}
                    <div className="space-y-5">
                        <h1 className="text-2xl font-bold">{product.title}</h1>
                        <p className="text-muted-foreground whitespace-pre-wrap text-sm">{product.description}</p>
                        <p className="text-xl font-semibold text-primary">₹{product.price}</p>

                        {/* Color Configurations */}
                        <div className="space-y-2">
                            <label className="font-medium block">Select Color:</label>
                            <Select value={selectedKey} onValueChange={(value) => handleColorSelect(value)}>
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
                                defaultValue={1}
                                className="w-20 border rounded px-2 py-1"
                            />
                            <Button>Add to Cart</Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Available stock: {product.quantity}
                        </p>
                    </div>
                </div>
            </WidthCard>

            <ProductCarusalContainer
                title='Featured Products'
            />
            <ProductCarusalContainer
                title='Similar Products'
            />
            <ProductCarusalContainer
                title='Similar Categories'
            />

        </div>
    )
}

export default ProductClient
