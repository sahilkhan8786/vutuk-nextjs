'use server'
import { Coupon } from "@/models/Coupon";
import { revalidatePath } from "next/cache";
import { connectToDB } from "@/lib/mongodb";

// Use the same interface as your form
interface CouponFormValues {
    name: string;
    type: "percentage" | "fixed";
    value: number;
    maxUses: number;
    startDate?: string | Date;
    endDate?: string | Date;
}

// ✅ Create Coupon
export async function createCoupon(data: CouponFormValues) {
    try {
        await connectToDB();

        const newCoupon = new Coupon({
            name: data.name,
            type: data.type,
            value: data.value,
            maxUses: data.maxUses,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
        });

        await newCoupon.save();

        revalidatePath("/admin/coupons");

        return { success: true, message: "Coupon created successfully!" };
    } catch (error) {
        console.error("Error creating coupon:", error);
        return { success: false, message: "Error creating coupon" };
    }
}

// ✅ Update Coupon
export async function updateCoupon(id: string, values: Partial<CouponFormValues>) {
    try {
        await connectToDB();

        // Handle date conversion for updates
        const updateData = { ...values };
        if (values.startDate) {
            updateData.startDate = new Date(values.startDate);
        }
        if (values.endDate) {
            updateData.endDate = new Date(values.endDate);
        }

        const updated = await Coupon.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).lean();

        if (!updated) {
            return { success: false, message: "Coupon not found" };
        }

        revalidatePath("/admin/coupons");

        return {
            success: true,
            message: "Coupon updated successfully",
            coupon: JSON.parse(JSON.stringify(updated)),
        };
    } catch (error) {
        console.error("Error updating coupon:", error);
        return { success: false, message: "Error updating coupon" };
    }
}

// Delete function remains the same...

// ✅ Delete Coupon
export async function deleteCoupon(id: string) {
    try {
        await connectToDB();

        const deleted = await Coupon.findByIdAndDelete(id);
        if (!deleted) {
            return { success: false, message: "Coupon not found" };
        }

        revalidatePath("/admin/coupons");

        return { success: true, message: "Coupon deleted successfully" };
    } catch (error) {
        console.error("Error deleting coupon:", error);
        return { success: false, message: "Error deleting coupon" };
    }
}
