// app/api/admin/requests/route.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookieName } from "@/utils/values";
import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/order.model";
import Custom3dPrintRequest from "@/models/custom3dPrintRequests.model";

export async function GET(req: Request) {
    try {
        await connectToDB();

        const url = new URL(req.url);
        const isCustomOrderRequestParam = url.searchParams.get("isCustomOrderRequest");
        const isCustomOrderRequest = isCustomOrderRequestParam === "true";

        const token = await getToken({
            req,
            secret: process.env.AUTH_SECRET,
            cookieName: cookieName,
        });

        if (!token?.sub) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        let data;

        // Admin can fetch all
        if (token.role === "admin") {
            if (isCustomOrderRequest) {
                // Fetch from Custom3dPrintRequest model
                data = await Custom3dPrintRequest.find().sort({ createdAt: -1 });
            } else {
                // Fetch from Order model
                data = await Order.find().sort({ createdAt: -1 });
            }
        } else {
            // Non-admin user fetches only their own requests
            if (isCustomOrderRequest) {
                data = await Custom3dPrintRequest.find({ userId: token.sub }).sort({ createdAt: -1 });
            } else {
                data = await Order.find({ userId: token.sub }).sort({ createdAt: -1 });
            }
        }

        return NextResponse.json({
            success: true,
            data: { requests: data },
        });
    } catch (error) {
        console.error("Error fetching requests:", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
