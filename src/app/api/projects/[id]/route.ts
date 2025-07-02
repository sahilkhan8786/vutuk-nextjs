// /app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Project from '@/models/project.model';

export async function GET(
  req: NextRequest,
  { params }: { params:Promise <{ id: string }> }
) {
  try {
    const id = (await params).id
    await connectToDB();
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}
