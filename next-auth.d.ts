import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "admin" | "user";
      phone?: string;
      emailVerified?: boolean;
      phoneVerified?: boolean;
      countryCode?: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "admin" | "user";
    phone?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    countryCode?: string;
    image?: string;
  }
}
