// /app/api/service/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Service from '@/models/service.model';

export async function GET(
  req: NextRequest,
  { params }: { params:Promise <{ slug: string }> }
) {
  try {
    const slug = (await params).slug
    await connectToDB();
    const service = await Service.findOne({slug});
    if (!service) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}
