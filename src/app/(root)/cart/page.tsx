'use client';

import Title from '@/components/ui/Title';
import WidthCard from '@/components/ui/WidthCard';
import { useCart } from '@/context/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const CartsPage = () => {
    const { state, dispatch } = useCart();

    const updateQuantity = (sku: string, delta: number) => {
        const item = state.products.find((p) => p.sku === sku);
        const newQty = (item?.quantity || 0) + delta;
        if (newQty <= 0) {
            dispatch({ type: 'REMOVE_FROM_CART', payload: { sku } });
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { sku, quantity: newQty } });
        }
    };

    return (
        <div className='mt-24 min-h-[85vh]'>
            <Title
                heading='My Cart'
                description='All the selected products are here'
            />
            {state.totalItem > 0 ? (
                <>
                    <WidthCard className='grid gap-2 overflow-hidden mb-2 mt-6'>
                        <div className='border border-dark rounded-md p-2 flex items-center justify-between px-4 font-semibold'>
                            <p className='flex-1'>Image</p>
                            <p className='flex-1'>Price</p>
                            <p className='flex-1'>Quantity</p>
                            <p className='flex-1'>Total</p>
                        </div>
                    </WidthCard>

                    {/* Products */}
                    {state.products.map((item) => (
                        <WidthCard key={item.sku} className='grid gap-2 overflow-hidden mb-2'>
                            <div className='border border-dark rounded-md p-2 flex items-center justify-between px-4'>
                                <div className='flex-1'>
                                    <Image
                                        src={'https://i.etsystatic.com/59876780/r/il/05509a/6919495302/il_fullxfull.6919495302_fhwb.jpg'}
                                        alt={'Product'}
                                        width={80}
                                        height={80}
                                        className='rounded-md object-cover'
                                    />
                                </div>
                                <p className='flex-1'>₹999</p>
                                <div className='flex-1'>

                                    <div className='flex items-center gap-2  justify-center border border-primary rounded-md py-1 px-2 w-fit'>
                                        <button
                                            onClick={() => updateQuantity(item.sku, -1)}
                                            className='px-1 text-lg font-bold hover:text-red-500'
                                        >
                                            −
                                        </button>
                                        <span className='px-2'>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.sku, 1)}
                                            className='px-1 text-lg font-bold hover:text-green-600'
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <p className='flex-1'>₹650</p>
                            </div>
                        </WidthCard>
                    ))}
                </>
            ) :
                (<div className='flex items-center flex-col gap-6 mt-6'>

                    <p className='text-center text-xl'>Nothing to show here</p>
                    <Link href={'/'} className='border border-primary hover:text-light hover:bg-dark rounded-md px-4 py-2 '>Go to our Products Page</Link>
                </div>
                )
            }

            {/* Table Head */}

        </div>
    );
};

export default CartsPage;
