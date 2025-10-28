import { Product } from '@/context/cart-context';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AddToCartButton = ({ product, className = '' }: { product: Product; quantity?: number; className?: string }) => {
    const { addToCart } = useCart();

    const handleAdd = () => {
        addToCart(product); // ✅ TS is happy now
        toast.success("Product added to cart");
    }

    return (
        <Button onClick={handleAdd} className={className}>
            Add to Cart
        </Button>
    );
};

export default AddToCartButton;
