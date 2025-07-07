import Custom3dPrintRequest from "@/models/custom3dPrintRequests.model";
import { cookieName } from "@/utils/values";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest,
    { params }: { params:Promise <{ id: string }> }
) {
    const token =await getToken({
        req,
        secret: process.env.AUTH_SECRET,
        cookieName: cookieName
    });
    const id = (await params).id;
    const body = await req.json();


    if (token?.role !== 'admin') {
        return         NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const updated = await Custom3dPrintRequest.findByIdAndUpdate(id, body, {
        new: true,
      });

    if (!updated) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
    
      return NextResponse.json({ message: 'Order updated', order: updated });


}