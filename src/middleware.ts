import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicRoutes = ["/", "/log-in", "/sign-in", "/about-us"]
const loggedUserRoutes = ["/user", "/user/profile"]
const adminRoutes = ["/admin", "/admin/team"]

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ Allow all public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // ✅ Get the user's JWT from cookies
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
    

  // 🔒 Not logged in but trying to access a protected route
  const isUserRoute = loggedUserRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  if ((isUserRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL("/log-in", request.url))
  }

  // ✅ Role-based access
  if (isAdminRoute && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/not-authorized", request.url))
  }

  if (isUserRoute && token?.role !== "user") {
    return NextResponse.redirect(new URL("/not-authorized", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|woff2|ttf|map|json)).*)',
  ],
}
