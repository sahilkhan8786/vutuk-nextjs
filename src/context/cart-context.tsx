'use client';

import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useReducer, useRef, useState } from "react";

// ================== TYPES ==================
export interface Product {
    _id: string;
    title: string;
    price: number;
    images?: string[];
    sku: string[];
}

export interface Variant {
    quantity: number;
    color: string;
}

export interface CartItem {
    product: Product;
    variants: Variant[];
}

interface CartState {
    totalItems: number;
    cart: CartItem[];
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: { product: Product; variants: Variant[] } }
    | { type: 'UPDATE_CART_ITEM'; payload: { productId: string; variants: Variant[] } }
    | { type: 'REMOVE_FROM_CART'; payload: { productId: string; variantColor?: string } }
    | { type: 'SET_CART'; payload: CartItem[] }
    | { type: 'CLEAR_CART' };

// ================== INITIAL STATE ==================
const initialState: CartState = {
    totalItems: 0,
    cart: [],
};

// Helper function to ensure variants are properly formatted
const ensureValidVariants = (variants: Variant[]): Variant[] => {
    if (!Array.isArray(variants)) {
        return [{ color: 'black', quantity: 1 }];
    }
    return variants.map(v => ({
        color: typeof v.color === 'string' ? v.color : 'black',
        quantity: typeof v.quantity === 'number' && v.quantity > 0 ? v.quantity : 1
    }));
};

// ================== REDUCER ==================
function reducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_TO_CART": {
            const { product, variants } = action.payload;
            const safeVariants = ensureValidVariants(variants);
            const existingIndex = state.cart.findIndex(item => item.product._id === product._id);

            let updatedCart;
            if (existingIndex >= 0) {
                updatedCart = [...state.cart];
                const existingVariants = updatedCart[existingIndex].variants;

                const mergedVariants = [...existingVariants];
                safeVariants.forEach(newVariant => {
                    const existingVariantIndex = mergedVariants.findIndex(v => v.color === newVariant.color);
                    if (existingVariantIndex >= 0) {
                        mergedVariants[existingVariantIndex].quantity += newVariant.quantity;
                    } else {
                        mergedVariants.push(newVariant);
                    }
                });

                updatedCart[existingIndex] = { ...updatedCart[existingIndex], variants: mergedVariants };
            } else {
                updatedCart = [...state.cart, { product, variants: safeVariants }];
            }

            const totalItems = updatedCart.reduce((sum, item) =>
                sum + item.variants.reduce((vSum, v) => vSum + v.quantity, 0), 0);

            return { cart: updatedCart, totalItems };
        }

        case "UPDATE_CART_ITEM": {
            const { productId, variants } = action.payload;
            const safeVariants = ensureValidVariants(variants);
            const updatedCart = state.cart.map(item =>
                item.product._id === productId
                    ? { ...item, variants: safeVariants }
                    : item
            ).filter(item => item.variants.length > 0);

            const totalItems = updatedCart.reduce((sum, item) =>
                sum + item.variants.reduce((vSum, v) => vSum + v.quantity, 0), 0);

            return { cart: updatedCart, totalItems };
        }

        case "REMOVE_FROM_CART": {
            const { productId, variantColor } = action.payload;
            let updatedCart = [...state.cart];

            if (variantColor) {
                updatedCart = updatedCart.map(item => {
                    if (item.product._id === productId) {
                        const filteredVariants = item.variants.filter(v => v.color !== variantColor);
                        return { ...item, variants: filteredVariants };
                    }
                    return item;
                }).filter(item => item.variants.length > 0);
            } else {
                updatedCart = updatedCart.filter(item => item.product._id !== productId);
            }

            const totalItems = updatedCart.reduce((sum, item) =>
                sum + item.variants.reduce((vSum, v) => vSum + v.quantity, 0), 0);

            return { cart: updatedCart, totalItems };
        }

        case "SET_CART": {
            const safeCart = action.payload.map(item => ({
                product: item.product,
                variants: ensureValidVariants(item.variants)
            }));

            const totalItems = safeCart.reduce((sum, item) =>
                sum + item.variants.reduce((vSum, v) => vSum + v.quantity, 0), 0);

            return { cart: safeCart, totalItems };
        }

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
    addToCart: (product: Product, variants?: Variant[]) => Promise<void>;
    updateCartItem: (productId: string, variants: Variant[]) => Promise<void>;
    removeFromCart: (productId: string, variantColor?: string) => Promise<void>;
    clearCart: () => Promise<void>;
    syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Server Actions with retry logic
const saveCartToServer = async (cart: CartItem[], retries = 3): Promise<void> => {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart }),
        });

        if (!response.ok) throw new Error('Failed to save cart');
    } catch (error) {
        console.error('Failed to save cart to server:', error);
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return saveCartToServer(cart, retries - 1);
        }
        throw error;
    }
};

const fetchCartFromServer = async (retries = 3): Promise<CartItem[]> => {
    try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        return data.cart || [];
    } catch (error) {
        console.error('Failed to fetch cart from server:', error);
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchCartFromServer(retries - 1);
        }
        return [];
    }
};

