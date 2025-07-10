
// FOR ADMIN ONLY - TO FETCH SINGLE FAVOURITE

import { NextResponse } from "next/server";

// FOR USER TO PATCH
export async function PATCH(req: Request,
    {params}:{params:Promise<{id:string}>}
) {


    const id = (await params).id;

    return NextResponse.json({
        status: 'success',
        data: {
            id
        }
    })
}