'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';

// ================= Types =================
interface Product {
    _id: string;
    title: string;
    price: number;
    images: string[];
    sku: string[];
    slug: string;
    priceInUSD: number;
}

interface Favourite {
    _id: string;
    products: Product[];
}

const DashboardFavouritesPage: React.FC = () => {
    const [favourites, setFavourites] = useState<Favourite[]>([]);
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();

    const fetchFavourites = async () => {
        try {
            const res = await fetch('/api/favourites');
            const data = await res.json();
            setFavourites(data.data.favourites || []);
        } catch (error) {
            console.error('Failed to fetch favourites:', error);
        }
    };

    useEffect(() => {
        fetchFavourites();
    }, []);

    const handleRemoveFavourite = async (productId: string) => {
        setLoading(true);
        try {
            const updatedProducts = favourites[0].products.filter(p => p._id !== productId);
            await fetch('/api/favourites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProducts.map(p => p._id)),
            });
            toast.success('Removed from favourites');
            fetchFavourites();
        } catch (error) {
            console.error(error);
            toast.error("Error removing from favourites");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product: Product) => {
        try {
            // 1️⃣ Add to cart
            addToCart(product);

            // 2️⃣ Remove from favourites
            await handleRemoveFavourite(product._id);

            toast.success(`${product.title} added to cart and removed from favourites`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to add to cart');
        }
    };

    if (!favourites || favourites.length === 0 || favourites[0].products.length === 0)
        return <p className="p-4">No favourites found.</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-4">My Favourites</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favourites[0].products.map((product) => (
                    <div key={product._id} className="bg-white shadow rounded p-4 flex flex-col justify-between">
                        <Image
                            src={product.images[0]}
                            alt={product.title}
                            className="h-80 w-full object-cover rounded mb-2"
                            width={200} height={200}
                        />
                        <Link href={`/products/${product.slug}`}>
                            <h2 className="font-base hover:underline">{product.title}</h2>
                        </Link>
                        <div className="flex gap-2 mt-4">
                            <Button
                                variant="secondary"
                                onClick={() => handleRemoveFavourite(product._id)}
                                className='hover:cursor-pointer'
                                disabled={loading}
                            >
                                Remove
                            </Button>
                            <Button
                                onClick={() => handleAddToCart(product)}
                                className='hover:cursor-pointer'
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardFavouritesPage;
