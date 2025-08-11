// app/api/razorpay/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import Payment from "@/models/payments.model";
import { connectToDB } from "@/lib/mongodb";


export async function POST(req: Request) {
    try {
        await connectToDB();

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = await req.json();

        const key_id = process.env.RAZORPAY_KEY_ID!;
        const key_secret = process.env.RAZORPAY_KEY_SECRET!;

        if (!key_id || !key_secret) {
            return NextResponse.json(
                { success: false, error: "Razorpay credentials not set" },
                { status: 500 }
            );
        }

        // Verify signature
        const generated_signature = crypto
            .createHmac("sha256", key_secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json(
                { success: false, error: "Invalid signature" },
                { status: 400 }
            );
        }

        // Fetch payment details from Razorpay API
        const paymentRes = await fetch(
            `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
            {
                headers: {
                    Authorization:
                        "Basic " +
                        Buffer.from(`${key_id}:${key_secret}`).toString("base64"),
                },
            }
        );

        if (!paymentRes.ok) {
            throw new Error(`Failed to fetch payment: ${paymentRes.statusText}`);
        }

        const paymentData = await paymentRes.json();

        // Store in DB
        await Payment.create({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: paymentData.amount / 100, // Razorpay stores in paise
            currency: paymentData.currency,
            status: paymentData.status,
            method: paymentData.method,
            email: paymentData.email,
            contact: paymentData.contact,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}
