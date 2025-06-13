
import client from "@/lib/db"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import NextAuth from "next-auth";
import Google from "next-auth/providers/google"
import Credentials from 'next-auth/providers/credentials'
import { signInSchema } from "./schemas/sign-inSchema";
import { User } from "./models/user.model";
import { comparePassword } from "./lib/password";
// import { saltAndHashPassword } from "@/utils/password"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {label:'Email',type:'text'},
        password:{label:"Password",type:'password'}
      },
      authorize: async (credentials) => {
        let user = null;

        const { email, password } = await signInSchema.parseAsync(credentials)
        // ?CREDENTIALS
        // 1) FIND USER BASED ON THE EMAIL
        user = await User.findOne({ email });
        if (!user) {
          throw new Error("No User Found");
        };

        // 2)CHECK PASSWORD
        if (!comparePassword(password, user.password)) {
          throw new Error("Credentials are not Matching");
        };



        return user;
      }
    })
  ],
  
})