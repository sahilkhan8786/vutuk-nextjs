import React from 'react'

import {
    Sheet,
    SheetTrigger,
} from "@/components/ui/sheet"
import CartVariantSelect from './CartVariantSelect'
import { Button } from '@/components/ui/button'

export interface Product {
    _id: string
    slug: string
    title: string
    price: number
    priceInUSD: number
    images: string[]
    sku: string[]
}

const CartVariantSelectWrapper = ({
    trigger,
    product
}: {
    trigger?: React.ReactNode;
    product: Product
}) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {trigger ? trigger : <Button className='w-full'>Select Variants</Button>}
            </SheetTrigger>
            <CartVariantSelect product={product} />
        </Sheet>
    )
}

export default CartVariantSelectWrapper