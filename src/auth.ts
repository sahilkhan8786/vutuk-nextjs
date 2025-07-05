import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/db"
import authConfig from "@/auth.config"
import { getUserById } from "./data/user.data"
import { connectToDB } from "./lib/mongodb"





export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) { 
        session.user.role  = token.role as 'admin' |'user';
      }



      return session;  
    },
    async jwt({ token }) {
      if(!token.sub) return token
      await connectToDB();
      const existingUser = await getUserById(token?.sub);

      if (!existingUser) return token;
      token.role = existingUser.role;

      


      return token
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
    }
  },
  pages: {
    signIn: '/log-in',
    
  },
  adapter: MongoDBAdapter(client),
  session:{strategy: "jwt"},
 ...authConfig
})

