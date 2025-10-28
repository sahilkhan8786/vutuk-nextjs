import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Address from '@/models/address.model'; // Make sure you have an Address model

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const addressId = await params.id;

        if (!addressId) {
            return NextResponse.json({ message: 'Address ID is required' }, { status: 400 });
        }

        await connectToDB();

        // Delete the address (you may want to check user ownership if needed)
        const deletedAddress = await Address.findByIdAndDelete(addressId);

        if (!deletedAddress) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }
}
