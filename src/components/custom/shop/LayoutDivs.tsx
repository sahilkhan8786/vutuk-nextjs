'use client';

import { useCart } from '@/context/cart-context';
import Image from 'next/image';
import React, { useState } from 'react';

const whiteImage = 'https://i.etsystatic.com/59876780/r/il/05509a/6919495302/il_fullxfull.6919495302_fhwb.jpg';
const blackImage = 'https://i.etsystatic.com/59876780/r/il/26ea55/6967462467/il_fullxfull.6967462467_65lz.jpg';
const whiteImageSKU = 'WHITE_IMAGE_SKU';
const blackImageSKU = 'BLACK_IMAGE_SKU';

export const FirstDiv = () => {
    const { state, dispatch } = useCart();
    const [activePotImage, setActivePotImage] = useState<string>(whiteImage);
    const [activeSKU, setActiveSKU] = useState<string>(whiteImageSKU);

    const handleVariantChange = (variant: 'white' | 'black') => {
        if (variant === 'white') {
            setActivePotImage(whiteImage);
            setActiveSKU(whiteImageSKU);
        } else {
            setActivePotImage(blackImage);
            setActiveSKU(blackImageSKU);
        }
    };

    const cartItem = state.products.find((item) => item.sku === activeSKU);

    const addToCart = () => {
        dispatch({ type: 'ADD_TO_CART', payload: { sku: activeSKU } });
    };

    const updateQuantity = (delta: number) => {
        const newQty = (cartItem?.quantity || 0) + delta;
        if (newQty <= 0) {
            dispatch({ type: 'REMOVE_FROM_CART', payload: { sku: activeSKU } });
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { sku: activeSKU, quantity: newQty } });
        }
    };

    return (
        <div className='w-full h-full border border-primary rounded-xl col-span-1 row-span-3'>
            <h2 className='text-center font-medium text-2xl my-4'>New Arrivals</h2>

            <div className='flex justify-center w-full'>
                <Image
                    src={activePotImage}
                    width={350}
                    height={400}
                    alt='Product'
                    className='rounded-xl hover:shadow-2xl'
                />
            </div>

            <div className='my-3 flex items-center justify-between px-4 pt-2'>
                <h3>White Tiger and Rose Vase</h3>
                <h2>Price: ₹999</h2>
            </div>

            <div className='mb-2.5'>
                <div className='gap-4 rounded-bl-xl rounded-br-xl px-4 pb-[3px] flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <h4>Available Colors</h4>
                        <p
                            className='size-4 bg-black rounded-xl border border-slate-700 hover:cursor-pointer hover:shadow'
                            onClick={() => handleVariantChange('black')}
                        ></p>
                        <p
                            className='size-4 bg-white rounded-xl border border-slate-700 hover:cursor-pointer hover:shadow'
                            onClick={() => handleVariantChange('white')}
                        ></p>
                    </div>

                    {!cartItem ? (
                        <div
                            onClick={addToCart}
                            className='flex items-center justify-center border border-primary rounded-md px-3 hover:bg-primary hover:text-light cursor-pointer py-1'
                        >
                            Add To Cart
                        </div>
                    ) : (
                        <div className='flex items-center gap-2 border border-primary rounded-md py-1 px-2'>
                            <button
                                onClick={() => updateQuantity(-1)}
                                className='px-1 text-lg font-bold hover:text-red-500'
                            >
                                −
                            </button>
                            <span className='px-2'>{cartItem.quantity}</span>
                            <button
                                onClick={() => updateQuantity(1)}
                                className='px-1 text-lg font-bold hover:text-green-600'
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
