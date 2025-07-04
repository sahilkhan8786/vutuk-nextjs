import ShopLayout from '@/components/custom/shop/ShopLayout';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: 'Vutuk – Affordable & Trendy Products Online',
  description: 'Shop the latest collections of clothing, gadgets, and accessories at unbeatable prices. Fast shipping & secure checkout!',
  keywords: ['ecommerce', 'online shopping', 'cheap gadgets', 'fashion', 'electronics'],
  authors: [{ name: 'ShopSmart Team' }],
  creator: 'ShopSmart',
  metadataBase: new URL('https://www.vutuk.com'),
  openGraph: {
    title: 'ShopSmart – Affordable & Trendy Products Online',
    description:
      'Explore thousands of products at low prices. Clothing, electronics, home essentials & more. Free returns. Shop now!',
    url: 'https://www.shopsmart.com',
    siteName: 'Vutuk',
    images: [
      {
        url: 'https://res.cloudinary.com/dyupdbnls/image/upload/v1751514331/your_folder_name/adorable-kid-s-dance-a-heartwarming-performance-video-editing-by-vutuk-media.webp',
        width: 1200,
        height: 630,
        alt: 'ShopSmart OG Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopSmart – Affordable & Trendy Products Online',
    description:
      'Get the latest deals on fashion, electronics, and more. Secure payment & fast delivery.',
    images: ['https://res.cloudinary.com/dyupdbnls/image/upload/v1751514331/your_folder_name/adorable-kid-s-dance-a-heartwarming-performance-video-editing-by-vutuk-media.webp'],
    site: '@shopsmart',
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
    canonical: 'https://www.shopsmart.com',
  },
};



const HomePage = () => {
  return (
    // <div className='relative'>
    //   {/* <CarouselComponent /> */}
    //   <HomeHero />
    //   <Services />
    //   <ClientsContainer />
    // </div>
    <div className='mt-24'>
      {/* <Title heading='Vutuk Shop'
        description='Best Designer vases available'>
      </Title> */}

      <ShopLayout />


    </div>
  )
}

export default HomePage;