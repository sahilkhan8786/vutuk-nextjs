// app/api/upload-bunny/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    const storageZone = process.env.BUNNY_STORAGE_ZONE!;
    const accessKey = process.env.BUNNY_STORAGE_API_KEY!;
    const pullZone = process.env.BUNNY_PULL_ZONE!; // e.g. myzone.b-cdn.net

    // Generate unique file name
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.stl`;

    return NextResponse.json({
        uploadUrl: `https://storage.bunnycdn.com/${storageZone}/${fileName}`,
        accessKey,
        publicUrl: `https://${pullZone}/${fileName}`,
    });
}
