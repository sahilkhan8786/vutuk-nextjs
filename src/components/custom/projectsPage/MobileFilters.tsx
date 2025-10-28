'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import FilterLinks from '@/components/custom/products/FilterLinks'
import { FilterIcon } from 'lucide-react'

interface MobileFiltersProps {
    additionalData: {
        productType?: string
        mainCategories?: string
        subCategories?: string
    }
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ additionalData }) => {
    return (
        <Sheet >
            <SheetTrigger asChild>
                <div className='md:hidden fixed bottom-0 w-full z-50 flex items-center justify-center bg-white pt-2 shadow-2xl shadow-black -mx-2'>

                    <Button className="mb-1" variant={'outline'}>
                        <FilterIcon />
                        Filters</Button>
                </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-4 overflow-y-scroll">
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <ul className="mt-4 space-y-4">
                    <FilterLinks
                        title="Product Type"
                        paramKey="productType"
                        items={additionalData?.productType?.split(',') || []}
                    />
                    <FilterLinks
                        title="Main Categories"
                        paramKey="mainCategories"
                        items={additionalData?.mainCategories?.split(',') || []}
                    />
                    <FilterLinks
                        title="Sub Categories"
                        paramKey="subCategories"
                        items={additionalData?.subCategories?.split(',') || []}
                    />
                </ul>
            </SheetContent>
        </Sheet>
    )
}

export default MobileFilters
