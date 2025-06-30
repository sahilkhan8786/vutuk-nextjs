import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const products = await Product.find({});

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
