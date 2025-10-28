'use client';

import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link';
import WidthCard from '@/components/ui/WidthCard';
import HeartButton from '../shop/HeartButton';
import AddToCartButton from '../shop/AddToCartButton';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export type Product = {
    _id: string;
    slug: string;
    title: string;
    price?: number;
    priceInUSD?: number;
    images: string[];
    sku: string[];
};


const LIMIT = 25;

export default function InfiniteProducts({ initialProducts }: { initialProducts: Product[] }) {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);

    // Construct query string from URL params
    const buildQueryString = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        params.set('limit', LIMIT.toString());
        return params.toString();
    }, [searchParams]);

    const fetchMore = async () => {
        const query = buildQueryString(page);
        const res = await fetch(`/api/products?${query}`);
        const data = await res.json();
        const newProducts: Product[] = data.data.products;

        setProducts((prev) => {
            const ids = new Set(prev.map((p) => p._id));
            const unique = newProducts.filter((p) => !ids.has(p._id));
            return [...prev, ...unique];
        });

        if (newProducts.length < LIMIT) setHasMore(false);
        setPage((prev) => prev + 1);
    };

    // Reset products if search params change
    useEffect(() => {
        const resetProducts = async () => {
            const query = buildQueryString(1);
            const res = await fetch(`/api/products?${query}`);
            const data = await res.json();
            setProducts(data.data.products);
            setPage(2);
            setHasMore(true);
        };
        resetProducts();
    }, [searchParams, buildQueryString]);

    return (
        <InfiniteScroll
            dataLength={products.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={<p className="text-center my-4">Loading more...</p>}
            endMessage={<p className="text-center my-4">No more products.</p>}
        >
            <WidthCard className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                    <div key={product._id} className="relative flex flex-col border rounded-xl p-4">
                        <Link href={`/products/${product.slug}`} className="w-full">
                            <div className="w-full rounded-xl shadow-md min-h-64 relative">
                                <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
                                    <Skeleton className="w-full h-full bg-primary/45" />
                                    <Image
                                        src={product.images[0]}
                                        alt={product.title}
                                        fill
                                        sizes="100vw"
                                        className="object-cover object-center rounded-xl"
                                    />
                                </div>
                            </div>

                            <h3 className="text-sm font-semibold line-clamp-2 capitalize mt-2 hover:underline">
                                {product.title}
                            </h3>
                            {product.price && <p className="text-sm text-muted-foreground mb-2">₹ {product.price}</p>}
                            {product.priceInUSD && <p className="text-sm text-muted-foreground mb-2">$ {product.priceInUSD}</p>}
                        </Link>

                        <AddToCartButton
                            product={{
                                _id: product._id,
                                slug: product.slug, // ✅ added
                                title: product.title,
                                price: product.price || product.priceInUSD || 0,
                                priceInUSD: product.priceInUSD || 0, // ✅ added
                                images: product.images,
                                sku: product.sku,
                            }}
                            quantity={1}
                        />


                        <HeartButton className="absolute right-6 top-6" itemId={product._id} title={product.title} />
                    </div>
                ))}
            </WidthCard>
        </InfiniteScroll>
    );
}
