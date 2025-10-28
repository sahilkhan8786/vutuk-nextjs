import { connectToDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { NextRequest, NextResponse } from "next/server";

// Define TypeScript interfaces
interface CouponRequest {
    code: string;
    orderAmount: number;
}

interface CouponResponseSuccess {
    success: true;
    discount: number;
    finalAmount: number;
    message: string;
}

interface CouponResponseError {
    success: false;
    message: string;
}

type CouponResponse = CouponResponseSuccess | CouponResponseError;

// Coupon type from your database model (adjust based on your actual Coupon model)
interface CouponDocument {
    name: string;
    startDate?: Date;
    endDate?: Date;
    usedCount: number;
    maxUses: number;
    type: "percentage" | "fixed";
    value: number;
}

export async function POST(req: NextRequest): Promise<NextResponse<CouponResponse>> {
    try {
        await connectToDB();

        // Validate request body
        const body: CouponRequest = await req.json();

        const { code, orderAmount } = body;

        // Input validation
        if (!code || typeof code !== 'string' || code.trim() === '') {
            return NextResponse.json(
                { success: false, message: "Coupon code is required" },
                { status: 400 }
            );
        }

        if (typeof orderAmount !== 'number' || orderAmount < 0) {
            return NextResponse.json(
                { success: false, message: "Valid order amount is required" },
                { status: 400 }
            );
        }

        // Find coupon in database
        const coupon: CouponDocument | null = await Coupon.findOne({ name: code });

        if (!coupon) {
            return NextResponse.json(
                { success: false, message: "Invalid coupon" },
                { status: 400 }
            );
        }

        console.log(coupon);

        // Validate coupon dates
        const now = new Date();

        if (coupon.startDate && new Date(coupon.startDate) > now) {
            return NextResponse.json(
                { success: false, message: "Coupon not started yet" },
                { status: 400 }
            );
        }

        if (coupon.endDate && new Date(coupon.endDate) < now) {
            return NextResponse.json(
                { success: false, message: "Coupon expired" },
                { status: 400 }
            );
        }

        // Validate usage limits
        if (coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json(
                { success: false, message: "Coupon usage limit reached" },
                { status: 400 }
            );
        }

        // Calculate discount
        let discount = 0;

        if (coupon.type === "percentage") {
            discount = (orderAmount * coupon.value) / 100;
            // Ensure discount doesn't exceed order amount for percentage coupons
            discount = Math.min(discount, orderAmount);
        } else if (coupon.type === "fixed") {
            discount = Math.min(coupon.value, orderAmount);
        }

        const finalAmount = Math.max(orderAmount - discount, 0);

        return NextResponse.json({
            success: true,
            discount: Number(discount.toFixed(2)),
            finalAmount: Number(finalAmount.toFixed(2)),
            message: "Coupon applied successfully",
        });

    } catch (error) {
        console.error("Coupon validation error:", error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}