'use client';

import React, {
    createContext,
    useReducer,
    useContext,
    useEffect,
    ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import type { CartItem } from '@/types/carts';

interface CartState {
    totalItem: number;
    products: CartItem[];
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: { sku: string } }
    | { type: 'REMOVE_ONE_FROM_CART'; payload: { sku: string } } // <-- new action
    | { type: 'UPDATE_QUANTITY'; payload: { sku: string; quantity: number } }
    | { type: 'SET_CART'; payload: CartItem[] }
    | { type: 'TOGGLE_SAVE_FOR_LATER'; payload: { sku: string } }
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
                            ? { ...p, quantity: p.quantity + action.payload.quantity }
                            : p
                    ),
                    totalItem: state.totalItem + action.payload.quantity,
                };
            }
            return {
                ...state,
                products: [...state.products, action.payload],
                totalItem: state.totalItem + action.payload.quantity,
            };
        }

        case 'REMOVE_ONE_FROM_CART': {
            const item = state.products.find(p => p.sku === action.payload.sku);
            if (!item) return state;

            if (item.quantity === 1) {
                // Remove the item completely
                return {
                    ...state,
                    products: state.products.filter(p => p.sku !== action.payload.sku),
                    totalItem: state.totalItem - 1,
                };
            }

            // Decrease quantity by 1
            return {
                ...state,
                products: state.products.map(p =>
                    p.sku === action.payload.sku ? { ...p, quantity: p.quantity - 1 } : p
                ),
                totalItem: state.totalItem - 1,
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
            return {
                ...state,
                products: state.products
                    .map(p =>
                        p.sku === action.payload.sku
                            ? { ...p, quantity: action.payload.quantity }
                            : p
                    )
                    .filter(p => p.quantity > 0),
                totalItem: state.products.reduce((total, p) =>
                    p.sku === action.payload.sku
                        ? total + action.payload.quantity
                        : total + p.quantity, 0),
            };
        }

        case 'TOGGLE_SAVE_FOR_LATER': {
            return {
                ...state,
                products: state.products.map(p =>
                    p.sku === action.payload.sku
                        ? { ...p, isSavedForLater: !p.isSavedForLater }
                        : p
                ),
            };
        }

        case 'SET_CART':
            return {
                totalItem: action.payload.reduce((sum, p) => sum + p.quantity, 0),
                products: action.payload,
            };

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

    useEffect(() => {
        const loadCart = async () => {
            if (session?.user) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
                    credentials: 'include',
                });
                const json = await res.json();
                dispatch({ type: 'SET_CART', payload: json?.data?.products || [] });
            } else {
                const localCart = localStorage.getItem('cart');
                if (localCart) {
                    dispatch({ type: 'SET_CART', payload: JSON.parse(localCart) });
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

    useEffect(() => {
        const syncCart = async () => {
            if (session?.user && state.products.length > 0) {
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(state.products),
                });
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
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used inside CartContextProvider');
    return context;
};
