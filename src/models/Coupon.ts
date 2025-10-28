import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    discountPercent: number;
    maxDiscount: number;
    isActive: boolean;
}

const CouponSchema: Schema<ICoupon> = new Schema({
    code: { type: String, required: true, unique: true },
    discountPercent: { type: Number, required: true },
    maxDiscount: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
});

export const Coupon: Model<ICoupon> =
    mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
