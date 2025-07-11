import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { cookieName } from "@/utils/values";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req: Request,
    { params }: { params: Promise<{id:string}>}
) {
    const id = (await params).id;
    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
        cookieName:cookieName
    })
    const isAdmin = token?.role === 'admin';

    if (!isAdmin) {
        return NextResponse.json({
            status: 'failed',
            message:"You are not authorized to access this resoulrce"
        })
    }

    try {
        await connectToDB();
        const user = await User.findById(id).select("-password -__v")
        return NextResponse.json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (error) {
        console.log(error)

        return NextResponse.json({
            status: 'error',
            message:"Error fetching User by ID"
        })
    }
}