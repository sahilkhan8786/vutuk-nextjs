import { connectToDB } from "@/lib/mongodb";
import Project from "@/models/project.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const projects = await Project.find({});

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
