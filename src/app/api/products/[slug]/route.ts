import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectToDB();
  const slug =(await params).slug;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const product = await Product.findOne({ slug });

  return NextResponse.json({
    status: 'success',
    data: { product },
  });
}

