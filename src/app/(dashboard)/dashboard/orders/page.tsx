import DeliveryTrackButton from '@/components/custom/DeliveryTrackButton';
import { headers } from 'next/headers';
import Image from 'next/image';
import React from 'react';
import { WatchLive } from './WatchLive';

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
    image: string;
    price: number;
    youtubeLink: string;
    trackingId: string;
    trackingLink?: string;
    addressId?: string;
    items: [];
    totalAmount: number;

    // ✅ Dimensions
    length?: number;
    breadth?: number;
    height?: number;
    dimensionUnit?: string;
    customRequest?: boolean;
};

async function getOrders() {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") ?? "";

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests`, {
        headers: { cookie: cookieHeader },
    });

    const json = await res.json();
    console.log(json)
    return json.data.requests as Order[];
}

const UserOrdersPage = async () => {
    const orders = await getOrders();

    return (
        <>
            <h1 className='text-4xl font-semibold uppercase bg-white rounded-xl p-4'>My Orders</h1>

            <div className='grid grid-cols-1 gap-4 my-6'>
                {orders.map(order => (
                    <div key={order._id} className='bg-white rounded-xl p-4'>
                        <div className='flex justify-between'>
                            <span><strong>Order Id: </strong>{order._id}</span>

                        </div>

                        <div className='flex items-center justify-between mt-4'>
                            <Image
                                src={order.image || 'https://i.etsystatic.com/59876780/r/il/d0a4be/6918944986/il_794xN.6918944986_bfnz.jpg'}
                                alt='Product Image'
                                width={80}
                                height={80}
                                className='rounded-xl'
                            />

                            <div>
                                <p>
                                    Total Items:- {order.items.length} <br />
                                    Total Amount:- {order.totalAmount}/- <br />

                                </p>
                            </div>

                            <div>
                                {order.status === 'Out for Delivery'
                                    ? <DeliveryTrackButton trackingId={order.trackingId} />
                                    : <p>{order.status}</p>
                                }
                                {order.status === "In Production" && <WatchLive youtubeLink={order.youtubeLink} />}


                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default UserOrdersPage;
