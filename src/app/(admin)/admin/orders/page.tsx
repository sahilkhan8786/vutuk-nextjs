// app/dashboard/admin/orders/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Order = {
    _id: string;
    status: string;
    userId: string;
    price: number;
    youtubeLink: string;
    trackingId: string;
    trackingLink?: string;
    totalAmount?: number;
};

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests`,
            {
                credentials: 'include'
            }
        )
            .then(res => res.json())
            .then(data => setOrders(data.data.requests));
    }, []);

    const handleUpdate = async (orderId: string, field: string, value: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/${orderId}`, {
            method: "PATCH",
            body: JSON.stringify({ [field]: value }),
            headers: { "Content-Type": "application/json" },
        });
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, [field]: value } : o));
    };

    console.log(orders)
    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold mb-6">Admin Orders</h1>
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order._id} className="p-4 border rounded-xl">
                        <p><strong>Order ID:</strong> {order._id}</p>
                        <p><strong>Price:</strong>
                            <input type="number" defaultValue={order.totalAmount} onBlur={e => handleUpdate(order._id, "price", e.target.value)} />

                        </p>
                        <p><strong>Status:</strong>
                            <select defaultValue={order.status} onChange={e => handleUpdate(order._id, "status", e.target.value)}>
                                {["Request Submitted", "Under Verification", "Quotation Generated", "In Production", "Out for Delivery", "Delivered"].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </p>
                        <p><strong>YouTube Link:</strong>
                            <input type="text" defaultValue={order.youtubeLink} onBlur={e => handleUpdate(order._id, "youtubeLink", e.target.value)} />
                        </p>
                        <p><strong>Tracking ID:</strong>
                            <input type="text" defaultValue={order.trackingId} onBlur={e => handleUpdate(order._id, "trackingId", e.target.value)} />
                        </p>
                        <p><strong>Tracking Link:</strong>
                            <input type="text" defaultValue={order.trackingLink} onBlur={e => handleUpdate(order._id, "trackingLink", e.target.value)} />
                        </p>
                        <Link href={`/admin/orders/${order._id}`}>
                            <Button>View Order</Button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrdersPage;
