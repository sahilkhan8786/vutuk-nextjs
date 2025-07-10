'use client'

import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import WidthCard from '@/components/ui/WidthCard'
import HeartButton from '../shop/HeartButton'

interface Product {
    _id: string
    slug: string
    title: string
    price: number
    images: string[]
}

const LIMIT = 25

export default function InfiniteProducts({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState(initialProducts)
    const [page, setPage] = useState(2)
    const [hasMore, setHasMore] = useState(true)

    const fetchMore = async () => {
        const res = await fetch(`/api/products?page=${page}&limit=${LIMIT}`)
        const data = await res.json()
        const newProducts: Product[] = data.data.products

        setProducts(prev => {
            const ids = new Set(prev.map(p => p._id))
            const unique = newProducts.filter(p => !ids.has(p._id))
            return [...prev, ...unique]
        })

        if (newProducts.length < LIMIT) setHasMore(false)
        setPage(prev => prev + 1)
    }

    return (
        <InfiniteScroll
            dataLength={products.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={<p className="text-center my-4">Loading more...</p>}
            endMessage={<p className="text-center my-4">No more products.</p>}
        >
            <WidthCard className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(product => (
                    <div key={product._id} className='relative'>

                        <Link href={`/products/${product.slug}`} className="flex flex-col border rounded-xl p-4 ">
                            <div className='relative w-full h-[300px]'>

                                <Image
                                    src={product.images[0]}
                                    alt={product.title}
                                    fill
                                    className="rounded-xl absolute object-center object-cover"
                                />
                            </div>
                            <h3 className="text-sm font-semibold line-clamp-2 capitalize mt-2">{product.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">₹{product.price}</p>

                            <Button>Add To Cart</Button>
                        </Link>
                        <HeartButton
                            className='absolute right-6 top-6 z-50 '
                            itemId={product._id}
                            title={product.title}
                        />
                    </div>
                ))}
            </WidthCard>
        </InfiniteScroll>
    )
}
