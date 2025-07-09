import Custom3dPrintRequest from "@/models/custom3dPrintRequests.model";
import { cookieName } from "@/utils/values";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest,
  {params}:{params:Promise<{id:string}>}
) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: cookieName
  });


  const id =(await params).id;


  
  const orders = await Custom3dPrintRequest.findOne({ _id:id,userId:token?.sub});

 console.log(orders)

  return NextResponse.json({
    status: 'success',
    data: {
      orders
    }
  })
  
}

export async function PATCH(req: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      cookieName: cookieName
    });
  
    if (token?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
  
    const id =(await params).id;
    const body = await req.json();
  
    // ✅ Pick only the allowed fields
    const {
      material,
      otherMaterial,
      color,
      otherColor,
      priority,
      otherPriority,
      quantity,
      notes,
      isBusiness,
      gstOrFirm,
      status,
      price,
      youtubeLink,
      trackingId,
      length,
      breadth,
      height,
      dimensionUnit
    } = body;
  
    const updated = await Custom3dPrintRequest.findByIdAndUpdate(
      id,
      {
        material,
        otherMaterial,
        color,
        otherColor,
        priority,
        otherPriority,
        quantity,
        notes,
        isBusiness,
        gstOrFirm,
        status,
        price,
        youtubeLink,
        trackingId,
        length,
        breadth,
        height,
        dimensionUnit,
      },
      { new: true }
    );
  
    if (!updated) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
  
    return NextResponse.json({ message: 'Order updated', order: updated });
  }
  