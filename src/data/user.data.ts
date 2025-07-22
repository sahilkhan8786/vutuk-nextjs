import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/user.model"
import { UserUpdateformSchema } from "@/schemas/userSchema";
import { z } from "zod";

export const getUserByEmail = async (email: string) => {
    try {
        await connectToDB();
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        console.error("Error fetching user by email:", error)
        return null
    }
}
export const getUserById = async (id: string) => {
    try {
        await connectToDB();
        const user = await User.findById(id);
        return user;
    } catch (error) {
        console.error("Error fetching user by Id:", error)
        return null
    }
}
export const updateUserById = async (id: string,data:z.infer<typeof UserUpdateformSchema>) => {
    try {
        await connectToDB();
        const user = await User.findByIdAndUpdate(id, data, {
            new:true
        });
        return user;
    } catch (error) {
        console.error("Error Updating User Based on EMAIL:", error)
        return null
    }
}


export async function updateUserImage(userId: string, imageUrl: string): Promise<void> {
  await connectToDB();

  await User.findByIdAndUpdate(
    userId,
    { image: imageUrl },
    { new: true }
  );
}