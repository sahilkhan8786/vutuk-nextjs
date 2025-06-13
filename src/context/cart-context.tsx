'use client';

import React, {
    createContext,
    useReducer,
    ReactNode,
    useContext,
} from 'react';

// Define cart item structure
interface CartItem {
    sku: string;
    quantity: number;
}

// Define state structure
interface CartState {
    totalItem: number;
    products: CartItem[];
}

// Define action types
type CartAction =
    | { type: 'ADD_TO_CART'; payload: { sku: string } }
    | { type: 'REMOVE_FROM_CART'; payload: { sku: string } }
    | { type: 'UPDATE_QUANTITY'; payload: { sku: string; quantity: number } };

// Initial cart state
const cartInitialValue: CartState = {
    totalItem: 0,
    products: [],
};

// Reducer logic
const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existing = state.products.find(
                (item) => item.sku === action.payload.sku
            );
            if (existing) {
                // Already exists, increase quantity
                return {
                    ...state,
                    products: state.products.map((item) =>
                        item.sku === action.payload.sku
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                    totalItem: state.totalItem + 1,
                };
            } else {
                // Add new item
                return {
                    ...state,
                    products: [...state.products, { sku: action.payload.sku, quantity: 1 }],
                    totalItem: state.totalItem + 1,
                };
            }
        }

        case 'REMOVE_FROM_CART': {
            const removedItem = state.products.find(
                (item) => item.sku === action.payload.sku
            );
            if (!removedItem) return state;

            return {
                ...state,
                products: state.products.filter((item) => item.sku !== action.payload.sku),
                totalItem: state.totalItem - removedItem.quantity,
            };
        }

        case 'UPDATE_QUANTITY': {
            return {
                ...state,
                products: state.products
                    .map((item) =>
                        item.sku === action.payload.sku
                            ? { ...item, quantity: action.payload.quantity }
                            : item
                    )
                    .filter((item) => item.quantity > 0),
                totalItem: state.products.reduce(
                    (acc, item) =>
                        item.sku === action.payload.sku
                            ? acc + action.payload.quantity
                            : acc + item.quantity,
                    0
                ),
            };
        }

        default:
            return state;
    }
};

// Context type
interface CartContextType {
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
}

// Create context
const CartsContext = createContext<CartContextType | undefined>(undefined);

// Provider
export const CartContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, cartInitialValue);

    return (
        <CartsContext.Provider value={{ state, dispatch }}>
            {children}
        </CartsContext.Provider>
    );
};

// Optional: hook for easier usage
export const useCart = (): CartContextType => {
    const context = useContext(CartsContext);
    if (!context) {
        throw new Error('useCart must be used within a CartContextProvider');
    }
    return context;
};
