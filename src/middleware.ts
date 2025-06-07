import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login";

  // Get the token from the cookies
  const token = request.cookies.get("auth-token")?.value || "";

  // Redirect logic
  if (isPublicPath && token) {
    // If user is authenticated and tries to access login page,
    // redirect to home page
    return NextResponse.redirect(new URL("/bids", request.url));
  }

  if (!isPublicPath && !token) {
    // If user is not authenticated and tries to access protected page,
    // redirect to login page
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
 
export const config = {
  matcher: ["/bids", "/login", "/orders/:path*"],
}