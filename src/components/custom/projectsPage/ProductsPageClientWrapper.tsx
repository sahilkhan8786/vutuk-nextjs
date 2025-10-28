'use client';

import React from 'react';
import ProductsCatalogue from '@/components/custom/home/ProductsCatalogue';
import { Button } from '@/components/ui/button';
import MobileFilters from './MobileFilters';

interface AdditionalData {
    productType: string;
    mainCategories: string;
    subCategories: string;
}

interface Props {
    additionalData: AdditionalData;
}

export default function ProductsPageClientWrapper({ additionalData }: Props) {

    return (
        <div className="flex mt-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-1">
                <MobileFilters additionalData={additionalData} />
            </aside>

            {/* Products */}
            <div className="flex-[5]">
                <ProductsCatalogue />
            </div>

            {/* Mobile Filter Button */}
            <Button
                className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50"

            >
                Filters
            </Button>


        </div>
    );
}
