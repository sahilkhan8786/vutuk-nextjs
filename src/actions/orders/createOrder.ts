// app/actions/orders/createOrder.ts
"use server";

import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/order.model";
import { auth } from "@/auth";
import { resend } from "@/lib/resend";
import { Custom3dProductRequestEmail } from "@/emails/Custom3dProductRequestEmail";
import { AdminNewCustomOrderEmail } from "@/emails/AdminNewCustomOrderEmail";

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


    try {
        await resend.emails.send({
            from: "Vutuk <orders@vutuk.com>",
            to: session.user.email || "",
            subject: "Your 3D Print Request Has Been Received!",
            react: Custom3dProductRequestEmail({
                name: session.user.name || "Customer",
                requestId: order._id || "N/A",
                material: data.material,
                color: data.color,
                quantity: data.quantity,
            }),
        });
        await resend.emails.send({
            from: "Vutuk <orders@vutuk.com>",
            to: "vutuk.dm@gmail.com",
            subject: "New 3D Print Request Received",
            react: AdminNewCustomOrderEmail({
                customerName: session.user.name || "Customer",
                customerEmail: session.user.email || "",
                material: data.material,
                color: data.color,
                quantity: data.quantity,
                notes: data.notes,
            }),
        });
    } catch (error) {
        console.error("Email sending failed:", error);
    }


    return { success: true, order };
}
