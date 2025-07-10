'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';

export default function AddToCartButton({
    productId,
    sku,
    price,
}: {
    productId: string;
    sku: string;
    price: number;
}) {
    const { dispatch } = useCart();

    const handleAdd = () => {
        dispatch({ type: 'ADD_TO_CART', payload: { productId, sku, price, quantity: 1 } });
        toast.success('Added to cart', { description: 'Item added successfully!' });
    };

    return (
        <Button onClick={handleAdd} className="w-full bg-green-700 hover:bg-green-900">
            Add To Cart
        </Button>
    );
}
