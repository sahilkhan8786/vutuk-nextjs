import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/user.model"

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
        console.error("Error fetching user by email:", error)
        return null
    }
}