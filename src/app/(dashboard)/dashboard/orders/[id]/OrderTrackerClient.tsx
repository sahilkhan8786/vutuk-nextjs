// OrderTrackerClient.tsx (Client Component)
"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { OrderStatusTracker } from "@/components/custom/requests/OrderStatusTracker";

interface Props {
    order: any; // you can keep typing stricter
}

const OrderTrackerClient: React.FC<Props> = ({ order }) => {
    return (
        <>
            <OrderStatusTracker currentStatus={order.status} />

            {order.status === "Quotation Generated" && (
                <div className="mt-4 flex gap-6">
                    <Image
                        src={order.image || 'https://i.etsystatic.com/59876780/r/il/d0a4be/6918944986/il_794xN.6918944986_bfnz.jpg'}
                        alt=""
                        width={200}
                        height={200}
                        className="rounded-xl"
                    />
                    <div className="flex-1 flex flex-col gap-2">
                        <p><strong>Price:</strong> {order.price}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                        {order.length && order.breadth && order.height && (
                            <p>Dimensions: {order.length} x {order.breadth} x {order.height} {order.dimensionUnit || 'mm'}</p>
                        )}
                        <p><strong>Address ID:</strong> {order.addressId}</p>
                        <Button className="w-full">Pay</Button>
                    </div>
                </div>
            )}

            {/* Other status blocks (In Production, Out for Delivery) similarly */}
        </>
    );
};

export default OrderTrackerClient;
