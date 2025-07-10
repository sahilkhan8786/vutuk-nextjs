'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Configuration {
    key: string;
    image: string;
    sku: string;
}

interface PopulatedProduct {
    _id: string;
    title: string;
    price: number;
    images?: string[];
    configurations?: Configuration[];
}

interface Props {
    product: PopulatedProduct;
    selectedConfig: Configuration;
    quantity?: number;
}

const AddToCartButton = ({ product, selectedConfig, quantity = 1 }: Props) => {
    const { dispatch } = useCart();

    const handleAdd = () => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                productId: {
                    _id: product._id,
                    title: product.title,
                    price: product.price,
                    images: product.images ?? [],
                    configurations: product.configurations ?? [],
                },
                sku: selectedConfig.sku,
                price: product.price,
                quantity,
            },
        });
        toast.success("PRODUCT SUCCESSFULLY ADDED TO CART")
    };

    return (
        <Button onClick={handleAdd}>
            Add to Cart
        </Button>
    );
};

export default AddToCartButton;
