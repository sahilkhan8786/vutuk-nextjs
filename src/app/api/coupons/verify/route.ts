import { connectToDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";


export async function POST(req: Request) {
    await connectToDB();
    const { code, orderAmount } = await req.json();

    const coupon = await Coupon.findOne({ name: code });
    if (!coupon) {
        return Response.json({ success: false, message: "Invalid coupon" }, { status: 400 });
    }
    console.log(coupon)

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
        return Response.json({ success: false, message: "Coupon not started yet" }, { status: 400 });
    }
    if (coupon.endDate && new Date(coupon.endDate) < now) {
        return Response.json({ success: false, message: "Coupon expired" }, { status: 400 });
    }

    if (coupon.usedCount >= coupon.maxUses) {
        return Response.json({ success: false, message: "Coupon usage limit reached" }, { status: 400 });
    }

    let discount = 0;
    if (coupon.type === "percentage") {
        discount = (orderAmount * coupon.value) / 100;
    } else if (coupon.type === "fixed") {
        discount = coupon.value;
    }

    const finalAmount = Math.max(orderAmount - discount, 0);

    return Response.json({
        success: true,
        discount,
        finalAmount,
        message: "Coupon applied successfully",
    });
}
