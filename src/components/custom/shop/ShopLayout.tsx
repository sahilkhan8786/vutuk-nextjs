import WidthCard from '@/components/ui/WidthCard'
import React from 'react'
import { FirstDiv } from './LayoutDivs'

const ShopLayout = async () => {
    const productsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
        cache: 'no-store',
    })
    const json = await productsRes.json()
    const { products } = json.data

    return (
        <WidthCard className='mb-6 grid grid-cols-4 grid-rows-4 gap-2 min-h-[74vh]'>
            <FirstDiv products={products} />
            <div className='w-full h-full bg-red-400 col-span-3 row-span-2'>Main Banner</div>
            <div className='w-full h-full bg-red-500 col-span-3 row-span-2'>Secondary Banner</div>
        </WidthCard>
    )
}

export default ShopLayout
