// app/actions/orders/updateTracking.ts
"use server";

import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/order.model";

export async function updateTracking(orderId: string, data: { trackingId?: string; trackingLink?: string; status?: string; youtubeLink?: string; }) {
    await connectToDB();

    const order = await Order.findByIdAndUpdate(
        orderId,
        {
            ...(data.trackingId && { trackingId: data.trackingId }),
            ...(data.trackingLink && { trackingLink: data.trackingLink }),
            ...(data.status && { status: data.status }),
            ...(data.youtubeLink && { youtubeLink: data.youtubeLink }),
        },
        { new: true }
    );

    return { success: true, order };
}
