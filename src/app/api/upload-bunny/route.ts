import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const apiKey = process.env.BUNNY_STORAGE_API_KEY;
        const storageZone = process.env.BUNNY_STORAGE_ZONE;
        const region = process.env.BUNNY_STORAGE_REGION || 'ny';

        if (!apiKey || !storageZone) {
            return NextResponse.json({ error: 'BunnyCDN API key or storage zone not set' }, { status: 500 });
        }

        const filename = encodeURIComponent(file.name);
        const url = `https://storage.bunnycdn.com/${storageZone}/${filename}`;

        // Convert File to ArrayBuffer for BunnyCDN
        const arrayBuffer = await file.arrayBuffer();

        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                AccessKey: apiKey,
                'Content-Type': 'application/octet-stream',
            },
            body: arrayBuffer,
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('BunnyCDN response error:', text);
            return NextResponse.json({ error: `Upload failed: ${text}` }, { status: res.status });
        }

        // Return the public URL
        const publicUrl = `https://${storageZone}.${region}.bunnycdn.com/${filename}`;
        return NextResponse.json({ url: publicUrl });
    } catch (err) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};