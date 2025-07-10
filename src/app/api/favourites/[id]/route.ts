
// FOR ADMIN ONLY - TO FETCH SINGLE FAVOURITE

import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// FOR USER TO PATCH
export async function PATCH(req: Request,
    {params}:{params:Promise<{id:string}>}
) {


    const id = (await params).id;
    await connectToDB();

    return NextResponse.json({
        status: 'success',
        data: {
            id
        }
    })
}