import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./schemas/authSchema"
import { getUserByEmail, getUserById } from "./data/user.data"
import bcrypt from "bcryptjs"
import { connectToDB } from "./lib/mongodb"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { cookieName } from "./utils/values"
import client from "./lib/db"
 
const authConfig:NextAuthConfig = {
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
        
    ],
    callbacks: {

      async session({ session, token }) {
        
        if (token.sub && session.user) {
          const user = await getUserById(token.sub);
          console.log("SESSION", session);
          console.log("TOKEN", token);
     session.user.id = user._id.toString();
      session.user.role = user.role;
      session.user.image = user.image; // ✅ This pulls the latest image
      session.user.name = user.username;
      session.user.phone = user.phone;
      session.user.isEmailVerfied = user.isEmailVerfied;
      session.user.isPhoneVerfied = user.isPhoneVerfied;
     

  }

  return session;
},

        async jwt({ token }) {
  if (!token.sub) return token;

  await connectToDB();
  const existingUser = await getUserById(token.sub);

  if (!existingUser) return token;

  token.role = existingUser.role;
  token.phone = existingUser.phone;
  token.isEmailVerfied = existingUser.isEmailVerfied;
  token.isPhoneVerfied = existingUser.isPhoneVerfied;
  token.deliverAddress = existingUser.deliverAddress;

  return token;
}

      }  ,
      cookies: {
        sessionToken: {
          name: cookieName,
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production'
          }
        }
      },
      pages: {
        signIn: '/log-in',
        
      },
      adapter: MongoDBAdapter(client),
      session:{strategy: "jwt"},


} 

export default authConfig