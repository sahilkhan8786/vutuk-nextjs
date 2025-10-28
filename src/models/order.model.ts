// models/order.model.ts
import mongoose, { Schema, Document, model } from "mongoose";

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    variants: Array<{
        quantity: number;
        color: string;
    }>;
}

export interface IOrder extends Document {
    userId?: mongoose.Types.ObjectId | null;
    addressId?: mongoose.Types.ObjectId | null;
    items?: IOrderItem[]; // for cart-based orders
    modelFileUrl?: string;
    material?: string;
    otherMaterial?: string;
    color?: string;
    otherColor?: string;
    priority?: string;
    otherPriority?: string;
    quantity?: number;
    notes?: string;
    isBusiness?: boolean;
    gstOrFirm?: string;
    status?: OrderStatus;
    image?: string;
    price?: number;
    youtubeLink?: string;
    trackingId?: string;
    trackingLink?: string;
    length?: number;
    breadth?: number;
    height?: number;
    dimensionUnit?: string;
    totalAmount?: number;
    paymentId?: string;

    createdAt: Date;
    updatedAt: Date;
}

const STATUS_ENUM = [
    "Request Submitted",
    "Under Verification",
    "Quotation Generated",
    "In Production",
    "Out for Delivery",
    "Delivered",
] as const;

export type OrderStatus = typeof STATUS_ENUM[number];
// ✅ Define sub-schema for items
const orderItemSchema = new Schema<IOrderItem>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        variants: [
            {
                quantity: { type: Number, required: true, min: 1 },
                color: { type: String, required: true },
            },
        ],
    },
    { _id: false }
);

// Make all fields optional in the schema
const OrderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
        addressId: { type: Schema.Types.ObjectId, ref: "Address", default: null },

        items: [orderItemSchema], // cart items

        price: { type: Number, default: 0 },
        youtubeLink: { type: String, default: "" },

        trackingId: { type: String, default: "" },
        trackingLink: { type: String, default: "" },
        quantity: { type: Number, default: 0 },
        notes: { type: String, default: "" },

        status: { type: String, enum: STATUS_ENUM, default: "Request Submitted" },
        totalAmount: { type: Number, default: 0 },
        paymentId: { type: String, default: "" },
    },
    { timestamps: true }
);


const Order = mongoose.models.Order || model<IOrder>("Order", OrderSchema);
export default Order;
