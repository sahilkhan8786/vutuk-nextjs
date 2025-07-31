import { isIndian } from "@/lib/getIP";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import { cookieName } from "@/utils/values";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: cookieName
  })
  const isAdmin = token?.role === 'admin';
  const isIndianUser = await isIndian();


  await connectToDB();
  const slug = (await params).slug;
  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }


  const product = isAdmin ?
    (await Product.findOne({ slug }).select('+price +priceInUSD')) :

    (
      (isIndianUser ?
        await Product.findOne({ slug }).select('+price')
        : await Product.findOne({ slug }).select('+priceInUSD')
      )
    );

  return NextResponse.json({
    status: 'success',
    data: { product },
  });
}

