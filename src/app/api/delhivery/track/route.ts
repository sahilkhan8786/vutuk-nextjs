import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const trackingId = req.nextUrl.searchParams.get("id");

    if (!trackingId) {
        return NextResponse.json({ error: "Tracking ID is required" }, { status: 400 });
    }

    try {
        const res = await fetch(
            `https://track.delhivery.com/api/v1/packages/json/?waybill=${trackingId}`,
            {
                headers: {
                    Authorization: `Token ${process.env.DELHIVERY_API_KEY}`,
                },
            }
        );

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch tracking details" }, { status: 500 });
    }
}


// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//     const { searchParams } = new URL(req.url);
//     const trackingId = searchParams.get("id");

//     // Mocked tracking data
//     const mockData = {
//         trackingId,
//         status: "Out for Delivery",
//         history: [
//             { status: "Shipment Created", location: "Delhi", date: "2025-09-15 10:00" },
//             { status: "Picked Up", location: "Delhi", date: "2025-09-16 14:30" },
//             { status: "In Transit", location: "Jaipur", date: "2025-09-17 09:45" },
//             { status: "Out for Delivery", location: "Sikar", date: "2025-09-18 08:00" },
//         ],
//         estimatedDelivery: "2025-09-19",
//     };

//     return NextResponse.json(mockData);
// }
