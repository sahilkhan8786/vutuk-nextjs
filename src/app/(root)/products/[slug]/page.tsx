import WidthCard from '@/components/ui/WidthCard';
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

        return {
            title: `${product.title} – Buy Now | Vutuk`,
            description: `Shop ${product.title} for just ₹${product.price}. High-quality, fast shipping.`,
            openGraph: {
                title: product.title,
                images: product.images?.[0] ? [product.images[0]] : [],
            },
        }
    } catch (error) {
        console.log(error)
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
    return (
        <div className='mt-24 space-y-8'>
            <WidthCard>
                <div>
                    <h1 className='text-2xl font-bold'>{product.title}</h1>
                    <p className='text-muted-foreground'>₹{product.price}</p>
                    {/* Add image, description, etc */}
                </div>
            </WidthCard>
        </div>
    )
}

export default SingleProductPage