import { connectToDB } from "@/lib/mongodb";
import Project from "@/models/project.model";
import { APIFeatures } from "@/utils/ApiFeatures";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const features = new APIFeatures(Project.find(), queryParams)
          .filter()
          .sort()
      .limitFields()
    .paginate()

    const projects =await features.query;

    return NextResponse.json({
      status: "success",
      data: { projects },
    });
  } catch (error) {
    console.error("API /api/projects error:", error);

    return NextResponse.json(
      { status: "error", message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
