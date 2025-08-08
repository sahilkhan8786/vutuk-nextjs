'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useCart } from '@/context/cart-context';

const CheckoutContainer = () => {
    const { cart } = useCart()
    const totalQuantity = cart.reduce((acc, val) => acc + val.quantity, 0) || 0;

    // Dummy cart data for now


    const [coupon, setCoupon] = useState('');
    const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("appliedCoupons");
        if (stored) {
            setAppliedCoupons(JSON.parse(stored));
        }
    }, []);


    const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const handleApplyCoupon = () => {
        const trimmed = coupon.trim();
        if (!trimmed) return;
        if (appliedCoupons.includes(trimmed)) return; // prevent duplicate
        setAppliedCoupons((prev) => [...prev, trimmed]);
        setCoupon('');
    };

    const handleRemoveCoupon = (code: string) => {
        setAppliedCoupons((prev) => prev.filter(c => c !== code));
    };

    return (
        <>
            {/* Desktop / XL+ version */}
            <div className="hidden xl:block">
                <Card className="w-full max-w-md mx-auto border rounded-xl shadow-sm bg-secondary">
                    <CardHeader className=''>
                        <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Product List */}
                        <div className="space-y-3">
                            <div className='flex w-full border-b  pb-2'>
                                <p className='flex-2'>Item</p>
                                <p className='flex-1 items-end  text-right'>Qty.</p>
                                <p className='flex-1 items-end  text-right'>Amount</p>
                            </div>
                            {cart.map((item) => (
                                <div key={item.product._id} className="flex justify-between text-sm">
                                    <span className='flex-2  w-full'>{item.product.title.slice(0, 35)}...  </span>
                                    <span className='flex-1 items-end  text-right'>{item.quantity}</span>
                                    <span className='flex-1 items-end  text-right'>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        {/* Total Price */}
                        <div className="flex justify-between font-semibold text-base">
                            <span className='flex-2'>Order Total</span>
                            <span className='flex-1 text-right'>{totalQuantity}

                            </span>
                            <span className='flex-1 text-right'>₹{totalPrice.toFixed(2)}
                                <sub className='font-normal'>
                                    <p className='text-right text-[8px] '>Taxes Included</p>
                                </sub>

                            </span>
                        </div>
                        <div className="flex justify-between font-semibold text-base">
                            <span>Shiping Charges</span>
                            <span>+ {1800 + ((totalQuantity - 1) * 500)}</span>

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
                                            className="cursor-pointer"
                                            onClick={() => handleRemoveCoupon(code)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Checkout Button */}
                        <Button className="w-full">Proceed to Checkout</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile / Tablet version (<1280px) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-xl flex flex-col gap-3 xl:hidden">
                <div className="flex justify-between items-center font-semibold text-base">
                    <span>Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
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
                <Button className="w-full">Checkout</Button>
            </div>
        </>
    );
};

export default CheckoutContainer;
