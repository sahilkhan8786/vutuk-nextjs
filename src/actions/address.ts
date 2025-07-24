'use server';

import { auth } from "@/auth";
import { getUserById } from "@/data/user.data";
import { connectToDB } from "@/lib/mongodb";
import Address from "@/models/address.model";
import { addressFormSchema, AddressFromType } from "@/schemas/addressSchema";
import { revalidatePath } from "next/cache";

export async function createAddress(values:AddressFromType) {
    const session = await auth();

    if (!session) return {
        success: false,
        message: "You are not logged In"
    };

    const validatedFields = addressFormSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            success: false,
            message:"Please provide correct fields"
        }
    }

    const userId = session?.user?.id;

    await connectToDB();

    const user = await getUserById(userId);
    if (!user) {
        return {
            success: false,
            message: "User not found"
        };
    }

    if (user.addressCount >= 5) {
        return {
            success: false,
            message:"Single User can only add upto 5 addresses"
        }
    }

    await Address.create({
        userId,
        ...validatedFields.data
    });

    user.addressCount += 1;
    await user.save();

    revalidatePath('/dashboard/profile');
    return {
        success: true,
        message:"Address added Successfully"
    }
  

}