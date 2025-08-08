'use client';

import { useCart } from '@/context/cart-context';
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CartIcon = () => {
    const { totalItems } = useCart();
    return (
        <Link href={'/cart'} className='relative '>

            <ShoppingCart className='border rounded-sm p-1 hover:bg-light hover:text-dark' />
            <p className='absolute -top-3 -right-3 bg-light text-dark rounded-full size-5 inline-flex items-center justify-center'> {totalItems}

            </p>
        </Link>
    )
}

export default CartIcon