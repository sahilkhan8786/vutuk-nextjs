import { connectToDB } from "@/lib/mongodb";
import Address from "@/models/address.model";
import { cookieName } from "@/utils/values";
import { getToken } from "next-auth/jwt";
import {  NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
          const token = await getToken({
                req,
                secret: process.env.AUTH_SECRET,
                cookieName:cookieName
          })
        await connectToDB();

        if(!token)  { 
            return NextResponse.json({
                status: "Failed",
                message:"You are not logged In"
            })
        }


        const isAdmin = token?.role === "admin" || token?.email === process.env.ADMIN_EMAIL;
        const addresses = isAdmin
      ? await Address.find({}) 
            : await Address.find({ userId: token.sub }); 
        
        
        
        return NextResponse.json({
            status: 'success',
            data: {
                addresses
            }
        })
 


        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            status: "error",
            message:"Something went wrong"
        })
    }
}