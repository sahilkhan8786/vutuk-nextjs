import WidthCard from '@/components/ui/WidthCard'
import React from 'react'
import { CarousalDivHomePage, ProductOnDemand3DDiv } from './LayoutDivs'


// const headersList = await headers();
// const cookieHeader = headersList?.get("cookie") ?? "";

// const res = await fetch('http://localhost:3000/api/products', {
//     headers: {
//         cookie: cookieHeader, // ✅ manually send cookies to preserve session
//     },

// });

const ShopLayout = async () => {
    const productsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
        method: "GET",
        credentials: "include"
    })
    const json = await productsRes.json()
    const { products } = json.data

    return (
        <WidthCard className='mb-6  grid grid-cols-1 sm:grid-cols-2   gap-2 min-h-[74vh] lg:grid-cols-4'>
            {/* NEW ARRIVALS DIV */}
            <CarousalDivHomePage className='sm:col-span-1 row-span-2' title='New Arrivals' products={products} innerDivHeight='min-h-80' delay={4000} />

            <ProductOnDemand3DDiv />

            {/* BEST SELLER DIV */}
            <CarousalDivHomePage className='col-span-4 row-span-2' title='Best Sellers' products={products} innerDivHeight='min-h-64' carousalBasis='sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6' delay={10000} />

        </WidthCard>
    )
}

export default ShopLayout
