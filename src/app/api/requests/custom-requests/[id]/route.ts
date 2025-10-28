import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookieName } from "@/utils/values";
import { connectToDB } from "@/lib/mongodb";
import Custom3dPrintRequest from "@/models/custom3dPrintRequests.model";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDB();

        const token = await getToken({
            req,
            secret: process.env.AUTH_SECRET,
            cookieName: cookieName,
        });

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = (await params).id;

        let requestData;

        if (token.role === "admin") {
            requestData = await Custom3dPrintRequest.findById(id)
                .populate("userId")
                .sort({ createdAt: -1 });
        } else {
            requestData = await Custom3dPrintRequest.findOne({
                _id: id,
                userId: token.sub,
            });
        }

        if (!requestData) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
        }

        return NextResponse.json({
            status: "success",
            data: { request: requestData },
        });
    } catch (error) {
        console.error("Error fetching custom request:", error);
        return NextResponse.json(
            { message: "Server error", error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDB();

        const token = await getToken({
            req,
            secret: process.env.AUTH_SECRET,
            cookieName: cookieName,
        });

        if (token?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const id = (await params).id;
        const body = await req.json();

        // ✅ Fields allowed to be updated
        const {
            material,
            otherMaterial,
            color,
            otherColor,
            priority,
            otherPriority,
            quantity,
            notes,
            isBusiness,
            gstOrFirm,
            status,
            price,
            youtubeLink,
            trackingId,
            length,
            breadth,
            height,
            dimensionUnit,
        } = body;

        const updated = await Custom3dPrintRequest.findByIdAndUpdate(
            id,
            {
                material,
                otherMaterial,
                color,
                otherColor,
                priority,
                otherPriority,
                quantity,
                notes,
                isBusiness,
                gstOrFirm,
                status,
                price,
                youtubeLink,
                trackingId,
                length,
                breadth,
                height,
                dimensionUnit,
            },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Custom 3D Request updated",
            request: updated,
        });
    } catch (error) {
        console.error("Error updating custom request:", error);
        return NextResponse.json(
            { message: "Server error", error: (error as Error).message },
            { status: 500 }
        );
    }
}
