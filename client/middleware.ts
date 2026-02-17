import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get("auth-token")?.value

  const isPublicRoute = PUBLIC_ROUTES.some((route) => path.startsWith(route))

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/profil/:path*",
    "/servers/:path*",
    "/settings/:path*",
    "/join/:path*",
    "/conversation/:path*",
    "/login",
    "/register",
  ],
}
