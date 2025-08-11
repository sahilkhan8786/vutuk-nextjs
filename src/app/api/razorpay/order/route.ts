// app/api/razorpay/order/route.ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {

    console.log(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET)
    try {
        const { amount } = await req.json();

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Error creating Razorpay order' }, { status: 500 });
    }
}
