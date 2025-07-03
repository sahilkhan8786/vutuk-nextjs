import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";

export async function middleware(req: Request) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const url = new URL(req.url);
  const pathname = url.pathname;

  const isLoggedIn = !!token;
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // ✅ Allow /api/auth routes always
  if (isApiAuthRoute) return NextResponse.next();

  // ✅ Prevent redirect loop — don't redirect from /log-in to /log-in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
  }

  // ✅ If user is NOT logged in and trying to access a protected route
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/log-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
