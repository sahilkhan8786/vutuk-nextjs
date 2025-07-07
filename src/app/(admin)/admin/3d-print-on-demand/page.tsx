'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

const VALID_STATUSES = [
    "Request Submitted",
    "Under Verification",
    "Quotation Generated",
    "In Production",
    "Out for Delivery",
    "Delivered",
] as const;

type StatusStep = typeof VALID_STATUSES[number];

type Order = {
    _id: string;
    status: StatusStep;
    userId: string;
    color: string;
    createdAt: string;
    isBusiness: boolean;
    material: string;
    modelFileUrl: string;
    notes: string;
    otherColor: string;
    otherMaterial: string;
    otherPriority: string;
    priority: string;
    quantity: number;
    gstOrFirm?: string;
};

const Admin3dPrintOnDemandPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests`, {
                credentials: 'include'
            });
            const data = await res.json();
            setOrders(data.data.requests);
            setLoading(false);
        };

        fetchOrders();
    }, []);

    const handleUpdate = async (orderId: string, updatedData: Partial<Order>) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/${orderId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (res.ok) {
            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId ? { ...order, ...updatedData } : order
                )
            );
        } else {
            alert('Failed to update order');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Manage 3D Print Orders</h1>
            {orders.map(order => (
                <div key={order._id} className="border p-4 rounded-md shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">Material</label>
                            <input
                                type="text"
                                defaultValue={order.material}
                                onBlur={(e) =>
                                    handleUpdate(order._id, { material: e.target.value })
                                }
                                className="border px-2 py-1 w-full rounded"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Color</label>
                            <input
                                type="text"
                                defaultValue={order.color}
                                onBlur={(e) =>
                                    handleUpdate(order._id, { color: e.target.value })
                                }
                                className="border px-2 py-1 w-full rounded"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Priority</label>
                            <input
                                type="text"
                                defaultValue={order.priority}
                                onBlur={(e) =>
                                    handleUpdate(order._id, { priority: e.target.value })
                                }
                                className="border px-2 py-1 w-full rounded"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Notes</label>
                            <textarea
                                defaultValue={order.notes}
                                onBlur={(e) =>
                                    handleUpdate(order._id, { notes: e.target.value })
                                }
                                className="border px-2 py-1 w-full rounded"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Quantity</label>
                            <input
                                type="number"
                                defaultValue={order.quantity}
                                onBlur={(e) =>
                                    handleUpdate(order._id, { quantity: parseInt(e.target.value) })
                                }
                                className="border px-2 py-1 w-full rounded"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Status</label>
                            <select
                                defaultValue={order.status}
                                onChange={(e) =>
                                    handleUpdate(order._id, { status: e.target.value as StatusStep })
                                }
                                className="border px-2 py-1 w-full rounded"
                            >
                                {VALID_STATUSES.map(status => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Admin3dPrintOnDemandPage;
