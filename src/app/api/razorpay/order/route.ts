import Razorpay from "razorpay";
import { getToken } from "next-auth/jwt";
import Cart from "@/models/cart.model";
import { NextResponse } from "next/server";
import { Coupon, ICoupon } from "@/models/Coupon";
import { isIndian } from "@/lib/getIP";

// ✅ Create Razorpay Order
export async function POST(req: Request) {
    try {
        const token = await getToken({ req, secret: process.env.AUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const IsIndianUser = await isIndian();
        const { couponCode }: { couponCode?: string } = await req.json();

        // ✅ Fetch cart with populated products
        const cart = await Cart.findOne({ userId: token.sub }).populate({
            path: "cart.product",
            select: IsIndianUser ? "price" : "priceInUSD",
        });

        if (!cart || cart.cart.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // ✅ Recalculate totals from variants
        let subtotal = 0;
        let totalQty = 0;

        cart.cart.forEach((item: any) => {
            if (!item.product) {
                console.warn("Cart item missing product:", item);
                return;
            }

            const price = IsIndianUser
                ? Number(item.product.price) || 0
                : Number(item.product.priceInUSD) || 0;

            // loop through variants
            item.variants.forEach((variant: any) => {
                const qty = Number(variant.quantity) || 0;
                totalQty += qty;
                subtotal += qty * price;
            });
        });

        // ✅ Shipping based on authenticity
        let shipping: number;
        if (IsIndianUser) {
            // INR shipping
            shipping = 1800 + (totalQty > 1 ? (totalQty - 1) * 500 : 0);
        } else {
            // USD shipping
            shipping = 30 + (totalQty > 1 ? (totalQty - 1) * 10 : 0);
        }

        // ✅ Apply coupon if valid
        let discount = 0;
        if (couponCode) {
            const coupon: ICoupon | null = await Coupon.findOne({
                code: couponCode,
                isActive: true,
            });

            if (coupon) {
                const discountPercent = Number(coupon.discountPercent) || 0;
                const maxDiscount = Number(coupon.maxDiscount) || 0;

                discount = Math.min(subtotal * (discountPercent / 100), maxDiscount);
            }
        }

        const finalAmount = subtotal + shipping - discount;

        // ✅ Validate before Razorpay call
        if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
            return NextResponse.json(
                {
                    error: "Invalid order amount",
                    debug: { subtotal, shipping, discount, finalAmount },
                },
                { status: 400 }
            );
        }

        console.log(
            `🟢 Creating Razorpay order: ${IsIndianUser ? "INR" : "USD"} ${finalAmount}`
        );

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const order = await razorpay.orders.create({
            amount: Math.round(finalAmount * 100), // paise or cents
            currency: IsIndianUser ? "INR" : "USD", // 👈 dynamic currency
            receipt: `order_rcptid_${Date.now()}`,
        });

        return NextResponse.json({ order });
    } catch (error: any) {
        console.error("❌ Razorpay Order Error:", error);
        return NextResponse.json(
            {
                error: "Razorpay order creation failed",
                details: error.message || error,
            },
            { status: 500 }
        );
    }
}
