// /app/api/team/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import TeamMember from '@/models/team.model';

export async function GET(
  req: NextRequest,
  { params }: { params:Promise <{ id: string }> }
) {
  try {
    const id = (await params).id
    await connectToDB();
    const teamMember = await TeamMember.findById(id);
    if (!teamMember) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ teamMember });
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}
