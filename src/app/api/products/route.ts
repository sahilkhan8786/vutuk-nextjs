
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import { APIFeatures } from "@/utils/ApiFeatures";
import { cookieName } from "@/utils/values";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      cookieName:cookieName
    })
    
    console.log("TOKEN FROM TEH GET ROUTE",token)


    await connectToDB();
    const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries())

    const features = new APIFeatures(Product.find(), queryParams)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const products = await features.query

    return NextResponse.json({
      status: "success",
      data: { products },
    });
  } catch (error) {
    console.error("API /api/products error:", error);

    return NextResponse.json(
      { status: "error", message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
