// ProductsCatalogue.tsx (Server Component)

import InfiniteProducts from "./InfiniteProducts"
interface Product {
    _id: string
    slug: string
    title: string
    price: number
    priceInUSD: number
    images: string[]
    sku: string
}


async function getInitialProducts(): Promise<Product[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?page=1&limit=25`, {
        credentials: 'include'
    })
    const data = await res.json()
    return data.data.products
}

export default async function ProductsCatalogue() {
    const initialProducts = await getInitialProducts()
    return (
        <div className="w-full p-4">
            <InfiniteProducts initialProducts={initialProducts} />
        </div>
    )
}
