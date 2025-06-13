import WidthCard from '@/components/ui/WidthCard'
import React from 'react'
import { FirstDiv } from './LayoutDivs';

const ShopLayout = () => {
    return (
        <WidthCard className='mb-6 grid grid-cols-4 grid-rows-4 gap-2 h-[75vh]'>

            <FirstDiv />
            <div className='w-full h-full bg-red-400 col-span-3 row-span-2'>s</div>
            <div className='w-full h-full bg-red-500 col-span-3 row-span-2'>s</div>
            <div className='w-full h-full bg-red-700 col-span-1 row-span-1 rounded-xl flex items-center justify-center'>
                <h1>Scroll for More products</h1>
            </div>

        </WidthCard>
    )
}

export default ShopLayout;


