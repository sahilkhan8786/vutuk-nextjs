import { connectToDB } from "@/lib/mongodb"
import { User } from "@/models/user.model";
import { cookieName } from "@/utils/values";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {

        const token = await getToken({
            req,
            secret: process.env.AUTH_SECRET,
            cookieName:cookieName
        })
        const isAdmin = token?.role === 'admin';

        if (!isAdmin) {
            return NextResponse.json({
                status: "failed",
                message:"You are not authorized to acces this resource"
            })
        }

        connectToDB();


        const users = await User.find({}).select("-password -__v");

        return NextResponse.json({
            status: "success",
            data: {
                users
            }
        })


    } catch (error) {
        console.log(error)
        throw error
    }
}