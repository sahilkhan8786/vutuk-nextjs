'use client';

import { useCart } from '@/context/cart-context';
import type { CartItem } from '@/types/carts';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import Title from '@/components/ui/Title';
import WidthCard from '@/components/ui/WidthCard';
import { Button } from '@/components/ui/button';

const CartsPage = () => {
    const { state, dispatch } = useCart();

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

    const totalPrice: number = state.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="mt-24 min-h-[85vh]">
            <Title heading="My Cart" description="All the selected products are here" />

            {state.totalItem > 0 ? (
                <>
                    <WidthCard className="grid gap-2 overflow-hidden mb-2 mt-6">
                        <div className="border border-dark rounded-md p-2 flex items-center justify-between px-4 font-semibold">
                            <p className="flex-1">Image</p>
                            <p className="flex-1">Price</p>
                            <p className="flex-1">Quantity</p>
                            <p className="flex-1">Total</p>
                        </div>
                    </WidthCard>

                    {state.products.map((item) => {
                        const config =
                            typeof item.productId === 'object' && 'configurations' in item.productId
                                ? item.productId.configurations?.find((c) => c.sku === item.sku)
                                : undefined;

                        const imageSrc = config?.image ?? '/fallback.jpg';

                        return (
                            <WidthCard key={item.sku} className="grid gap-2 overflow-hidden mb-2">
                                <div className="border border-dark rounded-md p-2 flex items-center justify-between px-4">
                                    <div className="flex-1">
                                        <Image
                                            src={imageSrc}
                                            alt="Product"
                                            width={80}
                                            height={80}
                                            className="rounded-md object-cover"
                                        />
                                    </div>
                                    <p className="flex-1">₹{item.price}</p>
                                    <div className="flex-1">
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
                                    </div>
                                    <p className="flex-1">₹{item.price * item.quantity}</p>
                                </div>
                            </WidthCard>
                        );
                    })}

                    <div className="text-center mt-6">
                        <p className="text-xl font-semibold">Total Price: ₹{totalPrice.toFixed(2)}</p>
                        <Button
                            onClick={() => dispatch({ type: 'CLEAR_CART' })}
                            className="mt-4 bg-red-600 hover:bg-red-800"
                        >
                            Clear Cart
                        </Button>
                    </div>
                </>
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
        </div>
    );
};

export default CartsPage;
