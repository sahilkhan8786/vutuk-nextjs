'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import RemoveFromFavouriteButton from '@/components/custom/shop/RemoveFromFavouriteButton';
import AddToCartButton from '@/components/custom/shop/AddToCartButton';

type Configuration = {
    key: string;
    image: string;
    sku: string;
};

type Product = {
    _id: string;
    title: string;
    price: number;
    images: string[];
    sku: string;
    configurations?: Configuration[];
};

type Favourite = {
    _id: string;
    userId: string;
    products: Product[];
};

async function getFavourites() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/favourites`, {
        credentials: 'include',
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch favourites');
    }

    const json = await res.json();
    return json.data.favourites as Favourite[];
}

const UserFavouritesPage = () => {
    const [favourites, setFavourites] = useState<Favourite[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedConfigs, setSelectedConfigs] = useState<{ [productId: string]: string }>({});

    const refreshFavourites = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const products = await getFavourites();
            setFavourites(products);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load favourites');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshFavourites();
    }, []);

    const handleSelectConfig = (productId: string, key: string) => {
        setSelectedConfigs((prev) => ({
            ...prev,
            [productId]: key,
        }));
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading favourites...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (favourites.length === 0 || favourites[0]?.products.length === 0) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-4xl font-semibold uppercase bg-white rounded-xl p-4">Favourites</h1>
                <p className="mt-4">No favourites yet</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-4xl font-semibold uppercase bg-white rounded-xl p-4">Favourites</h1>

            {favourites.map((favourite) => (
                <div className="grid grid-cols-1 gap-4 bg-white mt-4 rounded-xl p-4 w-full" key={favourite._id}>
                    {favourite.products.map((product: Product) => {
                        const selectedKey = selectedConfigs[product._id] || product.configurations?.[0]?.key;
                        const selectedConfig = product.configurations?.find((conf) => conf.key === selectedKey);
                        const displayedImage = selectedConfig?.image || product.images?.[0] || '/fallback.jpg';

                        return (
                            <div
                                className="grid p-2 border rounded-xl gap-4 grid-cols-4 grid-rows-2 w-full max-w-[1536px] mx-auto"
                                key={product._id}
                            >
                                {/* Image */}
                                <div className="flex items-center justify-center col-span-4 sm:col-span-2 row-span-2 lg:col-span-1">
                                    <Image
                                        src={displayedImage}
                                        alt={product.title}
                                        width={250}
                                        height={250}
                                        className="rounded-xl object-cover"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="col-span-4 sm:col-span-2 sm:row-span-1 lg:col-span-2 lg:flex items-center lg:flex-col lg:row-span-2 lg:justify-center">
                                    <h2 className="text-lg font-medium">{product.title.slice(0, 30)}...</h2>
                                    <h2 className="text-sm text-muted-foreground">
                                        <strong>Price:&nbsp;</strong>₹{product.price}/-
                                    </h2>

                                    {/* Config Selector */}
                                    {Array.isArray(product.configurations) && product.configurations.length > 0 && (
                                        <div className="flex gap-2 mt-2">
                                            {product.configurations.map((conf) => (
                                                <button
                                                    key={conf.key}
                                                    onClick={() => handleSelectConfig(product._id, conf.key)}
                                                    className={`w-5 h-5 rounded-full border-2 transition-all duration-200 cursor-pointer ${selectedKey === conf.key ? 'border-black scale-110' : 'border-gray-300'
                                                        }`}
                                                    style={{ backgroundColor: conf.key.toLowerCase() }}
                                                    aria-label={conf.key}
                                                />
                                            ))}
                                        </div>
                                    )}

                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 items-center flex-col col-span-4 row-span-1 justify-center w-full sm:col-span-2 lg:col-span-1 lg:row-span-2 h-full">
                                    <RemoveFromFavouriteButton
                                        id={product._id}
                                        title={product.title}
                                        currentFavourites={favourite.products.map((p) => p._id)}
                                        onSuccess={(updatedFavourites) => {
                                            setFavourites((prev) =>
                                                prev.map((fav) => ({
                                                    ...fav,
                                                    products: fav.products.filter((p) => updatedFavourites.includes(p._id)),
                                                }))
                                            );
                                        }}
                                    />

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
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default UserFavouritesPage;
