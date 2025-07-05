import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./schemas/authSchema"
import { getUserByEmail } from "./data/user.data"
import bcrypt from "bcrypt"
import { connectToDB } from "./lib/mongodb"
 
export default {
    providers: [
        Google,
        Credentials({
            async authorize(credentials) { 
                const validatedFields = loginSchema.safeParse(credentials)

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    await connectToDB();
                    const user = await getUserByEmail(email);
                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    if (passwordsMatch) return user;
               }
                return null;
            }
        }),
        
    ]
} satisfies NextAuthConfig