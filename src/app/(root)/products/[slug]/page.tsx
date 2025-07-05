import ProductClient from '@/components/custom/products/ProductClient';
import { metadataBaseURL } from '@/utils/seo';

import React from 'react';




// Dummy fetch function — replace with your API
async function getProduct(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`)

    if (!res.ok) throw new Error('Product not found')

    const data = await res.json()
    return data?.data.product;
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {

    try {
        const slug = (await params).slug
        const product = await getProduct(slug);
        const productUrl = `${metadataBaseURL}/products/${slug}`
        const productImage = product.images?.[0] || 'https://vutuk-nextjs.vercel.app/default-image.jpg'


        return {
            title: `${product.title} – Buy Now | Vutuk`,
            description: `Shop ${product.title} for just ₹${product.price}. High-quality, fast shipping.`,
            keywords: ['ecommerce', 'online shopping', 'cheap gadgets', 'fashion', 'electronics', product.title],
            authors: [{ name: 'Vutuk Team' }],
            creator: 'Vutuk',
            metadataBase: new URL(metadataBaseURL),
            openGraph: {
                title: `${product.title} – Buy Now | Vutuk`,
                description: `Shop ${product.title} for just ₹${product.price}. High-quality, fast shipping.`,
                url: productUrl,
                siteName: 'Vutuk',
                images: [
                    {
                        url: productImage,
                        width: 1200,
                        height: 630,
                        alt: `${product.title} Image`,
                    },
                ],
                locale: 'en_US',
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${product.title} – Buy Now | Vutuk`,
                description: `Get ${product.title} at ₹${product.price}. Fast delivery and easy returns.`,
                images: [productImage],
                site: '@vutukmedia',
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
                canonical: productUrl,
            },
        }
    } catch (error) {
        console.error(error)
        return {
            title: 'Product Not Found – Vutuk',
            description: 'The requested product could not be found.',
        }
    }


}



const SingleProductPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug
    const product = await getProduct(slug);
    console.log(product)
    return <ProductClient product={product} />
}

export default SingleProductPage