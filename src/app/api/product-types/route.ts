import { connectToDB } from "@/lib/mongodb";
import ProductTypes from "@/models/productType.model";
import {  NextResponse } from "next/server";

export async function GET() {
    await connectToDB();
    const productTypes = await ProductTypes.find({});


    return NextResponse.json({
        status: 'success',
        data: {
            productTypes
        }
    })
}