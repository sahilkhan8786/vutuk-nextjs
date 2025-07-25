import { connectToDB } from "@/lib/mongodb";
import TeamMember from "@/models/team.model";
import { APIFeatures } from "@/utils/ApiFeatures";
import {  NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectToDB();

 const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries());
 const features = new APIFeatures(TeamMember.find(), queryParams)
      .filter()
      .sort()
            .limitFields()
        .paginate()
        
        const team = await features.query;

        return NextResponse.json({
            status: 'success',
            data: {
                team
            }
        })

    } catch (error) {
        console.log("Error while fetching team members", error)
        throw error
    }
}