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
    const productsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?random=true`, {
        method: "GET",
        credentials: "include"
    })
    const json = await productsRes.json()
    const { products } = json.data
    console.log(products)

    return (
        <WidthCard className='mb-6  grid grid-cols-1 md:grid-cols-2   gap-6 min-h-[90vh] lg:grid-cols-4'>
            {/* NEW ARRIVALS DIV */}
            <CarousalDivHomePage className='col-span-4 lg:col-span-1' title='New Arrivals' products={products} innerDivHeight='min-h-80' delay={4000}
                carousalBasis=' sm:basis-1/3 lg:basis-1/1'
            />

            <ProductOnDemand3DDiv className=' col-span-4 lg:col-span-3 ' />

            {/* BEST SELLER DIV */}
            <CarousalDivHomePage className='col-span-4 ' title='Best Sellers' products={products} innerDivHeight='min-h-64' carousalBasis='sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6' delay={10000} />

        </WidthCard>
    )
}

export default ShopLayout
