import { Skeleton } from '@/components/ui/skeleton'
import WidthCard from '@/components/ui/WidthCard'
import React from 'react'

const HomePageSkeleton = () => {
    return (
        <WidthCard className='mb-6  grid grid-cols-1 md:grid-cols-2   gap-6 min-h-[90vh] lg:grid-cols-4 '>
            <Skeleton className='col-span-4 lg:col-span-1 bg-primary/30' />
            <Skeleton className='col-span-4 lg:col-span-3 bg-primary/30 ' />
            <Skeleton className='col-span-4 bg-primary/30' />
        </WidthCard>
    )
}

export default HomePageSkeleton