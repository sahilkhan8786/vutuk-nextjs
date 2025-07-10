'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useState } from 'react'

interface RemoveFromFavouriteButtonProps {
    id: string
    title?: string
    currentFavourites: string[] // Array of all current favourite IDs
    onSuccess?: (updatedFavourites: string[]) => void
}

const RemoveFromFavouriteButton = ({
    id,
    title,
    currentFavourites,
    onSuccess
}: RemoveFromFavouriteButtonProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleRemove = async () => {
        setIsLoading(true)

        try {
            // Filter out the removed ID from current favourites
            const updatedFavourites = currentFavourites.filter(favId => favId !== id)

            const res = await fetch('/api/favourites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFavourites) // Send the filtered array
            })

            if (!res.ok) {
                throw new Error('Failed to update favourites')
            }

            toast.success('Removed from Favourites', {
                description: `${title?.slice(0, 15)}... removed from favourites`,
            })

            // Call success callback with the updated list
            if (onSuccess) {
                onSuccess(updatedFavourites)
            }
        } catch (err) {
            toast.error('Failed to remove', {
                description: err instanceof Error ? err.message : 'Please try again',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            className="bg-red-700 hover:bg-red-900 w-full"
            onClick={handleRemove}
            disabled={isLoading}
        >
            {isLoading ? 'Removing...' : 'Remove From Favourites'}
        </Button>
    )
}

export default RemoveFromFavouriteButton