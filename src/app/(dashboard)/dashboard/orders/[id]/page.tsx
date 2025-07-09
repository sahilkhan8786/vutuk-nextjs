import { headers } from 'next/headers';
import React from 'react'

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { OrderStatusTracker } from '@/components/custom/requests/OrderStatusTracker';

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
};



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


async function getOrders(id: string) {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") ?? ""; // ✅ correct and safe

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/${id}`, {
        headers: {
            cookie: cookieHeader,
        }
    });

    const json = await res.json();
    console.log(json)
    return json.data.orders as Order;
}

const DashboardSingleOrderPage = async (
    { params }: { params: Promise<{ id: string }> }
) => {
    const id = (await params).id

    const order = await getOrders(id);
    console.log(order);


    return (
        <>
            {
                <div className="p-4 border rounded-md mb-6">
                    {isValidStatus(order.status) ? (
                        <OrderStatusTracker currentStatus={order.status} />
                    ) : (
                        <div className="text-red-500">Invalid status: {order.status}</div>
                    )}


                    {order.status === 'Request Submitted' && (
                        <>

                            <h2 className='font-semibold text-xl'>Product Details</h2>
                            <div className="mt-4">
                                <p>
                                    <strong>Material:</strong>
                                    {order.material}
                                </p>
                                {order.otherMaterial && <p>
                                    <strong> Other Material :</strong>
                                    {order.otherMaterial}
                                </p>}
                                <p>
                                    <strong>Color:</strong>
                                    {order.color}
                                </p>
                                {order.otherColor && <p>
                                    <strong> Other Color :</strong>
                                    {order.otherColor}
                                </p>}
                                {order.otherPriority && <p>
                                    <strong> Other Color :</strong>
                                    {order.otherPriority}
                                </p>}
                                <p>
                                    <strong> Priority :</strong>
                                    {order.priority}
                                </p>
                                <p>
                                    <strong>Quantity:</strong>
                                    {order.quantity}
                                </p>
                            </div>
                        </>
                    )}
                    {order.status === 'Under Verification' && (
                        <>

                            <h2 className='font-semibold text-xl'>Under Verification</h2>
                            <div className="mt-4">
                                <p> Analysing the 3d model and preparing quotation</p>
                            </div>
                        </>
                    )}
                    {order.status === 'Quotation Generated' && (
                        <>

                            <h2 className='font-semibold text-xl'>Quotation</h2>
                            <div className="mt-4 flex items-center justify-between w-full h-full gap-6">
                                {/*3D PRODUCT IMAGE */}
                                <div className='rounded-xl border p-4 '>

                                    <Image src={order?.image || 'https://i.etsystatic.com/59876780/r/il/d0a4be/6918944986/il_794xN.6918944986_bfnz.jpg'} alt='' width={200} height={200} className=' rounded-xl' />
                                </div>
                                <div className='flex-1 flex items-center justify-center   flex-col gap-6 py-4'>

                                    <p >
                                        <strong>Price: </strong>
                                        {order.price}
                                    </p>
                                    <p>
                                        <strong>Quantity: </strong>
                                        {order.quantity}
                                    </p>

                                    {(order.length || order.breadth || order.height) && (
                                        <div className="text-center text-sm space-y-1">
                                            <p><strong>Dimensions:</strong></p>
                                            <p>
                                                L: {order.length ?? '-'} {order.dimensionUnit || 'mm'},&nbsp;
                                                B: {order.breadth ?? '-'} {order.dimensionUnit || 'mm'},&nbsp;
                                                H: {order.height ?? '-'} {order.dimensionUnit || 'mm'}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        SHOW ADDRESS HERE
                                    </div>
                                    {/* ADD BUTTON TO PAY HERE */}
                                    <Button className='w-full'>Pay</Button>
                                </div>
                            </div>
                        </>
                    )}
                    {order.status === 'In Production' && (
                        <>

                            <h2 className='font-semibold text-xl'>In Production</h2>
                            <div className="mt-4 flex items-center justify-between w-full h-full gap-6">
                                {/*3D PRODUCT IMAGE */}
                                <div className='rounded-xl border p-4 '>

                                    <Image src={order?.image || 'https://i.etsystatic.com/59876780/r/il/d0a4be/6918944986/il_794xN.6918944986_bfnz.jpg'} alt='' width={200} height={200} className=' rounded-xl' />
                                </div>
                                <div className='flex-1 flex items-center justify-center   flex-col gap-6 py-4'>
                                    <h3>You Product is Under Production</h3>
                                    {/* PUT YOUTUBE LINK HERE */}
                                    <a href="#">Watch Live HERE</a>

                                </div>
                            </div>
                        </>
                    )}
                    {order.status === 'Out for Delivery' && (
                        <>

                            <h2 className='font-semibold text-xl'>Out for Delivery</h2>
                            <div className="mt-4 flex items-center justify-between w-full h-full gap-6">
                                {/*3D PRODUCT IMAGE */}
                                <div className='rounded-xl border p-4 '>

                                    <Image src={order?.image || 'https://i.etsystatic.com/59876780/r/il/d0a4be/6918944986/il_794xN.6918944986_bfnz.jpg'} alt='' width={200} height={200} className=' rounded-xl' />
                                </div>
                                <div className='flex-1 flex items-center justify-center   flex-col gap-6 py-4'>
                                    <h3>Your Product is Out for Delivery</h3>
                                    <p>

                                        You can track your product with this

                                        <strong>Delivery Id</strong> : DELIVERY ID HERE
                                    </p>


                                </div>
                            </div>
                        </>
                    )}
                    {order.status === 'Delivered' && (
                        <>

                            <h2 className='font-semibold text-xl'>Your Product is Delivered</h2>
                            <div className="mt-4 flex items-center justify-between w-full h-full gap-6">
                                {/*3D PRODUCT IMAGE */}
                                <div className='rounded-xl border p-4 '>

                                    <Image src={order?.image || 'https://i.etsystatic.com/59876780/r/il/d0a4be/6918944986/il_794xN.6918944986_bfnz.jpg'} alt='' width={200} height={200} className=' rounded-xl' />
                                </div>
                                <div className='flex-1 flex items-center justify-center   flex-col gap-6 py-4'>
                                    <h3>Your Product is Delivered</h3>

                                    <p>
                                        You can rate your experience here

                                    </p>
                                    <Button>Leave a Review</Button>


                                </div>
                            </div>
                        </>
                    )}
                </div>
            }
        </>
    )
}

export default DashboardSingleOrderPage