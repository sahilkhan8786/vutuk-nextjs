import { getProductExtraDetails } from '@/actions/additional-data'
import ProductsCatalogue from '@/components/custom/home/ProductsCatalogue'
import FilterLinks from '@/components/custom/products/FilterLinks'
import MobileFilters from '@/components/custom/projectsPage/MobileFilters'
import Title from '@/components/ui/Title'
import WidthCard from '@/components/ui/WidthCard'
import React from 'react'

// Remove the interface and let Next.js handle the types automatically
// Or use the correct type if you need TypeScript definitions

const ProductsPage = async ({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    // Await the searchParams promise
    const resolvedSearchParams = await searchParams
    const additionalData = await getProductExtraDetails()

    return (
        <div className='mt-18 md:mt-24'>
            <WidthCard className='min-h-screen '>
                <Title
                    heading='Products'
                    description='Explore our wide range of products available for purchase.'
                />
                <MobileFilters additionalData={additionalData} />

                <div className='flex mt-8  mb-8 '>
                    <aside className='flex-1 hidden md:block'>
                        <h2 className='text-2xl font-bold mb-4'>Categories</h2>
                        <ul className='space-y-2'>
                            <FilterLinks
                                title='Product Type'
                                paramKey='productType'
                                items={additionalData?.productType?.split(',') || []}
                            />
                            <FilterLinks
                                title='Main Categories'
                                paramKey='mainCategories'
                                items={additionalData?.mainCategories?.split(',') || []}
                            />
                            <FilterLinks
                                title='Sub Categories'
                                paramKey='subCategories'
                                items={additionalData?.subCategories?.split(',') || []}
                            />
                        </ul>
                    </aside>
                    <div className='flex-[5]'>
                        <ProductsCatalogue searchParams={resolvedSearchParams} />
                    </div>
                </div>
            </WidthCard>
        </div>
    )
}

export default ProductsPage