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

// Allowed origins for CORS
const allowedOrigins = [
  "https://vutuk.com",
  "https://www.vutuk.com",
  "https://vutuk-nextjs.vercel.app",
];

export async function middleware(req: Request) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: cookieName,
  });

  const url = new URL(req.url);
  const pathname = url.pathname;
  const origin = req.headers.get("origin");

  const isLoggedIn = !!token;
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);

  // ✅ Includes dynamic /products/[slug]
  const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith("/products/");

  const isAuthRoute = authRoutes.includes(pathname);

  // Create base response
  const response = NextResponse.next();

  // ✅ Add CORS headers for all API routes
  if (pathname.startsWith("/api")) {
    // Check if the origin is allowed
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-requested-with"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: Object.fromEntries(response.headers),
      });
    }
  }

  // ✅ Always allow /api/auth/*
  if (isApiAuthRoute) return response;

  // ✅ Allow read-only APIs & Razorpay
  if (
    (pathname.startsWith("/api") && req.method === "GET") ||
    pathname.startsWith("/api/razorpay")
  ) {
    return response;
  }

  // ✅ Already logged in → prevent going back to /log-in or /register
  if (isAuthRoute && isLoggedIn) {
    const userRole = token?.role;
    const redirectPath = userRole === "admin" ? "/admin" : DEFAULT_LOGIN_REDIRECT;
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // ✅ If NOT logged in & route is protected → redirect to homepage with ?showAuth=true
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    const loginRedirect = new URL("/", req.url);
    loginRedirect.searchParams.set("showAuth", "true");
    return NextResponse.redirect(loginRedirect);
  }

  // ✅ RBAC (Role-based access control)
  for (const route in roleProtectedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = roleProtectedRoutes[route];
      const userRole = token?.role;

      if (!allowedRoles.includes(userRole as string)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals & static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
