"use server";

import { Coupon } from "@/models/Coupon";
import { connectToDB } from "@/lib/mongodb";
import { addCouponSchema, CouponFormValues } from "@/schemas/AddCouponsSchema";
import { revalidatePath } from "next/cache";

// Create
export async function createCoupon(data: CouponFormValues) {
    await connectToDB();

    const parsed = addCouponSchema.parse(data);

    const newCoupon = new Coupon({
        name: parsed.name,
        type: parsed.type,
        value: parsed.value,
        maxUses: parsed.maxUses,
        startDate: parsed.startDate ? new Date(parsed.startDate) : undefined,
        endDate: parsed.endDate ? new Date(parsed.endDate) : undefined,
    });

    await newCoupon.save();
    revalidatePath('/admin/coupons')

    return { success: true, message: "Coupon created successfully!" };
}

// Update
export async function updateCoupon(id: string, values: any) {
    try {
        await connectToDB();

        const updated = await Coupon.findByIdAndUpdate(id, values, {
            new: true,
            runValidators: true,
        }).lean(); // 👈 ensures plain JS object instead of Mongoose doc

        if (!updated) {
            return { success: false, message: "Coupon not found" };
        }

        revalidatePath("/admin/coupons");

        return {
            success: true,
            message: "Coupon updated successfully",
            coupon: JSON.parse(JSON.stringify(updated)), // plain object, safe to send to client
        };
    } catch (error) {
        console.error("Error updating coupon:", error);
        return { success: false, message: "Error updating coupon" };
    }
}



export async function deleteCoupon(id: string) {
    try {
        await connectToDB();

        const deleted = await Coupon.findByIdAndDelete(id);
        if (!deleted) {
            return { success: false, message: "Coupon not found" };
        }

        // Revalidate the admin coupons page
        revalidatePath("/admin/coupons");

        return { success: true, message: "Coupon deleted successfully" };
    } catch (error) {
        console.error("Error deleting coupon:", error);
        return { success: false, message: "Error deleting coupon" };
    }
}
