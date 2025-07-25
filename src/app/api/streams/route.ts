import { connectToDB } from "@/lib/mongodb";
import Stream from "@/models/streams.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB();

        const streams = await Stream.find({}).sort({ createdAt: -1 }); // optional: latest first

        return NextResponse.json({
            success: true,
            data: {streams},
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch streams',
        }, { status: 500 });
    }
}
