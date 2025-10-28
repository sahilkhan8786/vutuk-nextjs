'use client';

import { useEffect, useState } from 'react';

// 1. Define the address type
type AddressType = {
    _id: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    state: string;
    country: string;
};

const ShowAddress = () => {
    const [addresses, setAddresses] = useState<AddressType[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAddresses = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/address`, {
                credentials: 'include',
            });
            const json: { data?: { addresses?: AddressType[] } } = await res.json();
            setAddresses(json.data?.addresses || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleDelete = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        setLoading(true);
        try {
            console.log(addressId)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/address/${addressId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.ok) {
                setAddresses((prev) => prev.filter((a) => a._id !== addressId));
            } else {
                console.error('Failed to delete address');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Saved Addresses</h3>

            {addresses.length === 0 ? (
                <p className="text-gray-500">No addresses found.</p>
            ) : (
                addresses.map((address) => (
                    <div key={address._id} className="p-4 border rounded shadow-sm flex justify-between items-start">
                        <div>
                            <div className="font-medium">
                                {address.firstName} {address.lastName}
                            </div>
                            <div>{address.addressLine1}</div>
                            <div>
                                {address.state}, {address.country}
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(address._id)}
                            disabled={loading}
                            className="ml-4 text-red-500 hover:text-red-700 font-semibold"
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default ShowAddress;
