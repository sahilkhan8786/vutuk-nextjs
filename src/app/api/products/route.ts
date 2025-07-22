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
      cookieName: cookieName,
    });

    await connectToDB();

    const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const isAdmin = token?.role === "admin";

    // ✅ Check for `random=true` query param
    if (queryParams.random === 'true') {
     
      const products = await Product.aggregate([
        { $sample: { size: 100 } }
      ]);

      return NextResponse.json({
        status: "success",
        data: { products },
      });
    }

    // ⚙️ Normal query
    let features = new APIFeatures(Product.find(), queryParams)
      .filter()
      .sort()
      .limitFields();

    if (!isAdmin) {
      features = features.paginate();
    }

    const products = await features.query;

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
