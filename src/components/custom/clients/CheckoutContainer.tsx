"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import AuthFormWrapper, { AuthDialogHandle } from "../auth/AuthFormWrapper";
import { useRouter } from "next/navigation";
import AddAddressFormWrapper from "../dashboard/wrappers/AddAddressFormWrapper";


declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface CheckoutContainerProps {
    isIndianUser: boolean;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: { name: string; email: string; contact: string };
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

interface AddressType {
    _id: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    phoneNumber: string;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ isIndianUser }) => {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const { data: session } = useSession();

    const authDialogRef = useRef<AuthDialogHandle>(null);

    const [addresses, setAddresses] = useState<AddressType[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);

    // ✅ Currency helpers
    const currencySymbol = isIndianUser ? "₹" : "$";
    const currencyCode = isIndianUser ? "INR" : "USD";

    const totalQuantity = cart.reduce(
        (acc, item) => acc + item.variants.reduce((sum, v) => sum + v.quantity, 0),
        0
    );
    const totalPrice = cart.reduce(
        (acc, item) =>
            acc +
            item.variants.reduce(
                (sum, v) =>
                    sum + (isIndianUser ? item.product.price : item.product.priceInUSD) * v.quantity,
                0
            ),
        0
    );

    const shippingCost = isIndianUser
        ? 0 // Free shipping for Indian users
        : 20 + (totalQuantity > 1 ? (totalQuantity - 1) * 5 : 0); // Example for international users


    const orderAmount = totalPrice + shippingCost;

    useEffect(() => {
        setFinalAmount(orderAmount - discount);
    }, [orderAmount, discount]);

    // ✅ Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await fetch("/api/address", {
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.status === "success") {
                    setAddresses(data.data.addresses);
                    if (data.data.addresses.length > 0) {
                        setSelectedAddressId(data.data.addresses[0]._id);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchAddresses();
    }, []);

    const handleApplyCoupon = async () => {
        if (!coupon.trim()) return;

        try {
            const res = await fetch("/api/coupons/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: coupon.trim(), orderAmount }),
            });

            const data = await res.json();
            if (!data.success) {
                toast.error(data.message || "Invalid coupon");
                return;
            }

            setAppliedCoupon(coupon.trim());
            setDiscount(data.discount);
            setFinalAmount(data.finalAmount);
            toast.success("Coupon applied successfully!");
            setCoupon("");
        } catch (err) {
            toast.error("Failed to verify coupon");
            console.log(err)
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscount(0);
        setFinalAmount(orderAmount);
        toast.info("Coupon removed");
    };

    const handleCheckout = async () => {
        if (!session) {
            toast.error("Please login to continue checkout");
            authDialogRef.current?.open();
            return;
        }

        if (!selectedAddressId) {
            toast.error("Please select or add an address before checkout");
            return;
        }

        // Create Razorpay order on backend
        const res = await fetch("/api/razorpay/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                couponCode: appliedCoupon,
                currency: currencyCode,
                addressId: selectedAddressId, // ✅ send selected address
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.error || "Order creation failed");
            return;
        }

        const { order } = await res.json();
        if (!order.id) {
            alert("Failed to create order");
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
                amount: order.amount,
                currency: currencyCode,
                name: "Vutuk Store",
                description: "Order Payment",
                order_id: order.id,
                handler: async function (response: RazorpayResponse) {
                    // ✅ include addressId and customOrderData when verifying
                    const verifyRes = await fetch("/api/razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...response,
                            addressId: selectedAddressId,
                            // optional: include custom order data for 3D prints
                            // customOrderData: { material, color, quantity, length, breadth, height, dimensionUnit, isBusiness, notes, ... }
                        }),
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        toast.success("✅ Payment Successful! Order placed.");
                        clearCart();
                        router.push("/");
                    } else {
                        alert("❌ Payment verification failed!");
                    }
                },
                prefill: {
                    name: session.user.name || "",
                    email: session.user.email || "",
                    contact: session.user.phone || "",
                },
                theme: { color: "#3399cc" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        };
        document.body.appendChild(script);
    };


    return (
        <>
            <AuthFormWrapper ref={authDialogRef} />

            <Card className="w-full max-w-md mx-auto border rounded-xl shadow-sm bg-secondary">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Address Selection */}
                    <div className="space-y-2">
                        <p className="font-semibold">Select Delivery Address:</p>
                        {addresses.length > 0 ? (
                            <div className="space-y-1">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr._id}
                                        className={`p-2 border rounded cursor-pointer ${selectedAddressId === addr._id ? "border-blue-500 bg-blue-50" : ""
                                            }`}
                                        onClick={() => setSelectedAddressId(addr._id)}
                                    >
                                        <p>{addr.firstName} {addr.lastName}</p>
                                        <p>{addr.addressLine1}, {addr.addressLine2}</p>
                                        <p>{addr.city}, {addr.state}, {addr.country} - {addr.pinCode}</p>
                                        <p>Phone: {addr.phoneNumber}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No saved addresses found.</p>
                        )}

                        {/* Add new address button */}
                        <AddAddressFormWrapper
                            trigger={
                                <Button variant="outline" size="sm">
                                    {addresses.length > 0 ? "Add Another Address" : "Add Address"}
                                </Button>
                            }
                        />
                    </div>

                    <Separator />

                    {/* Products */}
                    <div className="space-y-3">
                        <div className="flex w-full border-b pb-2">
                            <p className="flex-2">Item</p>
                            <p className="flex-1 text-right">Qty.</p>
                            <p className="flex-1 text-right">Amount</p>
                        </div>
                        {cart.map((item) => (
                            <div key={item.product._id}>
                                <div className="flex justify-between text-sm">
                                    <span>{item.product.title.slice(0, 35)}...</span>
                                    <span>{item.variants.reduce((sum, v) => sum + v.quantity, 0)}</span>
                                    <span>
                                        {currencySymbol}
                                        {item.variants
                                            .reduce(
                                                (sum, v) =>
                                                    sum +
                                                    (isIndianUser ? item.product.price : item.product.priceInUSD) *
                                                    v.quantity,
                                                0
                                            )
                                            .toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{currencySymbol}{totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            {isIndianUser ? (
                                <span className="text-green-600 font-medium">Free Shipping</span>
                            ) : (
                                <span>{currencySymbol}{shippingCost.toFixed(2)}</span>
                            )}
                        </div>

                        {appliedCoupon && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount ({appliedCoupon})</span>
                                <span>-{currencySymbol}{discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold text-base">
                            <span>Final Amount</span>
                            <span>{currencySymbol}{finalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Coupon */}
                    {!appliedCoupon ? (
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
                    ) : (
                        <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                            {appliedCoupon} applied
                            <X size={14} className="cursor-pointer" onClick={handleRemoveCoupon} />
                        </Badge>
                    )}

                    {/* Checkout */}
                    <Button className="w-full" onClick={handleCheckout}>
                        Proceed to Checkout
                    </Button>
                </CardContent>
            </Card>
        </>
    );
};

export default CheckoutContainer;
