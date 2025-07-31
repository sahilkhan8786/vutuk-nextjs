import { isIndian } from "@/lib/getIP";
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
    const IsIndianUser = await isIndian();

    // ✅ Check for `random=true` query param
    if (queryParams.random === 'true') {

      const products = await Product.aggregate([
        { $sample: { size: 10 } }
      ]);

      return NextResponse.json({
        status: "success",
        data: { products },
      });
    }

    // ⚙️ Normal query
    let features = new APIFeatures(isAdmin ? Product.find().select('+price +priceInUSD') :
      IsIndianUser ?
        Product.find().select('price') :
        Product.find().select('+priceInUSD')
      , queryParams)
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
