'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl
} from '@/components/ui/form'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const VALID_STATUSES = [
    "Request Submitted",
    "Under Verification",
    "Quotation Generated",
    "In Production",
    "Out for Delivery",
    "Delivered",
] as const;

type Product = {
    _id: string;
    title: string;
    images: string[];
    sku: string[];
};


type OrderItem = {
    product: Product;
    variants: {
        quantity: number;
        color: string;
    }[];
};

type StatusStep = typeof VALID_STATUSES[number];
type User = {
    _id: string;
    name: string;
    email: string;
    password: string;
    emailVerified: boolean;
    image: string | null;
    provider: string;
    phoneVerified: boolean;
    role: 'user' | 'admin'; // if you have fixed roles
    addressCount: number;
};
type Order = {
    _id: string;
    items: OrderItem[];
    addressId: Address;
    status: StatusStep;
    userId: string | User;
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

    price?: number;
    youtubeLink?: string;
    trackingId?: string;
    verificationImageUrl?: string;

    length?: number;
    breadth?: number;
    height?: number;
    dimensionUnit?: 'mm' | 'cm' | 'in' | string;
};



type Address = {
    requestId: string
    firstName?: string;
    lastName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    email?: string;
    phoneCode?: string;
    phoneNumber?: string;
    pincode?: string;


}



const AdminSingleOrderPage = () => {
    const pathname = usePathname();
    const id = pathname.split('/').at(-1)

    const [order, setOrders] = useState<Order>({} as Order);
    const [loading, setLoading] = useState(true);
    const form = useForm();
    const [statusUpdates, setStatusUpdates] = useState<Record<string, StatusStep>>({});

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/orders/${id}`, {
                credentials: 'include'
            });
            const data = await res.json();
            console.log(data)
            setOrders(data.data.orders);
            console.log(data.data.orders)
        };


        fetchOrders();
        setLoading(false);
    }, [id]);


    const handleFieldUpdate = async (orderId: string, updatedData: Partial<Order>) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/orders/${orderId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (res.ok) {
            setOrders(order => ({ ...order, ...updatedData }));
        } else {
            alert('Failed to update order');
        }
    };

    const handleStatusChange = (orderId: string, status: StatusStep) => {
        setStatusUpdates(prev => ({
            ...prev,
            [orderId]: status
        }));
    };

    const handleStatusUpdate = async (orderId: string) => {
        const newStatus = statusUpdates[orderId];
        if (!newStatus) return;

        // const finalOrder = order.find(o => o._id === orderId);
        // if (!finalOrder) return;

        const fullOrderPayload: Partial<Order> = {
            ...order,
            status: newStatus,
        };

        await handleFieldUpdate(orderId, fullOrderPayload);

        setStatusUpdates(prev => {
            const newUpdates = { ...prev };
            delete newUpdates[orderId];
            return newUpdates;
        });
    };



    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin" />
            </div>
        );
    }
    console.log(order)

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Order ID: {order._id}</h1>

            <div key={order._id} className="border p-4 rounded-md shadow-sm space-y-4">

                <Form {...form} >

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

                        <FormField
                            name="status"
                            render={() => (
                                <FormItem className='w-full'>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        defaultValue={order.status}

                                        onValueChange={(value) =>
                                            handleStatusChange(order._id, value as StatusStep)
                                        }
                                    >
                                        <FormControl className='w-full'>
                                            <SelectTrigger>
                                                <SelectValue className="w-full" placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {VALID_STATUSES.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        {/* YouTube Link */}
                        <FormField
                            name="youtubeLink"
                            render={() => (
                                <FormItem>
                                    <FormLabel>YouTube Link</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            onBlur={(e) =>
                                                handleFieldUpdate(order._id, {
                                                    youtubeLink: e.target.value,
                                                })
                                            }
                                            defaultValue={order.youtubeLink}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Tracking ID */}
                        <FormField
                            name="trackingId"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Tracking ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            onBlur={(e) =>
                                                handleFieldUpdate(order._id, {
                                                    trackingId: e.target.value,
                                                })

                                            }
                                            defaultValue={order.trackingId}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Image upload (only if status is 'Under Verification') */}



                        {/* Update Status Button */}
                        <div className="col-span-2">
                            <Button
                                onClick={() => handleStatusUpdate(order._id)}
                                disabled={!statusUpdates[order._id]}
                            >
                                Update Status
                            </Button>
                        </div>
                    </div>

                    {/* ORDERD ITEMS */}
                    {order?.items?.length > 0 && (
                        <>
                            <p className='bg-green-500 text-white p-4 rounded-xl w-fit'>Ordered Items</p>
                            <div>
                                {order.items.map((item, index) => (
                                    <div key={index} className='flex gap-4 my-2 bg-white p-2 rounded-xl'>
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.title}
                                            width={250}
                                            height={250}
                                            className='rounded-xl '
                                        />
                                        <div>

                                            <p className=''>Product SKU:- {item.product.sku.join(',')}</p>

                                            <p>Ordered Color and Qunatity</p>
                                            <p>{item.variants.map((variant, index) => (
                                                <div key={index}>
                                                    quantity: {variant.quantity}, color: {variant.color}
                                                </div>
                                            ))}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                </Form>


                {/* Address Section */}
                {(() => {
                    const userAddress = order.addressId as Address | undefined;
                    const user = order.userId as User; // if TS complains about it being string | object

                    return (
                        <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Address */}
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
                                {userAddress ? (
                                    <div className="text-sm space-y-1">
                                        <p><strong>Name:</strong> {userAddress.firstName} {userAddress.lastName}</p>
                                        <p><strong>Email:</strong> {userAddress.email}</p>
                                        <p><strong>Phone:</strong> {userAddress.phoneCode}-{userAddress.phoneNumber}</p>
                                        <p><strong>Address:</strong> {userAddress.addressLine1}, {userAddress.addressLine2}</p>
                                        <p><strong>City/State:</strong> {userAddress.city}, {userAddress.state}</p>
                                        <p><strong>Country:</strong> {userAddress.country}</p>
                                        <p><strong>Pincode:</strong> {userAddress.pincode}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm italic text-muted-foreground mt-2">No address available for this order.</p>
                                )}
                            </div>

                            {/* User Info */}
                            <div>
                                <h3 className="font-semibold text-lg mb-2">User Info</h3>
                                {typeof user === 'object' && user !== null ? (
                                    <div className="text-sm space-y-1">
                                        <p><strong>Name:</strong> {user.name}</p>
                                        <p><strong>Email:</strong> {user.email}</p>
                                        <p><strong>Role:</strong> {user.role}</p>
                                        <p><strong>Phone Verified:</strong> {user.phoneVerified ? 'Yes' : 'No'}</p>
                                        <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm italic text-muted-foreground mt-2">User details not available.</p>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>



        </div>
    );
};

export default AdminSingleOrderPage;
