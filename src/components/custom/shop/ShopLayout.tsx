import WidthCard from '@/components/ui/WidthCard'
import React, { Suspense } from 'react'
import { CarousalDivHomePage, ProductOnDemand3DDiv } from './LayoutDivs'
import { Skeleton } from '@/components/ui/skeleton'


const ShopLayout = async () => {

    return (
        <WidthCard className='mb-6  grid grid-cols-1 md:grid-cols-2   gap-6 min-h-[90vh] lg:grid-cols-4'>
            {/* NEW ARRIVALS DIV */}
            <Suspense fallback={<Skeleton className='col-span-4 lg:col-span-1 bg-primary/30 min-h-80' />}>

                <CarousalDivHomePage className='col-span-4 lg:col-span-1 w-full' title='New Arrivals' innerDivHeight='min-h-80' delay={4000}
                    carousalBasis=' sm:basis-1/3 lg:basis-1/1'
                />
            </Suspense>

            <ProductOnDemand3DDiv className=' col-span-4 lg:col-span-3 ' />

            {/* BEST SELLER DIV */}
            <Suspense fallback={<Skeleton className='col-span-4 bg-primary/30' />}>

                <CarousalDivHomePage className='col-span-4 ' title='Best Sellers' innerDivHeight='min-h-64' carousalBasis='sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6' delay={10000} />
            </Suspense>

        </WidthCard>
    )
}

export default ShopLayout
