// app/api/admin/payments/route.ts
import { NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongodb";
import Payment from "@/models/payments.model";

export async function GET() {
    await connectToDB();
    const payments = await Payment.find().sort({ createdAt: -1 });
    return NextResponse.json(payments);
}
