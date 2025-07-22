import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "admin" | "user";
      phone?: string;
      isEmailVerfied?: boolean;
      isPhoneVerfied?: boolean;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "admin" | "user";
    phone?: string;
    isEmailVerfied?: boolean;
    isPhoneVerfied?: boolean;
    image?: string;
  }
}
