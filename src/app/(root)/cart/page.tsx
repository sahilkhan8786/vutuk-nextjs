'use client';
import CheckoutContainer from '@/components/custom/clients/CheckoutContainer';
import CartVariantSelectWrapper from '@/components/custom/shop/CartVariantSelectWrapper';
import ImagesCarousal from '@/components/custom/shop/ImagesCarousal';
import { Button } from '@/components/ui/button';
import Title from '@/components/ui/Title';
import WidthCard from '@/components/ui/WidthCard';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';
import React from 'react';

export interface Product {
    _id: string;
    slug: string;
    title: string;
    price: number;
    priceInUSD: number;
    images: string[];
    sku: string[];
}

const CartsPage = () => {
    const { cart, removeFromCart } = useCart();

    const calculateItemTotal = (price: number, variants: { quantity: number }[] = []) => {
        const totalQuantity = variants.reduce((sum, v) => sum + v.quantity, 0);
        return (price * totalQuantity).toFixed(2);
    };

    return (
        <div className='mt-20 md:mt-24 min-h-[85vh] relative'>
            <Title heading='My Cart' description='' />
            {cart.length > 0 ? (
                <WidthCard className='flex flex-col lg:flex-row'>
                    <div className='grid gap-4 my-8 px-2 w-full lg:flex-[5]'>
                        {cart.map((el, index) => (
                            <div key={index} className='border w-full rounded-xl p-4 flex gap-4 relative'>
                                <div className='w-32 sm:w-48 flex-shrink-0'>
                                    <ImagesCarousal images={el.product.images || []} />
                                </div>
                                <div className='flex-1 space-y-3'>


                                    {/* Title */}
                                    <Link href={`/products/${el.product._id}`}>
                                        <h3 className='text-lg font-medium hover:underline'>
                                            {el.product.title}
                                        </h3>
                                    </Link>

                                    {/* Price */}
                                    <div className='flex items-baseline gap-2'>
                                        <p className='text-xl font-semibold'>
                                            ₹{calculateItemTotal(el.product.price, el.variants)}/-
                                        </p>
                                        {el.variants && el.variants.reduce((sum, v) => sum + v.quantity, 0) > 1 && (
                                            <span className='text-sm text-muted-foreground'>
                                                (₹{el.product.price.toFixed(2)} each)
                                            </span>
                                        )}
                                    </div>

                                    {/* Variants */}
                                    {el.variants && el.variants.length > 0 && (
                                        <div className='mt-2'>
                                            <p className='text-sm font-medium'>Selected Variants:</p>
                                            <ul className='space-y-1 mt-1'>
                                                {el.variants.map((variant, idx) => (
                                                    <li key={idx} className='flex items-center gap-2'>
                                                        <span className='inline-block h-4 w-4 rounded-full border'
                                                            style={{ backgroundColor: variant.color.toLowerCase() === 'black' ? '#000' : variant.color }} />
                                                        <span className='text-sm capitalize'>
                                                            {variant.color} × {variant.quantity}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Edit button */}
                                    <div className='pt-2'>
                                        <CartVariantSelectWrapper product={el.product as Product} />
                                    </div>

                                    {/* Remove button */}
                                    <Button variant={'link'}
                                        onClick={() => removeFromCart(el.product._id)}
                                        className=" p-1 rounded-full hover:bg-gray-100 transition-colors text-muted-foreground cursor-pointer"
                                        aria-label="Remove item"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='lg:flex-[2] sticky top-[100px] right-0 h-fit z-40 my-8 rounded-xl overflow-hidden'>
                        <CheckoutContainer />
                    </div>
                </WidthCard>
            ) : (
                <div className='min-h-[80vh] flex items-center justify-center'>
                    <div className='text-center space-y-4'>
                        <h3 className='text-2xl font-medium'>Your cart is empty</h3>
                        <p className='text-muted-foreground'>Looks like you have&apos;t added anything to your cart yet</p>
                        <Link href={'/'}>
                            <Button className='mt-4'>Continue Shopping</Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartsPage;