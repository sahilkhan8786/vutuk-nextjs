import { useFavourite } from "@/context/favourite-context";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export default function HeartButton({ itemId, title, className }: { itemId: string, className?: string, title?: string }) {
    const { favourites, addFavourites, removeFavourites } = useFavourite();
    const isFav = favourites.includes(itemId);

    const toggleFavourite = () => {
        if (isFav) {
            removeFavourites(itemId);
            toast("Removed from Favourites", {
                description: `${title?.slice(0, 15)}... successfully added to the Favourites`,
                actionButtonStyle: {
                    background: 'green'
                },
                action: {
                    label: "Undo",
                    onClick: () => addFavourites(itemId),

                },
            })
        } else {
            addFavourites(itemId);
            toast("Added to Favourites successfully", {
                description: `${title?.slice(0, 15)}... successfully removed From the Favourites`,
                actionButtonStyle: {
                    background: 'red'
                },
                action: {
                    label: "Remove",
                    onClick: () => removeFavourites(itemId),

                },
            })
        }
    };

    return (
        <Heart
            onClick={toggleFavourite}
            className={`cursor-pointer  size-10 p-2 transition
                ${className} stroke-red-500 hover:scale-125  
          ${isFav ? ' fill-red-500' : ' fill-transparent  transition-all '}
          `}
        />
    );
}
