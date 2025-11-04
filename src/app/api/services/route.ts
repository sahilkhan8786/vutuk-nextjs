import { connectToDB } from "@/lib/mongodb";
import Service from "@/models/service.model";
import { APIFeatures } from "@/utils/ApiFeatures";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries());


    // ⚙️ Normal query
    const features = new APIFeatures(Service.find(), queryParams)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const services = await features.query;;

    return NextResponse.json({
      status: "success",
      data: { services },
    });
  } catch (error) {
    console.error("API /api/services error:", error);

    return NextResponse.json(
      { status: "error", message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
