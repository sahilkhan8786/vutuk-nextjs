import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const ServicesCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 p-4 rounded-xl border shadow-md">
            <Skeleton className="w-full h-[300px] rounded-md" />

            <Skeleton className="h-16 w-full mt-2" />
            <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    )
}

export default ServicesCardSkeleton