// app/actions/orders/createOrder.ts
"use server";

import { getToken } from "next-auth/jwt";
import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/order.model";
import { cookieName } from "@/utils/values";
import { auth } from "@/auth";

export async function createOrder(data: {
    addressId: string;
    material: string;
    color: string;
    priority: string;
    quantity: number;
    notes?: string;
    isBusiness: boolean;
    gstOrFirm?: string;
    image?: string;
    modelFileUrl?: string;
    length?: number;
    breadth?: number;
    height?: number;
    dimensionUnit?: string;
}) {
    await connectToDB();
    const session = await auth();

    if (!session) return {
        success: false,
        message: "You are not logged In"
    };




    const order = await Order.create({
        userId: session.user.id,
        addressId: data.addressId,
        material: data.material,
        color: data.color,
        priority: data.priority,
        quantity: data.quantity,
        notes: data.notes,
        isBusiness: data.isBusiness,
        gstOrFirm: data.gstOrFirm,
        image: data.image,
        modelFileUrl: data.modelFileUrl,
        length: data.length,
        breadth: data.breadth,
        height: data.height,
        dimensionUnit: data.dimensionUnit,
    });

    return { success: true, order };
}
