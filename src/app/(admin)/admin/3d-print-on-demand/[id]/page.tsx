'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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

const VALID_STATUSES = [
    "Request Submitted",
    "Under Verification",
    "Quotation Generated",
    "In Production",
    "Out for Delivery",
    "Delivered",
] as const;

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

    // Dimensions
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
    const [orders, setOrders] = useState<Order[]>([]);
    const [address, setAddress] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const form = useForm()
    const [statusUpdates, setStatusUpdates] = useState<Record<string, StatusStep>>({});

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests`, {
                credentials: 'include'
            });
            const data = await res.json();
            console.log("Orders", data)
            setOrders(data.data.requests);
        };
        const fetchAddress = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/address`, {
                credentials: 'include'
            });

            const data = await res.json()
            console.log("ADDRESS", data)
            setAddress(data.data.addresses)
        }

        fetchOrders();
        fetchAddress();
        setLoading(false);
    }, []);

    const handleFieldUpdate = async (orderId: string, updatedData: Partial<Order>) => {
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

    const handleStatusChange = (orderId: string, status: StatusStep) => {
        setStatusUpdates(prev => ({
            ...prev,
            [orderId]: status
        }));
    };

    const handleStatusUpdate = async (orderId: string) => {
        const newStatus = statusUpdates[orderId];
        if (!newStatus) return;

        const order = orders.find(o => o._id === orderId);
        if (!order) return;

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
    console.log(orders)

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Manage 3D Print Orders</h1>
            {orders.map(order => (
                <div key={order._id} className="border p-4 rounded-md shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
                    <Button asChild>
                        <a href={order.modelFileUrl} target="_blank" rel="noopener noreferrer">
                            Download the model
                        </a>
                    </Button>

                    <Form {...form} >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Material */}
                            <FormField
                                name="material"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Material</FormLabel>
                                        <FormControl>
                                            <Input
                                                defaultValue={order.material}
                                                onBlur={(e) =>
                                                    handleFieldUpdate(order._id, { material: e.target.value })
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Color */}
                            <FormField
                                name="color"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <Input
                                                defaultValue={order.color}
                                                onBlur={(e) =>
                                                    handleFieldUpdate(order._id, { color: e.target.value })
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Priority */}
                            <FormField
                                name="priority"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <FormControl>
                                            <Input
                                                defaultValue={order.priority}
                                                onBlur={(e) =>
                                                    handleFieldUpdate(order._id, { priority: e.target.value })
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Notes */}
                            <FormField
                                name="notes"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                defaultValue={order.notes}
                                                onBlur={(e) =>
                                                    handleFieldUpdate(order._id, { notes: e.target.value })
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Quantity */}
                            <FormField
                                name="quantity"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                defaultValue={order.quantity}
                                                onBlur={(e) =>
                                                    handleFieldUpdate(order._id, {
                                                        quantity: parseInt(e.target.value),
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Status */}
                            <FormField
                                name="status"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(value) =>
                                                handleStatusChange(order._id, value as StatusStep)
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
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

                            {/* Price */}
                            <FormField
                                name="price"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                onBlur={(e) =>
                                                    handleFieldUpdate(order._id, {
                                                        price: parseFloat(e.target.value),
                                                    })
                                                }
                                            />
                                        </FormControl>
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
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Image upload (only if status is 'Under Verification') */}

                            <FormField
                                name="verificationImage"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Verification Image</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                            // Optional: Add logic here to upload or preview the file
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Dimensions - Length */}
                            <FormField
                                name="length"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Length</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                defaultValue={order.length}
                                                onBlur={(e) =>
                                                    handleFieldUpdate(order._id, {
                                                        length: parseFloat(e.target.value),
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Dimensions - Breadth */}
                            <FormField
                                name="breadth"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Breadth</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                defaultValue={order.breadth}
                                                onBlur={(e) =>
                                                    handleFieldUpdate(order._id, {
                                                        breadth: parseFloat(e.target.value),
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Dimensions - Height */}
                            <FormField
                                name="height"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Height</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                defaultValue={order.height}
                                                onBlur={(e) =>
                                                    handleFieldUpdate(order._id, {
                                                        height: parseFloat(e.target.value),
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Dimension Unit */}
                            <FormField
                                name="dimensionUnit"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Dimension Unit</FormLabel>
                                        <FormControl>
                                            <Input
                                                defaultValue={order.dimensionUnit || ''}
                                                placeholder="e.g. mm, cm, in"
                                                onBlur={(e) =>
                                                    handleFieldUpdate(order._id, {
                                                        dimensionUnit: e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />


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

                    </Form>


                    {/* Address Section */}
                    {(() => {
                        const userAddress = address.find(addr => addr.requestId === order._id);
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
            ))}


        </div>
    );
};

export default AdminSingleOrderPage;
