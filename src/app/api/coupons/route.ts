import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";

// GET all coupons
export async function GET() {
    await connectToDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json(coupons);
}

// POST create coupon (if you want to use API instead of server action)
export async function POST(req: Request) {
    await connectToDB();
    const body = await req.json();

    const coupon = new Coupon(body);
    await coupon.save();

    return NextResponse.json({ success: true, coupon });
}
