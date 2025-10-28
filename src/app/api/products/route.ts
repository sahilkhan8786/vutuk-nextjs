// import { isIndian } from "@/lib/getIP";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import { APIFeatures } from "@/utils/ApiFeatures";
import { cookieName } from "@/utils/values";
import { FilterQuery } from "mongoose";
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
    const IsIndianUser = true;

    // ✅ Check for random fetch
    if (queryParams.random === "true") {
      const products = await Product.aggregate([{ $sample: { size: 10 } }]);
      return NextResponse.json({
        status: "success",
        data: { products },
      });
    }

    // ✅ Build dynamic MongoDB filter for array-based fields
    const filter: FilterQuery<typeof Product> = {};

    // handle array-based fields
    if (queryParams.mainCategories) {
      const mainCat = queryParams.mainCategories
        .split(",")
        .map((item) => item.trim());
      filter.mainCategories = { $in: mainCat };
    }

    if (queryParams.productType) {
      const types = queryParams.productType
        .split(",")
        .map((item) => item.trim());
      filter.productType = { $in: types };
    }

    if (queryParams.subCategories) {
      const subCats = queryParams.subCategories
        .split(",")
        .map((item) => item.trim());
      filter.subCategories = { $in: subCats };
    }

    // ✅ Build base query (admin vs user)
    const baseQuery = isAdmin
      ? Product.find(filter).select("+price +priceInUSD")
      : IsIndianUser
        ? Product.find(filter).select("+price")
        : Product.find(filter).select("+priceInUSD");

    // ✅ Apply APIFeatures for sorting, pagination, etc.
    let features = new APIFeatures(baseQuery, queryParams)
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
