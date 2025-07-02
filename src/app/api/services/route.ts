import { connectToDB } from "@/lib/mongodb";
import Service from "@/models/service.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const services = await Service.find({});

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
