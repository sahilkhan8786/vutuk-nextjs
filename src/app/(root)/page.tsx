import ShopLayout from '@/components/custom/shop/ShopLayout';
import { Metadata } from 'next';
import React from 'react'

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
        url: 'https://i.etsystatic.com/59876780/r/isbl/735c55/77928882/isbl_3360x840.77928882_kwpe7hzn.jpg',
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
      'https://i.etsystatic.com/59876780/r/isbl/735c55/77928882/isbl_3360x840.77928882_kwpe7hzn.jpg',
    ],
    site: '@vutukmedia', // Replace with your actual Twitter handle if you have one
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