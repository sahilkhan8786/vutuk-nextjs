import Custom3dPrintRequest from "@/models/custom3dPrintRequests.model";
import { cookieName } from "@/utils/values";
import { getToken } from "next-auth/jwt";
import {  NextResponse } from "next/server";

export  async function GET(req:Request) {
    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
        cookieName:cookieName
    })
const requests = await Custom3dPrintRequest.find({userId:token?.sub})


    return NextResponse.json({
        status: 'success',
        data:{requests}
    })
}