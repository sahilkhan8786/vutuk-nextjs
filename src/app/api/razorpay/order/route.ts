import Razorpay from "razorpay";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import Cart from "@/models/cart.model";
import { Coupon, ICoupon } from "@/models/Coupon";
import { isIndian } from "@/lib/getIP";
import { cookieName } from "@/utils/values";

interface RazorpayOrderRequestBody {
    couponCode?: string;
}

interface Variant {
    quantity: number;
}

interface Product {
    price?: number;
    priceInUSD?: number;
}

interface CartItem {
    product: Product | null;
    variants: Variant[];
}

interface CartDocument {
    cart: CartItem[];
}

export async function POST(req: Request) {
    try {
        const token = await getToken({
            req,
            secret: process.env.AUTH_SECRET,
            cookieName: cookieName
        });
        if (!token?.sub) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const IsIndianUser = await isIndian();
        const { couponCode }: RazorpayOrderRequestBody = await req.json();

        const cart = (await Cart.findOne({ userId: token.sub }).populate({
            path: "cart.product",
            select: IsIndianUser ? "price" : "priceInUSD",
        })) as unknown as CartDocument | null;

        if (!cart || !Array.isArray(cart.cart) || cart.cart.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        let subtotal = 0;
        let totalQty = 0;

        for (const item of cart.cart) {
            if (!item.product) continue;

            const price = IsIndianUser
                ? Number(item.product.price ?? 0)
                : Number(item.product.priceInUSD ?? 0);

            for (const variant of item.variants) {
                const qty = Number(variant.quantity) || 0;
                subtotal += qty * price;
                totalQty += qty;
            }
        }

        const shipping = IsIndianUser
            ? 1800 + Math.max(0, totalQty - 1) * 500
            : 30 + Math.max(0, totalQty - 1) * 10;

        let discount = 0;
        if (couponCode) {
            const coupon: ICoupon | null = await Coupon.findOne({
                code: couponCode,
                isActive: true,
            });

            if (coupon) {
                const discountPercent = Number(coupon.discountPercent ?? 0);
                const maxDiscount = Number(coupon.maxDiscount ?? 0);
                discount = Math.min(subtotal * (discountPercent / 100), maxDiscount);
            }
        }

        const finalAmount = subtotal + shipping - discount;

        if (isNaN(finalAmount) || finalAmount <= 0) {
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

        // ✅ Correct type import (no warning)
        const order = await razorpay.orders.create({
            amount: Math.round(finalAmount * 100),
            currency: IsIndianUser ? "INR" : "USD",
            receipt: `order_rcptid_${Date.now()}`,
        });

        // ✅ TypeScript will correctly infer the type from Razorpay SDK
        return NextResponse.json({ order });

    } catch (error) {
        const err = error as Error;
        console.error("❌ Razorpay Order Error:", err);
        return NextResponse.json(
            {
                error: "Razorpay order creation failed",
                details: err.message || String(error),
            },
            { status: 500 }
        );
    }
}
