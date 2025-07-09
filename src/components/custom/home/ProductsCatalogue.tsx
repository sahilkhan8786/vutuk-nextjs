import WidthCard from '@/components/ui/WidthCard'
import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Product {
    _id: string
    slug: string
    title: string
    price: number
    images: string[]
}

async function getProducts() {
    const params = new URLSearchParams();
    params.append('mainCategories', 'vase');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);

    const data = await res.json();

    return data.data.products as Product[];

}


const ProductsCatalogue = async () => {

    const products = await getProducts();
    console.log(products)

    return (
        <WidthCard className='w-full grid grid-cols-5 gap-5 p-4'>

            {products.map(product => (

                <Link href={`/products/${product.slug}`}

                    key={product._id}
                    className={`transition-all duration-500 ease-in-out flex flex-col items-center justify-start gap-2 border rounded-xl p-4 `}
                >

                    <Image src={product.images[0]} alt={product.title}
                        width={250} height={250}
                        className='rounded-xl'
                    />

                    <h3 className="text-center text-sm font-semibold line-clamp-2 hover:underline capitalize">
                        {product.title}
                    </h3>

                    <p className="text-sm text-muted-foreground">₹{product.price}</p>
                    <Button>Add To Cart</Button>
                </Link>
            ))}
        </WidthCard>
    )
}

export default ProductsCatalogue