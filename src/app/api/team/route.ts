import { connectToDB } from "@/lib/mongodb";
import TeamMember from "@/models/team.model";
import {  NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB();
        const team = await TeamMember.find({});

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