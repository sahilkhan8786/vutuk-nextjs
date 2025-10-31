// types/email.ts
export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

export type RawOrderItem = {
    productName?: string;
    quantity: number;
    price: number;
};


export interface OrderEmailProps {
    name: string;
    orderId: string;
    amount: number;
    items: OrderItem[];
}

export interface AdminOrderEmailProps extends OrderEmailProps {
    customerEmail: string;
}
