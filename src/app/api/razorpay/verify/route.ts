// app/api/razorpay/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import Payment from "@/models/payments.model";
import Order from "@/models/order.model";
import Cart from "@/models/cart.model";
import { connectToDB } from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import { cookieName } from "@/utils/values";

export async function POST(req: Request) {
    try {
        await connectToDB();

        const token = await getToken({
            req,
            secret: process.env.AUTH_SECRET,
            cookieName: cookieName,
        });

        if (!token?.sub) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            addressId, // optional
            customOrderData, // optional
        } = body;

        console.log("Verify payload:", body);

        const key_id = process.env.RAZORPAY_KEY_ID!;
        const key_secret = process.env.RAZORPAY_KEY_SECRET!;

        if (!key_id || !key_secret) {
            return NextResponse.json({ success: false, error: "Razorpay credentials not set" }, { status: 500 });
        }

        // Verify signature
        const generated_signature = crypto
            .createHmac("sha256", key_secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
        }

        // Fetch payment details
        const paymentRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
            headers: {
                Authorization: "Basic " + Buffer.from(`${key_id}:${key_secret}`).toString("base64"),
            },
        });

        if (!paymentRes.ok) throw new Error(`Failed to fetch payment: ${paymentRes.statusText}`);

        const paymentData = await paymentRes.json();

        // Store payment
        await Payment.create({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: paymentData.amount / 100,
            currency: paymentData.currency,
            status: paymentData.status,
            method: paymentData.method,
            email: paymentData.email,
            contact: paymentData.contact,
        });

        // Fetch user's cart
        const cart = await Cart.findOne({ userId: token.sub });

        // Build order
        const orderData = {
            userId: token.sub,
            status: "In Production",
            paymentId: razorpay_payment_id,
            totalAmount: paymentData.amount / 100,
            items: cart?.cart?.length ? cart.cart : [],
            isCustomOrderRequest: false,
            addressId: addressId
        };

        if (addressId) orderData.addressId = addressId;
        if (customOrderData && typeof customOrderData === "object") Object.assign(orderData, customOrderData);

        // Create order
        const order = await Order.create(orderData);
        console.log(order)

        // Clear cart if it existed
        if (cart?.cart?.length) {
            await Cart.findOneAndUpdate({ userId: token.sub }, { $set: { cart: [] } });
        }

        return NextResponse.json({ success: true, order });
    } catch (error: unknown) {
        // Type guard to check if it's an Error
        const message = error instanceof Error ? error.message : "Server error";
        console.error("Error verifying payment:", error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }

}
