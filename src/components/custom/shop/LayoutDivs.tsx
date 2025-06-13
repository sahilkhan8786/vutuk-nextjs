'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useCart } from '@/context/cart-context';
import Image from 'next/image';
import React, { useState } from 'react';

const images = [
    { key: 'white', image: 'https://i.etsystatic.com/59876780/r/il/77ee37/6936741408/il_fullxfull.6936741408_as37.jpg', sku: 'WHITE_SKU' },
    { key: 'yellow', image: 'https://i.etsystatic.com/59876780/r/il/3c4a2f/6936741384/il_fullxfull.6936741384_86j8.jpg', sku: 'YELLOW_SKU' },
    { key: 'black', image: 'https://i.etsystatic.com/59876780/r/il/2b1247/6936741388/il_fullxfull.6936741388_bfj2.jpg', sku: 'BLACK_SKU' },
    { key: 'blue', image: 'https://i.etsystatic.com/59876780/r/il/d2accd/6984710741/il_fullxfull.6984710741_9c79.jpg', sku: 'BLUE_SKU' },
    { key: 'green', image: 'https://i.etsystatic.com/59876780/r/il/0b59f9/6936741396/il_fullxfull.6936741396_fnbe.jpg', sku: 'GREEN_SKU' },
    { key: 'red', image: 'https://i.etsystatic.com/59876780/r/il/787200/6936741398/il_fullxfull.6936741398_m0kh.jpg', sku: 'RED_SKU' },
];

const generalImages = [
    'https://i.etsystatic.com/59876780/r/il/6919a0/6936741394/il_fullxfull.6936741394_s41t.jpg',
    'https://i.etsystatic.com/59876780/r/il/05509a/6919495302/il_fullxfull.6919495302_fhwb.jpg',
];

const colorClassMap: { [key: string]: string } = {
    black: 'bg-black',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    white: 'bg-white',
    yellow: 'bg-yellow-500',
};

export const FirstDiv = () => {
    const { state, dispatch } = useCart();

    const [activeColor, setActiveColor] = useState('white');
    const [manualImage, setManualImage] = useState<string | null>(null);

    const activeItem = images.find(item => item.key === activeColor) || images[0];
    const activePotImage = manualImage || activeItem.image;
    const activeSKU = activeItem.sku;

    const cartItem = state.products.find(item => item.sku === activeSKU);

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

    const handleColorClick = (key: string) => {
        setActiveColor(key);
        setManualImage(null); // reset general image override
    };

    return (
        <div className='w-full h-full border border-primary rounded-xl col-span-1 row-span-4'>
            <h2 className='text-center font-medium text-2xl my-4'>New Arrivals</h2>

            <div className='flex justify-center w-full'>
                <div className='relative h-[400px] w-full'>
                    <Image
                        src={activePotImage}
                        fill
                        alt='Product'
                        className='rounded-xl absolute object-center object-contain'
                    />
                </div>
            </div>

            <div className='w-full mt-3 px-4 flex gap-2 items-center justify-center py-1'>
                <Carousel opts={{ align: 'center' }} className='w-[275px]'>
                    <CarouselContent>
                        {images.map((item, index) => (
                            <CarouselItem key={`variant-${index}`} className='md:basis-1/2 lg:basis-1/4'>
                                <Image
                                    src={item.image}
                                    width={50}
                                    height={50}
                                    alt='Variant'
                                    onClick={() => handleColorClick(item.key)}
                                    className={`rounded-md cursor-pointer hover:-translate-y-1 transition-all ${item.key === activeColor && !manualImage ? 'ring-2 ring-primary' : ''
                                        }`}
                                />
                            </CarouselItem>
                        ))}
                        {generalImages.map((img, index) => (
                            <CarouselItem key={`general-${index}`} className='md:basis-1/2 lg:basis-1/4'>
                                <Image
                                    src={img}
                                    width={50}
                                    height={50}
                                    alt='General'
                                    onClick={() => setManualImage(img)}
                                    className={`rounded-md cursor-pointer hover:-translate-y-1 transition-all ${manualImage === img ? 'ring-2 ring-primary' : ''
                                        }`}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

            <div className='my-3 flex items-center justify-between px-4 pt-2'>
                <h3 className='hover:underline cursor-pointer'>
                    {`3D Printed Geometric Broken Vase`.slice(0, 27)}...
                </h3>
                <h2>Price: ₹999</h2>
            </div>

            <div className='mb-2.5'>
                <div className='gap-4 rounded-bl-xl rounded-br-xl px-4 pb-[3px] flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <h4>Available Colors</h4>
                        {images.map(({ key }) => (
                            <p
                                key={key}
                                className={`size-4 rounded-xl border border-slate-700 cursor-pointer hover:shadow ${colorClassMap[key] || ''
                                    } ${key === activeColor && !manualImage ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                                onClick={() => handleColorClick(key)}
                            ></p>
                        ))}
                    </div>
                </div>
            </div>

            {!cartItem ? (
                <div
                    onClick={addToCart}
                    className='flex items-center justify-center border border-primary rounded-md px-3 hover:bg-primary hover:text-light cursor-pointer py-1 mx-3'
                >
                    Add To Cart
                </div>
            ) : (
                <div className='flex items-center justify-center'>
                    <div className='flex items-center gap-2 border border-primary rounded-md py-1 px-2'>
                        <button
                            onClick={() => updateQuantity(-1)}
                            className='px-1 text-lg font-bold hover:text-red-500'
                        >
                            −
                        </button>
                    </div>
                    <span className='px-2'>{cartItem.quantity}</span>
                    <div className='flex items-center gap-2 border border-primary rounded-md py-1 px-2'>
                        <button
                            onClick={() => updateQuantity(1)}
                            className='px-1 text-lg font-bold hover:text-green-600'
                        >
                            +
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
