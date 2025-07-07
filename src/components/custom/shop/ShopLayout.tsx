import WidthCard from '@/components/ui/WidthCard'
import React from 'react'
import { CarousalDivHomePage, ProductOnDemand3DDiv } from './LayoutDivs'
import Image from 'next/image'


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
            <CarousalDivHomePage className='col-span-1 row-span-3' title='New Arrivals' products={products} innerDivHeight='min-h-120' delay={4000} />

            <ProductOnDemand3DDiv />

            {/* BEST SELLER DIV */}
            <CarousalDivHomePage className='sm:col-span-1 lg:col-span-3 row-span-2' title='Best Sellers' products={products} innerDivHeight='h-48' carousalBasis='lg:basis-1/2 xl:basis-1/3 2xl:basis-1/4' delay={10000} />


            <div className='bg-dark text-light text-center hover:shadow hover:-translate-y-1 transition-all rounded-xl' >
                <h2 className='font-bebas text-4xl sm:text-6xl  mt-4'>
                    Our Catalogues
                </h2>
                <p className='text-sm sm:text-base'>View All the Products</p>
                <div className='flex items-center justify-center'>
                    <Image
                        width={80}
                        height={80}
                        alt='Scroll Icon' src={'/scroll-down.gif'}
                        className='hover:scale-125 transition-all hover:cursor-pointer'
                    />
                </div>
            </div>
        </WidthCard>
    )
}

export default ShopLayout