const clearServerCart = async (retries = 3): Promise<void> => {
    try {
        const response = await fetch('/api/cart', { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to clear cart');
    } catch (error) {
        console.error('Failed to clear server cart:', error);
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return clearServerCart(retries - 1);
        }
        throw error;
    }
};

// ================== PROVIDER ==================
export const CartContextProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const [{ cart, totalItems }, dispatch] = useReducer(reducer, initialState);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const prevSessionRef = useRef(session);
    const isMountedRef = useRef(false);

    // Handle the login transition
    useEffect(() => {
        if (!isMountedRef.current) {
            isMountedRef.current = true;
            return;
        }

        // Check if user just logged in (previous session was null, now has user)
        if (!prevSessionRef.current?.user && session?.user) {
            const localCart = localStorage.getItem('cart');
            if (localCart) {
                const parsedCart = JSON.parse(localCart);
                if (parsedCart.length > 0) {
                    // Transfer local cart to server
                    saveCartToServer(parsedCart)
                        .then(() => {
                            dispatch({ type: "SET_CART", payload: parsedCart });
                            localStorage.removeItem('cart');
                        })
                        .catch(error => {
                            console.error('Failed to migrate cart to server:', error);
                        });
                }
            }
        }
        prevSessionRef.current = session;
    }, [session]);

    // Load cart from storage/API
    useEffect(() => {
        if (status === 'loading') return;

        const loadCart = async () => {
            try {
                let loadedCart: CartItem[] = [];

                if (session?.user) {
                    loadedCart = await fetchCartFromServer();
                } else {
                    const storedCart = localStorage.getItem('cart');
                    if (storedCart) {
                        loadedCart = JSON.parse(storedCart) || [];
                    }
                }

                dispatch({ type: "SET_CART", payload: loadedCart });
            } catch (error) {
                console.error('Error loading cart:', error);
            } finally {
                setIsInitialLoad(false);
            }
        };

        loadCart();
    }, [session?.user, status]);

    // Save cart to storage/API with debouncing
    useEffect(() => {
        if (status === 'loading' || isInitialLoad) return;

        const timer = setTimeout(() => {
            if (session?.user) {
                saveCartToServer(cart).catch(error => {
                    console.error('Failed to save cart:', error);
                });
            } else {
                localStorage.setItem('cart', JSON.stringify(cart));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [cart, session?.user, status, isInitialLoad]);

    const syncCart = async () => {
        if (session?.user) {
            try {
                const serverCart = await fetchCartFromServer();
                dispatch({ type: "SET_CART", payload: serverCart });
            } catch (error) {
                console.error('Failed to sync cart:', error);
            }
        }
    };

    const addToCart = async (product: Product, variants: Variant[] = [{ color: 'black', quantity: 1 }]) => {
        const safeVariants = ensureValidVariants(variants);

        // Dispatch first to update UI immediately
        dispatch({ type: "ADD_TO_CART", payload: { product, variants: safeVariants } });

        if (session?.user) {
            try {
                await saveCartToServer([...cart, { product, variants: safeVariants }]);
            } catch (error) {
                // Revert if save fails
                const existingIndex = cart.findIndex(item => item.product._id === product._id);
                if (existingIndex >= 0) {
                    dispatch({
                        type: "UPDATE_CART_ITEM",
                        payload: {
                            productId: product._id,
                            variants: cart[existingIndex].variants
                        }
                    });
                } else {
                    dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: { productId: product._id }
                    });
                }
                throw error;
            }
        }
    };

    const updateCartItem = async (productId: string, variants: Variant[]) => {
        const safeVariants = ensureValidVariants(variants);
        const previousCartItem = cart.find(item => item.product._id === productId);

        // Dispatch first to update UI immediately
        dispatch({ type: "UPDATE_CART_ITEM", payload: { productId, variants: safeVariants } });

        if (session?.user) {
            try {
                await saveCartToServer(cart);
            } catch (error) {
                // Revert if save fails
                if (previousCartItem) {
                    dispatch({
                        type: "UPDATE_CART_ITEM",
                        payload: {
                            productId,
                            variants: previousCartItem.variants
                        }
                    });
                }
                throw error;
            }
        }
    };

    const removeFromCart = async (productId: string, variantColor?: string) => {
        const previousCartItem = cart.find(item => item.product._id === productId);

        // Dispatch first to update UI immediately
        dispatch({ type: "REMOVE_FROM_CART", payload: { productId, variantColor } });

        if (session?.user) {
            try {
                await saveCartToServer(cart);
            } catch (error) {
                // Revert if save fails
                if (previousCartItem) {
                    dispatch({
                        type: "ADD_TO_CART",
                        payload: {
                            product: previousCartItem.product,
                            variants: previousCartItem.variants
                        }
                    });
                }
                throw error;
            }
        }
    };

    const clearCart = async () => {
        // Dispatch first to update UI immediately
        dispatch({ type: "CLEAR_CART" });

        if (session?.user) {
            try {
                await clearServerCart();
            } catch (error) {
                // Revert if clear fails
                dispatch({ type: "SET_CART", payload: cart });
                throw error;
            }
        } else {
            localStorage.removeItem("cart");
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            totalItems,
            addToCart,
            updateCartItem,
            removeFromCart,
            clearCart,
            syncCart
        }}>
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