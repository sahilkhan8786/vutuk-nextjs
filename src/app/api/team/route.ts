// export async function GET(request:Request) {

import { NextRequest, NextResponse } from "next/server";

    
// }
export async function POST(request:NextRequest) {
    const data = request.json();
    console.log(data)

    return NextResponse.json({
        status: "success",
        data: {
            data
        }
    })
}