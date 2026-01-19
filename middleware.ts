import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "./types/user";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Allow access to login page and authentication endpoints
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  const userRole = token.role as UserRole;

  // Define protected routes
  const inventoryRoute = pathname.startsWith("/inventory");
  const analyticsRoute = pathname.startsWith("/analytics");
  
  // SALES users cannot access inventory or analytics
  if (userRole === UserRole.SALES && (inventoryRoute || analyticsRoute)) {
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    return NextResponse.rewrite(unauthorizedUrl);
  }

  // Allow access for authorized users
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - login (sign-in page)
     * - unauthorized (unauthorized access page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api/auth|login|unauthorized|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
