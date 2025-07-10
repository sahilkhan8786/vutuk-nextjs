'use client';

import React, {
    createContext,
    useReducer,
    useContext,
    useEffect,
    useRef,
    ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';

interface CartItem {
    productId: string | {
        _id: string,
        images?: string[];
    };
    sku: string;
    quantity: number;
    price: number;
}

interface CartState {
    totalItem: number;
    products: CartItem[];
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: { sku: string } }
    | { type: 'UPDATE_QUANTITY'; payload: { sku: string; quantity: number } }
    | { type: 'SET_CART'; payload: CartItem[] }
    | { type: 'CLEAR_CART' };

const initialCart: CartState = {
    totalItem: 0,
    products: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existing = state.products.find(p => p.sku === action.payload.sku);
            if (existing) {
                return {
                    ...state,
                    products: state.products.map(p =>
                        p.sku === action.payload.sku
                            ? { ...p, quantity: p.quantity + 1 }
                            : p
                    ),
                    totalItem: state.totalItem + 1,
                };
            }
            return {
                ...state,
                products: [...state.products, { ...action.payload, quantity: 1 }],
                totalItem: state.totalItem + 1,
            };
        }

        case 'REMOVE_FROM_CART': {
            const toRemove = state.products.find(p => p.sku === action.payload.sku);
            if (!toRemove) return state;
            return {
                ...state,
                products: state.products.filter(p => p.sku !== action.payload.sku),
                totalItem: state.totalItem - toRemove.quantity,
            };
        }

        case 'UPDATE_QUANTITY': {
            const updatedProducts = state.products.map(p =>
                p.sku === action.payload.sku
                    ? { ...p, quantity: action.payload.quantity }
                    : p
            ).filter(p => p.quantity > 0);
            const totalItem = updatedProducts.reduce((acc, p) => acc + p.quantity, 0);
            return { products: updatedProducts, totalItem };
        }

        case 'SET_CART': {
            return {
                totalItem: action.payload.reduce((sum, p) => sum + p.quantity, 0),
                products: action.payload,
            };
        }

        case 'CLEAR_CART':
            return initialCart;

        default:
            return state;
    }
};

interface CartContextType {
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();
    const [state, dispatch] = useReducer(cartReducer, initialCart);
    const hasSynced = useRef(false);

    useEffect(() => {
        const loadCart = async () => {
            if (session?.user) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, { credentials: 'include' });
                    const json = await res.json();
                    const dbCart: CartItem[] = json?.data?.products || [];

                    const localCart = localStorage.getItem('cart');
                    const mergedCart = [...dbCart];

                    if (localCart) {
                        try {
                            const localItems: CartItem[] = JSON.parse(localCart);
                            localItems.forEach(localItem => {
                                const existing = mergedCart.find(p => p.sku === localItem.sku);
                                if (existing) {
                                    existing.quantity += localItem.quantity;
                                } else {
                                    mergedCart.push(localItem);
                                }
                            });
                        } catch (error) {
                            console.error('Invalid local cart data');
                            throw error
                        }
                    }

                    dispatch({ type: 'SET_CART', payload: mergedCart });
                    localStorage.removeItem('cart');
                    hasSynced.current = true;
                } catch (err) {
                    console.error('Failed to load cart from DB:', err);
                }
            } else {
                const localCart = localStorage.getItem('cart');
                if (localCart) {
                    try {
                        const parsed = JSON.parse(localCart);
                        dispatch({ type: 'SET_CART', payload: parsed });
                    } catch (error) {
                        console.error('Invalid localStorage cart data');
                        throw error
                    }
                }
            }
        };
        loadCart();
    }, [session]);

    useEffect(() => {
        if (!session?.user) {
            localStorage.setItem('cart', JSON.stringify(state.products));
        }
    }, [state.products, session]);

    // Sync cart with backend on login
    useEffect(() => {
        const syncCart = async () => {
            if (session?.user && state.products.length > 0) {
                try {
                    const payload = state.products.map(p => ({
                        ...p,
                        productId: typeof p.productId === 'object' ? p.productId._id : p.productId
                    }));

                    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
                        credentials: 'include',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });
                } catch (err) {
                    console.error('Failed to sync cart to DB:', err);
                }
            }
        };

        syncCart();
    }, [session?.user, state.products]);


    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartContextProvider');
    return ctx;
};
