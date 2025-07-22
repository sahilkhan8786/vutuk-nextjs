'use client';

import { useCart } from '@/context/cart-context';
import type { CartItem } from '@/types/carts';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import Title from '@/components/ui/Title';
import WidthCard from '@/components/ui/WidthCard';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const CartsPage = () => {
    const { state, dispatch } = useCart();
    const [coupon, setCoupon] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    const activeItems = state.products.filter((p) => !p.isSavedForLater);
    const savedItems = state.products.filter((p) => p.isSavedForLater);

    const updateQuantity = (sku: string, delta: number): void => {
        const item = state.products.find((p) => p.sku === sku);
        const newQty = (item?.quantity || 0) + delta;

        if (!item) return;

        if (newQty <= 0) {
            handleRemove(sku, item);
        } else {
            dispatch({
                type: 'UPDATE_QUANTITY',
                payload: { sku, quantity: newQty },
            });
        }
    };

    const handleRemove = (sku: string, removedItem: CartItem): void => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { sku } });

        toast('Removed from cart', {
            description: 'Item removed',
            action: {
                label: 'Undo',
                onClick: () => {
                    dispatch({ type: 'ADD_TO_CART', payload: removedItem });
                },
            },
        });
    };

    const totalPrice = activeItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleApplyCoupon = () => {
        if (coupon.trim() === '') return;

        toast.success(`Coupon "${coupon}" applied`);
        setAppliedCoupon(coupon);
        setCoupon('');
    };

    const renderItems = (items: CartItem[], isSaved = false) =>
        items.map((item) => {
            const config =
                typeof item.productId === 'object' && 'configurations' in item.productId
                    ? item.productId.configurations?.find((c) => c.sku === item.sku)
                    : undefined;

            const imageSrc = config?.image ?? '/fallback.jpg';

            return (
                <WidthCard key={item.sku} className="grid gap-2 overflow-hidden mb-2">
                    <div className="border border-dark rounded-md p-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 px-4">
                        <div className="w-full sm:flex-1">
                            <div className="w-full sm:w-auto mb-2 sm:mb-4">
                                <Image
                                    src={imageSrc}
                                    alt="Product"
                                    width={500}
                                    height={300}
                                    className="w-full h-auto rounded-md object-cover"
                                />
                            </div>
                            <p className="text-sm font-medium sm:mt-0 mt-4">{item.productId.title.slice(0, 30)}...</p>
                        </div>

                        <div className="sm:flex-1 text-center">
                            <span className="block sm:hidden text-xs text-gray-500 mb-1">Price</span>
                            ₹{item.price}
                        </div>

                        <div className="sm:flex-1 flex flex-col items-center">
                            <span className="block sm:hidden text-xs text-gray-500 mb-1">Quantity</span>
                            {isSaved ? (
                                <span className="text-gray-500">Saved</span>
                            ) : (
                                <div className="flex items-center gap-2 justify-center border border-primary rounded-md py-1 px-2 w-fit">
                                    <button
                                        onClick={() => updateQuantity(item.sku, -1)}
                                        className="px-1 text-lg font-bold hover:text-red-500"
                                    >
                                        −
                                    </button>
                                    <span className="px-2">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.sku, 1)}
                                        className="px-1 text-lg font-bold hover:text-green-600"
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="sm:flex-1 text-center font-medium">
                            <span className="block sm:hidden text-xs text-gray-500 mb-1">Total</span>
                            ₹{item.price * (item.quantity ?? 1)}
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <Button
                                onClick={() =>
                                    dispatch({
                                        type: 'TOGGLE_SAVE_FOR_LATER',
                                        payload: { sku: item.sku },
                                    })
                                }
                                className="text-xs w-[150px]"
                            >
                                {isSaved ? 'Move to Cart' : 'Save for Later'}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleRemove(item.sku, item)}
                                className="text-xs w-[150px]"
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                </WidthCard>
            );
        });

    return (
        <WidthCard className="mt-24 min-h-[85vh] px-4 pb-40 sm:pb-0">
            <Title heading="My Cart" description="All the selected products are here" />

            {state.totalItem > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                    {/* Left side */}
                    <div className="lg:col-span-2">
                        {activeItems.length > 0 && (
                            <>
                                <h2 className="text-lg font-semibold mt-2">In Cart</h2>
                                <WidthCard className="hidden md:grid gap-2 overflow-hidden mb-2 mt-2">
                                    <div className="border border-dark rounded-md p-2 hidden sm:flex items-center justify-between px-4 font-semibold">
                                        <p className="flex-1 text-center">Image</p>
                                        <p className="flex-1 text-center">Price</p>
                                        <p className="flex-1 text-center">Quantity</p>
                                        <p className="flex-1 text-center">Total</p>
                                        <p className="flex-1 text-center">Actions</p>
                                    </div>
                                </WidthCard>
                                {renderItems(activeItems)}
                            </>
                        )}

                        {savedItems.length > 0 && (
                            <>
                                <h2 className="text-lg font-semibold mt-6">Saved for Later</h2>
                                <WidthCard className="hidden md:grid gap-2 overflow-hidden mb-2 mt-2">
                                    <div className="border border-dark rounded-md p-2 hidden sm:flex items-center justify-between px-4 font-semibold">
                                        <p className="flex-1 text-center">Image</p>
                                        <p className="flex-1 text-center">Price</p>
                                        <p className="flex-1 text-center">Quantity</p>
                                        <p className="flex-1 text-center">Total</p>
                                        <p className="flex-1 text-center">Actions</p>
                                    </div>
                                </WidthCard>
                                {renderItems(savedItems, true)}
                            </>
                        )}
                    </div>

                    {/* Right side summary */}
                    <div className="sticky top-28 h-fit bg-white border rounded-xl shadow p-6 hidden lg:block">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-3 text-sm">
                            {activeItems.map((item) => (
                                <div key={item.sku} className="flex justify-between items-center">
                                    <div>
                                        {item.productId.title.slice(0, 25)}... × {item.quantity}
                                    </div>
                                    <div className="font-medium">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <hr className="my-4" />

                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                        </div>

                        {/* Coupon */}
                        <div className="mt-4 space-y-2 border p-8 rounded-xl">
                            <h3>Add Coupons</h3>
                            <input
                                type="text"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                placeholder="Enter coupon code"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                            />
                            <Button onClick={handleApplyCoupon} className="w-full">
                                Apply Coupon
                            </Button>
                            {appliedCoupon && (
                                <p className="text-xs text-green-600">
                                    Applied: {appliedCoupon}
                                </p>
                            )}
                        </div>

                        <Button
                            onClick={() => dispatch({ type: 'CLEAR_CART' })}
                            className="mt-4 bg-red-600 hover:bg-red-800 w-full"
                        >
                            Clear Cart
                        </Button>

                        <Button className="mt-2 w-full">Order Now</Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center flex-col gap-6 mt-6">
                    <p className="text-center text-xl">Nothing to show here</p>
                    <Link
                        href="/"
                        className="border border-primary hover:text-light hover:bg-dark rounded-md px-4 py-2"
                    >
                        Go to our Products Page
                    </Link>
                </div>
            )}

            {/* Floating cart bar on mobile */}
            {activeItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300 px-4 py-3 lg:hidden shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Total: ₹{totalPrice.toFixed(2)}</p>
                        <Button className="text-sm px-4 py-2">Order Now</Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            placeholder="Coupon code"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
                        />
                        <Button
                            onClick={handleApplyCoupon}
                            className="text-sm px-3 py-1 whitespace-nowrap"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            )}
        </WidthCard>
    );
};

export default CartsPage;
