import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  roleProtectedRoutes,
} from "./routes";
import { cookieName } from "./utils/values";

export async function middleware(req: Request) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName:cookieName
  });
  console.log("TOKEN FROM THE MIDDLEWARE", token)
  const url = new URL(req.url);
  const pathname = url.pathname;

  const isLoggedIn = !!token;
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);

  // ✅ UPDATED: includes dynamic `/products/[slug]`
  const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith("/products/");

  const isAuthRoute = authRoutes.includes(pathname);

  // ✅ Always allow /api/auth/*
  if (isApiAuthRoute) return NextResponse.next();

  if (pathname.startsWith("/api") && req.method === "GET") {
    return NextResponse.next();
  }

  // ✅ If already logged in and accessing /log-in etc., redirect based on role
  if (isAuthRoute && isLoggedIn) {
    const userRole = token?.role;
    const redirectPath = userRole === "admin" ? "/admin" : DEFAULT_LOGIN_REDIRECT;
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // ✅ If not logged in and route is protected
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/log-in", req.url));
  }

  // ✅ RBAC: Check if route requires specific role
  for (const route in roleProtectedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = roleProtectedRoutes[route];
      const userRole = token?.role;

      if (!allowedRoles.includes(userRole as string)) {
        // 🚫 Unauthorized access
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
