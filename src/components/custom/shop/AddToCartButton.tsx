"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"



type Product = {
    _id: string;
    title: string;
    price: number;
    images: string[];
    sku: string[]; // ✅ array type
};




const AddToCartButton = ({ product, quantity = 1, className = '' }: {
    product: Product;
    quantity: number;
    className?: string
}) => {
    const { addToCart } = useCart();
    console.log(product)

    const handleAdd = () => {
        const finalProduct: Product = product
        addToCart(finalProduct, quantity);
        toast.success("PRODUCT SUCCESSFULLY ADDED TO CART")
    }

    return (
        <Button onClick={handleAdd} className={className}>
            Add to Cart
        </Button>
    )
}

export default AddToCartButton
