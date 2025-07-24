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

// 2. Use type in state
const ShowAddress = () => {
    const [addresses, setAddresses] = useState<AddressType[]>([]);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/address`, {
                    credentials: 'include',
                });

                const json: {
                    data?: {
                        addresses?: AddressType[];
                    };
                } = await res.json();

                setAddresses(json.data?.addresses || []);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddress();
    }, []);

    return (
        <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Saved Addresses</h3>

            {addresses.length === 0 ? (
                <p>No addresses found.</p>
            ) : (
                addresses.map((address) => (
                    <div key={address._id} className="mb-4 p-4 border rounded shadow-sm">
                        <div className="font-medium">
                            {address.firstName} {address.lastName}
                        </div>
                        <div>{address.addressLine1}</div>
                        <div>
                            {address.state}, {address.country}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ShowAddress;
