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
    let requests;

    if (token?.role === 'user') {
        requests = await Custom3dPrintRequest.find({userId:token?.sub})
    } else {
        requests = await Custom3dPrintRequest.find({})
        .populate('userId');
    }


    return NextResponse.json({
        status: 'success',
        data:{requests}
    })
}