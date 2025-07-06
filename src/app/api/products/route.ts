
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import { APIFeatures } from "@/utils/ApiFeatures";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
   
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
