import WidthCard from '@/components/ui/WidthCard'
import React from 'react'
import { FirstDiv } from './LayoutDivs';

const ShopLayout = () => {
    return (
        <WidthCard className='mb-6 grid grid-cols-4 grid-rows-4 gap-2 h-[75vh]'>

            <FirstDiv />
            <div className='w-full h-full bg-red-400 col-span-3 row-span-2'>s</div>
            <div className='w-full h-full bg-red-500 col-span-3 row-span-2'>s</div>


        </WidthCard>
    )
}

export default ShopLayout;


