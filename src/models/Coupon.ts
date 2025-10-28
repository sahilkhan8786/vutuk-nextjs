import mongoose, { Model, Schema } from "mongoose";

// models/Coupon.ts
export interface ICoupon extends Document {
    name: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    maxUses: number;
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
    discountPercent?: string;
    maxDiscount?: string;
}

const CouponSchema: Schema<ICoupon> = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true },
    discountPercent: { type: String, required: true },
    maxDiscount: { type: String, required: true },
    maxUses: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
});

export const Coupon: Model<ICoupon> =
    mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);