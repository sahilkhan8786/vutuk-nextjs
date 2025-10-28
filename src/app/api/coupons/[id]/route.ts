import { connectToDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { NextResponse } from "next/server";


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        await Coupon.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to delete coupon" }, { status: 500 });
    }
}
