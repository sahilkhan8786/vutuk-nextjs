import ProductsCatalogue from '@/components/custom/home/ProductsCatalogue';
import ShopLayout from '@/components/custom/shop/ShopLayout';
import HomePageSkeleton from '@/components/custom/skeletons/HomePageSkeleton';
import WidthCard from '@/components/ui/WidthCard';
import { Metadata } from 'next';
import Image from 'next/image';
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Vutuk – Affordable & Trendy Products Online',
  description: 'Shop the latest collections of clothing, gadgets, and accessories at unbeatable prices. Fast shipping & secure checkout!',
  keywords: ['ecommerce', 'online shopping', 'cheap gadgets', 'fashion', 'electronics'],
  authors: [{ name: 'Vutuk Team' }],
  creator: 'Vutuk',
  metadataBase: new URL('https://vutuk-nextjs.vercel.app'),
  openGraph: {
    title: 'Vutuk – Affordable & Trendy Products Online',
    description:
      'Explore thousands of products at low prices. Clothing, electronics, home essentials & more. Free returns. Shop now!',
    url: 'https://vutuk-nextjs.vercel.app',
    siteName: 'Vutuk',
    images: [
      {
        url: 'https://res.cloudinary.com/dyupdbnls/image/upload/v1751713660/Vutuk_Profile_tnoaca.jpg',
        width: 1200,
        height: 630,
        alt: 'Vutuk OG Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vutuk – Affordable & Trendy Products Online',
    description: 'Get the latest deals on fashion, electronics, and more. Secure payment & fast delivery.',
    images: [
      'https://res.cloudinary.com/dyupdbnls/image/upload/v1751713660/Vutuk_Profile_tnoaca.jpg',
    ],
    site: '@iamvutuk', // Replace with your actual Twitter handle if you have one
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://vutuk-nextjs.vercel.app',
  },
};




const HomePage = () => {
  return (
    <>
      <div className='mt-24'>
        {/* <Title heading='Vutuk Shop'
        description='Best Designer vases available'>
        </Title> */}

        <Suspense fallback={<HomePageSkeleton />}>
          <ShopLayout />
        </Suspense>


      </div>
      {/* BANNERS */}
      <WidthCard className='grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 gap-6 text-light mb-6 h-[450px]'>
        <div className=' bg-dark w-full rounded-xl p-4  relative overflow-hidden'>
          <h2 className='text-xl mb-4 z-40  absolute w-full bg-dark/60 left-0 -bottom-4 p-4 text-center'>Gifts for Him</h2>


          <Image
            src={'/banner-1.jpg'}
            alt='IMAGE'
            fill
            className='absolute object-cover object-center rounded-xl z-20 hover:scale-125 transition-all'
            priority
          />

        </div>
        <div className=' bg-dark w-full rounded-xl p-4  relative overflow-hidden'>
          <h2 className='text-xl mb-4 z-40  absolute w-full bg-dark/60 left-0 -bottom-4 p-4 text-center'>Gifts for Him</h2>


          <Image
            src={'/banner-2.jpg'}
            alt='IMAGE'
            fill
            className='absolute object-cover object-center rounded-xl z-20 hover:scale-125 transition-all'
            priority
          />

        </div>
        <div className=' bg-dark w-full rounded-xl p-4  relative overflow-hidden sm:row-span-2 sm:col-span-2 lg:row-span-1 lg:col-span-1'>
          <h2 className='text-xl mb-4 z-40  absolute w-full bg-dark/60 left-0 -bottom-4 p-4 text-center'>CountDown HERE</h2>


          <Image
            src={'/banner-4.jpg'}
            alt='IMAGE'
            fill
            className='absolute object-cover object-center rounded-xl z-20 hover:scale-125 transition-all'
            priority
          />

        </div>

      </WidthCard>
      <ProductsCatalogue />


    </>
  )
}

export default HomePage;