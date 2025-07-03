import { User } from "@/models/user.model"

export const getUserByEmail = async (email: string) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        console.error("Error fetching user by email:", error)
        return null
    }
}
export const getUserById = async (id: string) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        console.error("Error fetching user by email:", error)
        return null
    }
}