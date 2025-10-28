// types/admin.ts

export interface Payment {
    _id: string
    orderId: string
    paymentId: string
    amount: number
    currency: string
    status: 'captured' | 'failed' | 'pending' | string
    method?: string | null
    email?: string | null
    contact?: string | null
    createdAt: string
}

export interface User {
    _id: string
    name: string
    email: string
    createdAt: string
}

export interface Product {
    _id: string
    name: string
    price: number
    stock: number
}

export interface RechartsPieData {
    name: string
    value: number
    [key: string]: string | number
}

export interface RechartsBarData {
    [key: string]: string | number
}


export interface UserOrder {
    _id: string
    orderId: string
    paymentId: string
    amount: number
    currency: string
    status: 'pending' | 'delivered' | 'failed' | 'cancelled'
    method?: string
    createdAt: string
    products: { name: string; quantity: number; price: number }[]
}

export interface UserPayment {
    _id: string
    orderId: string
    paymentId: string
    amount: number
    currency: string
    status: 'captured' | 'failed' | 'pending'
    method?: string
    createdAt: string
}

export interface UserDashboardData {
    totalOrders: number
    totalSpent: number
    pendingOrders: number
    cancelledOrders: number
    activeSubscriptions?: number
    rewards?: number
    recentOrders: UserOrder[]
    payments: UserPayment[]
}
