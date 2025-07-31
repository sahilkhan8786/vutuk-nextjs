'use client';

import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link';
import Image from 'next/image';
import WidthCard from '@/components/ui/WidthCard';
import HeartButton from '../shop/HeartButton';
import AddToCartButton from '../shop/AddToCartButton';

interface Configuration {
    key: string;
    image: string;
    sku: string;
}

interface Product {
    _id: string;
    slug: string;
    title: string;
    price: number;
    priceInUSD: number;
    images: string[];
    sku: string;
    configurations?: Configuration[];
}

const LIMIT = 25;

export default function InfiniteProducts({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);

    const [selectedConfigs, setSelectedConfigs] = useState<{ [productId: string]: string }>({});

    const fetchMore = async () => {
        const res = await fetch(`/api/products?page=${page}&limit=${LIMIT}`);
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

    const handleConfigSelect = (productId: string, configKey: string) => {
        setSelectedConfigs((prev) => ({
            ...prev,
            [productId]: configKey,
        }));
    };

    return (
        <InfiniteScroll
            dataLength={products.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={<p className="text-center my-4">Loading more...</p>}
            endMessage={<p className="text-center my-4">No more products.</p>}
        >
            <WidthCard className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => {
                    const selectedKey = selectedConfigs[product._id] || product.configurations?.[0]?.key;
                    const selectedConfig = product.configurations?.find(conf => conf.key === selectedKey);

                    const displayImage = selectedConfig?.image || product.images?.[0] || '/fallback.jpg';

                    return (
                        <div key={product._id} className="relative flex flex-col border rounded-xl p-4">
                            <Link href={`/products/${product.slug}`}>
                                <div className="relative w-full h-[300px]">
                                    <Image
                                        src={displayImage}
                                        alt={product.title}
                                        fill
                                        className="rounded-xl absolute object-center object-cover"
                                    />
                                </div>
                                <h3 className="text-sm font-semibold line-clamp-2 capitalize mt-2 hover:underline">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">₹{product.price ? product.price : product.priceInUSD}</p>
                            </Link>

                            {/* Color Dots */}
                            {Array.isArray(product.configurations) && product.configurations.length > 0 && (
                                <div className="flex gap-2 mb-2">
                                    {product.configurations.map((conf) => (
                                        <button
                                            key={conf.key}
                                            onClick={() => handleConfigSelect(product._id, conf.key)}
                                            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 cursor-pointer  ${selectedKey === conf.key ? 'border-gray-400 scale-110' : 'border-gray-300'
                                                }`}
                                            style={{ backgroundColor: conf.key.toLowerCase() }}
                                            aria-label={conf.key}
                                        />
                                    ))}
                                </div>
                            )}


                            {selectedConfig && (
                                <AddToCartButton
                                    product={{
                                        _id: product._id,
                                        title: product.title,
                                        price: product.price,
                                        images: product.images,
                                        configurations: product.configurations || [],
                                    }}
                                    selectedConfig={selectedConfig}
                                    quantity={1}
                                />
                            )}

                            <HeartButton
                                className="absolute right-6 top-6"
                                itemId={product._id}
                                title={product.title}
                            />
                        </div>
                    );
                })}
            </WidthCard>
        </InfiniteScroll>
    );
}
