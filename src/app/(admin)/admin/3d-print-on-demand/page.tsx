import { Button } from '@/components/ui/button';
import { headers } from 'next/headers'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

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

    // ✅ New fields for dimensions
    length?: number;
    breadth?: number;
    height?: number;
    dimensionUnit?: string;
    customRequest?: boolean;
};

async function getOrders() {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") ?? '';

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests?isCustomOrderRequest=true`, {
        headers: {
            cookie: cookieHeader,
        }
    });

    const json = await res.json();
    return json.data.requests as Order[];
}

const Admin3DPrintOnDeamandOrdersPage = async () => {
    const orders = await getOrders();
    console.log(orders)


    return (
        <>
            <h1 className='text-4xl font-semibold uppercase bg-white rounded-xl p-4'>My Orders</h1>


            <div className='grid grid-cols-1 gap-4 my-6 '>
                {
                    orders.map(order => (

                        <div key={order._id} className='bg-white rounded-xl p-4'>
                            <div className='flex justify-between'>

                                <span> <strong>Order Id:&nbsp;</strong>{order._id}</span>
                                {order.customRequest && (
                                    <span className='bg-green-400 text-green-900 rounded-xl px-3'>Custom Request</span>
                                )}
                            </div>

                            <div className='flex items-center justify-between mt-4'>
                                <Image
                                    src={'https://i.etsystatic.com/59876780/r/il/d0a4be/6918944986/il_794xN.6918944986_bfnz.jpg'}
                                    alt='Product Image'
                                    width={80}
                                    height={80}
                                    className='rounded-xl'
                                />

                                <p>{order.material}_{order.color}</p>

                                <p>PRICE</p>


                                <Link href={`/admin/3d-print-on-demand/${order._id}`}>
                                    <Button>Track Order</Button>
                                </Link>



                            </div>

                        </div>



                    ))
                }

            </div>
        </>
    )
}

export default Admin3DPrintOnDeamandOrdersPage