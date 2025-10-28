import InfiniteProducts from "./InfiniteProducts"

interface Product {
    _id: string
    slug: string
    title: string
    price: number
    priceInUSD: number
    images: string[]
    sku: string[]
}

// This version accepts optional searchParams
async function getInitialProducts(searchParams?: Record<string, string | string[] | undefined>): Promise<Product[]> {
    const params = new URLSearchParams()

    // Add default pagination
    params.set('page', '1')
    params.set('limit', '25')

    // Add optional filters if they exist
    if (searchParams) {
        for (const [key, value] of Object.entries(searchParams)) {
            if (value) params.set(key, String(value))
        }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?${params.toString()}`, {
        credentials: 'include',
        cache: 'no-store', // important so filtering updates instantly
    })

    if (!res.ok) {
        console.error("Error fetching products", res.status)
        return []
    }

    const data = await res.json()
    return data?.data?.products || []
}

interface ProductsCatalogueProps {
    searchParams?: Record<string, string | string[] | undefined>
}

export default async function ProductsCatalogue({ searchParams }: ProductsCatalogueProps) {
    const initialProducts = await getInitialProducts(searchParams)

    // Optional: if you want to show "no products" message
    if (!initialProducts?.length) {
        return (
            <div className="w-full p-8 text-center text-gray-600">
                No products found for selected filters.
            </div>
        )
    }

    return (
        <div className="w-full p-4">
            <InfiniteProducts initialProducts={initialProducts} />
        </div>
    )
}
