// app/api/razorpay/webhook/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const payload = await req.text();
    const signature = req.headers.get("x-razorpay-signature") as string;

    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(payload)
        .digest("hex");

    if (expectedSignature === signature) {
        const event = JSON.parse(payload);
        console.log("Webhook verified:", event);

        // Handle order update in DB here
        // event.payload.payment.entity.status === 'captured' → mark as paid

        return NextResponse.json({ status: "ok" });
    } else {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
}
