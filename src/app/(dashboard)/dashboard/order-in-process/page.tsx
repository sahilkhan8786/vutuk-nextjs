import { headers } from 'next/headers';
import React from 'react'
import { OrderStatusTracker } from '../../../../components/custom/requests/OrderStatusTracker';


type Order = {
    _id: string;
    status: string;
    userId: string;
    color: string;
    createdAt: Date;
    isBusiness: boolean;
    material: string;
    modelFileUrl: string;
    notes: string;
    otherColor: string;
    otherMaterial: string;
    otherPriority: string;
    priority: string;
    quantity: string;
}


const VALID_STATUSES = [
    "Request Submitted",
    "Under Verification",
    "Quotation Generated",
    "In Production",
    "Out for Delivery",
    "Delivered",
] as const;

type StatusStep = typeof VALID_STATUSES[number];

function isValidStatus(status: string): status is StatusStep {
    return VALID_STATUSES.includes(status as StatusStep);
}


export async function getOrders() {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") ?? ""; // ✅ correct and safe

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests`, {
        headers: {
            cookie: cookieHeader,
        },
        cache: "no-store",
    });

    const json = await res.json();
    return json.data.requests as Order[];
}

const UserOrderInProcessPage = async () => {

    const requests = await getOrders()
    console.log(requests)


    return (
        <>
            {requests?.map((order) => (
                <div key={order._id} className="p-4 border rounded-md mb-6">
                    {isValidStatus(order.status) ? (
                        <OrderStatusTracker currentStatus={order.status} />
                    ) : (
                        <div className="text-red-500">Invalid status: {order.status}</div>
                    )}

                    <h2 className='font-semibold text-xl'>Product Details</h2>
                    <div className="mt-4">
                        <p><strong>Material:</strong> {order.material}</p>
                        <p><strong>Color:</strong> {order.color}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                    </div>
                </div>
            ))}
        </>
    )
}

export default UserOrderInProcessPage