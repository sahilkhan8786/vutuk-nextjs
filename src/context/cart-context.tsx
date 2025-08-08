'use client'

import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";

// ================== TYPES ==================
export interface Product {
    _id: string;
    title: string;
    price: number;
    images?: string[];
    sku: string[];
}

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    totalItems: number;
    cart: CartItem[];
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
    | { type: 'SET_CART'; payload: CartItem[] }
    | { type: 'CLEAR_CART' }

// ================== INITIAL STATE ==================
const initialState: CartState = {
    totalItems: 0,
    cart: [],
};



// ================== REDUCER ==================
function reducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_TO_CART": {
            const { product, quantity } = action.payload;
            const existingItemIndex = state.cart.findIndex(item => item.product._id === product._id);
            let updatedCart: CartItem[];

            if (existingItemIndex !== -1) {
                updatedCart = state.cart.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                updatedCart = [{ product, quantity }, ...state.cart];
            }

            return {
                ...state,
                totalItems: state.totalItems + quantity,
                cart: updatedCart
            };
        }

        case "SET_CART":
            return {
                ...state,
                cart: action.payload,
                // totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0)
            };


        case "CLEAR_CART":
            return initialState;

        default:
            throw new Error("UNKNOWN ACTION TYPE");
    }
}

// ================== CONTEXT ==================
interface CartContextType {
    cart: CartItem[];
    totalItems: number;
    addToCart: (product: Product, quantity: number) => void;
    clearCart: () => void;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

// ================== PROVIDER ==================
export const CartContextProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();
    const [{ cart, totalItems }, dispatch] = useReducer(reducer, initialState);

    // --- Load cart from API or localStorage ---
    useEffect(() => {
        if (session?.user) {
            // Fetch from API if logged in
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, { credentials: "include" })
                .then(res => res.json())
                .then((data: CartItem[]) => {
                    dispatch({ type: 'SET_CART', payload: data || [] });
                })
                .catch(err => console.error("Error fetching cart:", err));
        } else {
            // Load from localStorage if guest
            const storedCart = localStorage.getItem("cart");
            if (storedCart) {
                try {
                    const parsed = JSON.parse(storedCart) as CartItem[];
                    dispatch({ type: 'SET_CART', payload: parsed || [] });
                } catch {
                    console.error("Failed to parse cart from localStorage");
                }
            }


        }
    }, [session?.user]);

    // --- Save cart & coupons to localStorage if guest ---
    useEffect(() => {
        if (!session?.user) {
            localStorage.setItem("cart", JSON.stringify(cart));

        }
    }, [cart, session?.user]);

    // --- Add item to cart ---
    function addToCart(product: Product, quantity: number) {
        if (session?.user) {

            // Call API to update cart
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(
                    {
                        product: { productId: product._id, quantity }
                    }
                )
            })
                .then(res => res.json())
                .then((data: CartItem[]) => {
                    console.log(data)
                    // dispatch({ type: 'SET_CART', payload: data });
                })
                .catch(err => console.error("Error updating cart:", err));
        } else {
            // Local update
            dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
        }
    }

    // --- Apply coupon ---


    // --- Clear cart ---
    function clearCart() {
        if (session?.user) {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/clear`, { method: "POST", credentials: "include" })
                .then(() => dispatch({ type: 'CLEAR_CART' }))
                .catch(err => console.error("Error clearing cart:", err));
        } else {
            localStorage.removeItem("cart");
            localStorage.removeItem("appliedCoupons");
            dispatch({ type: 'CLEAR_CART' });
        }
    }

    return (
        <CartContext.Provider value={{ addToCart, clearCart, cart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

// ================== HOOK ==================
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("Cart Context is being used outside the Cart Context Provider");
    return context;
};
