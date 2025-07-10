'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

type Product = {
    _id: string
    title: string
    price: number
    images: string[]
}

type Favourite = {
    _id: string
    userId: string
    products: Product[]
}

type FavouriteApiResponse = {
    data: {
        favourites: Favourite[]
    }
}

type FavouriteContextType = {
    favourites: string[]
    addFavourites: (item: string) => void
    removeFavourites: (item: string) => void
}

const FavouriteContext = createContext<FavouriteContextType>({
    favourites: [],
    addFavourites: () => { },
    removeFavourites: () => { },
})

export const FavouriteContextProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession()
    const [favourites, setFavourites] = useState<string[]>([])

    // 🔁 Load initial favourites from backend or localStorage
    useEffect(() => {
        const loadInitialFavourites = async () => {
            if (session?.user) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/favourites`)
                    const data: FavouriteApiResponse = await res.json()
                    const productIds = data?.data?.favourites?.[0]?.products?.map((p) => p._id) || []
                    setFavourites(productIds)
                } catch (err) {
                    console.error('Failed to load favourites from DB:', err)
                }
            } else {
                // Fallback to localStorage if not logged in
                const stored = localStorage.getItem('favourites')
                if (stored) {
                    try {
                        setFavourites(JSON.parse(stored))
                    } catch (e) {
                        console.error('Invalid localStorage data', e)
                    }
                }
            }
        }

        loadInitialFavourites()
    }, [session])

    // Save to localStorage if not logged in
    useEffect(() => {
        if (!session?.user) {
            localStorage.setItem('favourites', JSON.stringify(favourites))
        }
    }, [favourites, session])

    const addFavourites = async (item: string) => {
        if (favourites.includes(item)) return
        const updated = [...favourites, item]
        setFavourites(updated)

        if (session?.user) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/favourites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updated),
                })
            } catch (err) {
                console.error('Failed to add favourite:', err)
            }
        }
    }

    const removeFavourites = async (item: string) => {
        const updated = favourites.filter((f) => f !== item)
        setFavourites(updated)

        if (session?.user) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/favourites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updated),
                })
            } catch (err) {
                console.error('Failed to remove favourite:', err)
            }
        }
    }

    return (
        <FavouriteContext.Provider value={{ favourites, addFavourites, removeFavourites }}>
            {children}
        </FavouriteContext.Provider>
    )
}

export const useFavourite = () => useContext(FavouriteContext)
