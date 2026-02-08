// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Récupérer le token depuis le cookie
    const token = request.cookies.get("auth-token")?.value;

    const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");

    const protectedRoutes = ["/profil", "/servers", "/(homepage)"];
    const isProtectedRoute =
        path === "/" ||
        protectedRoutes.some(route => path.startsWith(route));

    // Rediriger vers login si pas de token et route protégée
    if (!token && isProtectedRoute && !isAuthRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Rediriger vers (homepage) si déjà connecté et sur la page login
    if (token && (path === "/login" || path === "/register")) {
        return NextResponse.redirect(new URL("/(homepage)", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profil/:path*",
        "/servers/:path*",
        "/(homepage)/:path*",
        "/",
        "/login/:path*",
        "/register/:path*",
    ],
};