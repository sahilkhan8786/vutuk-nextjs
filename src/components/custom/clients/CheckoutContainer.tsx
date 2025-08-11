'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useCart } from '@/context/cart-context';

// ✅ Declare Razorpay type so TS doesn't complain
declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

// ✅ Cart item type
interface Variant {
    color: string;
    quantity: number;
}

interface Product {
    _id: string;
    title: string;
    price: number;
}

interface CartItem {
    product: Product;
    variants: Variant[];
}

// ✅ Razorpay types
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: {
        name: string;
        email: string;
        contact: string;
    };
    theme?: { color: string };
}

interface RazorpayInstance {
    open: () => void;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

const CheckoutContainer: React.FC = () => {
    const { cart } = useCart() as { cart: CartItem[] };

    // Calculate totals
    const totalQuantity = cart.reduce(
        (acc, item) =>
            acc + item.variants.reduce((sum, variant) => sum + variant.quantity, 0),
        0
    );

    const totalPrice = cart.reduce(
        (acc, item) =>
            acc +
            item.variants.reduce(
                (sum, variant) => sum + item.product.price * variant.quantity,
                0
            ),
        0
    );

    const shippingCost = 1800 + (totalQuantity > 1 ? (totalQuantity - 1) * 500 : 0);
    const orderAmount = totalPrice + shippingCost;

    const handleCheckout = async () => {
        const res = await fetch('/api/razorpay/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: orderAmount }),
        });

        const order = await res.json();
        if (!order.id) {
            alert('Failed to create order');
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '',
                amount: order.amount,
                currency: 'INR',
                name: 'Your Store',
                description: 'Order Payment',
                order_id: order.id,
                handler: async function (response: RazorpayResponse) {
                    const verifyRes = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(response),
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        alert('✅ Payment Successful!');
                    } else {
                        alert('❌ Payment verification failed!');
                    }
                },
                prefill: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    contact: '9999999999',
                },
                theme: { color: '#3399cc' },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        };
        document.body.appendChild(script);
    };

    const [coupon, setCoupon] = useState<string>('');
    const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('appliedCoupons');
        if (stored) {
            setAppliedCoupons(JSON.parse(stored));
        }
    }, []);

    const handleApplyCoupon = () => {
        const trimmed = coupon.trim();
        if (!trimmed || appliedCoupons.includes(trimmed)) return;
        const updatedCoupons = [...appliedCoupons, trimmed];
        setAppliedCoupons(updatedCoupons);
        localStorage.setItem('appliedCoupons', JSON.stringify(updatedCoupons));
        setCoupon('');
    };

    const handleRemoveCoupon = (code: string) => {
        const updatedCoupons = appliedCoupons.filter((c) => c !== code);
        setAppliedCoupons(updatedCoupons);
        localStorage.setItem('appliedCoupons', JSON.stringify(updatedCoupons));
    };

    return (
        <>
            {/* Desktop */}
            <div className="hidden xl:block">
                <Card className="w-full max-w-md mx-auto border rounded-xl shadow-sm bg-secondary">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Product List */}
                        <div className="space-y-3">
                            <div className="flex w-full border-b pb-2">
                                <p className="flex-2">Item</p>
                                <p className="flex-1 text-right">Qty.</p>
                                <p className="flex-1 text-right">Amount</p>
                            </div>
                            {cart.map((item) => (
                                <div key={item.product._id}>
                                    <div className="flex justify-between text-sm">
                                        <span className="flex-2 w-full">
                                            {item.product.title.slice(0, 35)}...
                                        </span>
                                        <span className="flex-1 text-right">
                                            {item.variants.reduce((sum, v) => sum + v.quantity, 0)}
                                        </span>
                                        <span className="flex-1 text-right">
                                            ₹
                                            {item.variants
                                                .reduce(
                                                    (sum, v) => sum + item.product.price * v.quantity,
                                                    0
                                                )
                                                .toFixed(2)}
                                        </span>
                                    </div>
                                    {item.variants.length > 0 && (
                                        <div className="text-xs text-muted-foreground pl-2">
                                            {item.variants.map((variant, idx) => (
                                                <div key={idx}>
                                                    {variant.color}: {variant.quantity}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Separator />

                        {/* Price Breakdown */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-base">
                                <span>Order Total</span>
                                <span>
                                    ₹{(totalPrice + shippingCost).toFixed(2)}
                                    <sub className="font-normal block text-xs text-muted-foreground">
                                        Taxes Included
                                    </sub>
                                </span>
                            </div>
                        </div>

                        {/* Coupon Input */}
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter coupon code"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                            />
                            <Button variant="outline" onClick={handleApplyCoupon}>
                                Apply
                            </Button>
                        </div>

                        {/* Applied Coupons */}
                        {appliedCoupons.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {appliedCoupons.map((code) => (
                                    <Badge
                                        key={code}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        {code}
                                        <X
                                            size={14}
                                            className="cursor-pointer z-50"
                                            onClick={() => handleRemoveCoupon(code)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Checkout Button */}
                        <Button className="w-full" onClick={handleCheckout}>
                            Proceed to Checkout
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-xl flex flex-col gap-3 xl:hidden">
                <div className="flex justify-between items-center font-semibold text-base">
                    <span>Total ({totalQuantity} items)</span>
                    <span>₹{(totalPrice + shippingCost).toFixed(2)}</span>
                </div>

                {/* Coupon Input */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleApplyCoupon}>
                        Apply
                    </Button>
                </div>

                {/* Applied Coupons */}
                {appliedCoupons.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {appliedCoupons.map((code) => (
                            <Badge
                                key={code}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {code}
                                <X
                                    size={14}
                                    className="cursor-pointer"
                                    onClick={() => handleRemoveCoupon(code)}
                                />
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Checkout Button */}
                <Button className="w-full" onClick={handleCheckout}>
                    Checkout
                </Button>
            </div>
        </>
    );
};

export default CheckoutContainer;
